Param(
    # Folder containing your .fbx files
    [string]$FbxFolder = "."
)

# Hard-coded Blender path (you gave me this)
$blenderPath = "C:\Program Files\Blender Foundation\Blender 4.3\blender.exe"

# Get the folder where this script lives
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Path to the Blender Python script we will generate
$blenderPy = Join-Path $scriptDir "process_fruits_fbx.py"

# Check Blender exists
if (-not (Test-Path $blenderPath)) {
    Write-Error "Blender not found at '$blenderPath'. Update the path in this script if needed."
    exit 1
}

# Normalize FBX folder path
$FbxFolder = (Resolve-Path $FbxFolder).ProviderPath
if (-not (Test-Path $FbxFolder)) {
    Write-Error "FBX folder not found: '$FbxFolder'"
    exit 1
}

Write-Host "Using Blender:" $blenderPath
Write-Host "FBX Folder  :" $FbxFolder
Write-Host "Script dir  :" $scriptDir
Write-Host "Blender py  :" $blenderPy
Write-Host ""

Write-Host "Writing Blender Python script..."
@'
#!/usr/bin/env python3
"""
process_fruits_fbx.py

Single script that:

1. Traverses a folder of .fbx files.
2. Finds fruits that have all three models:
   - Master:   SM_<Fruit>.fbx
   - Cuts:     SM_<Fruit>CutA.fbx & SM_<Fruit>CutB.fbx
        OR     SM_<Fruit>CutTop.fbx & SM_<Fruit>CutBottom.fbx
3. For each such fruit:
   - Uses the master file to compute the world-space bounding box center
     of all meshes.
   - Computes the translation needed to move that center to the origin.
   - Applies THAT SAME translation to:
        a) The master file, and re-saves it (overwriting).
        b) Both cut files (A/B or Top/Bottom), and re-saves them.
   - Does NOT recompute the delta for the cuts.

Usage (driver PowerShell script will call this):

    blender -b --python process_fruits_fbx.py -- "C:\\path\\to\\fbx_folder"
"""

import sys
from pathlib import Path

import bpy
from mathutils import Vector


def parse_root_folder():
    """
    Blender passes its own args before "--".
    We expect the first argument after "--" to be the folder path.
    """
    argv = sys.argv
    if "--" in argv:
        argv = argv[argv.index("--") + 1:]
    else:
        argv = []

    if not argv:
        root = Path(".").resolve()
    else:
        root = Path(argv[0]).resolve()

    if not root.is_dir():
        raise SystemExit(f"ERROR: Root path is not a directory: {root}")

    return root


def classify_name(stem: str):
    """
    Given a filename stem (no extension), e.g. 'SM_AppleGreenCutTop',
    return (fruit_name, kind) where kind is one of:
        'whole', 'cutA', 'cutB', 'cutTop', 'cutBottom', or None if not matched.

    Rules:
      - Must start with 'SM_'
      - 'CutBottom', 'CutTop', 'CutA', 'CutB' suffixes are recognized
      - If no cut suffix, it's treated as the whole fruit model.
    """
    if not stem.startswith("SM_"):
        return None, None

    core = stem[3:]  # strip 'SM_'

    if core.endswith("CutBottom"):
        fruit = core[:-9]  # len("CutBottom") = 9
        kind = "cutBottom"
    elif core.endswith("CutTop"):
        fruit = core[:-6]  # len("CutTop") = 6
        kind = "cutTop"
    elif core.endswith("CutA"):
        fruit = core[:-4]  # len("CutA") = 4
        kind = "cutA"
    elif core.endswith("CutB"):
        fruit = core[:-4]  # len("CutB") = 4
        kind = "cutB"
    else:
        fruit = core
        kind = "whole"

    if not fruit:
        return None, None

    return fruit, kind


def find_complete_fruits(root: Path):
    """
    Traverse the given folder and return:

    complete_fruits: dict[str, dict] where each entry looks like:
        {
            "fruit": <fruit_name>,
            "master_path": Path to SM_<Fruit>.fbx,
            "cutA_path": Path or None,
            "cutB_path": Path or None,
            "cutTop_path": Path or None,
            "cutBottom_path": Path or None,
        }

    Only fruits that have:
        - a master file AND
        - (cutA & cutB) OR (cutTop & cutBottom)
    are included.
    """
    fruits = {}

    for path in root.glob("*.fbx"):
        stem = path.stem
        fruit, kind = classify_name(stem)
        if fruit is None or kind is None:
            continue

        if fruit not in fruits:
            fruits[fruit] = {
                "fruit": fruit,
                "master_path": None,
                "cutA_path": None,
                "cutB_path": None,
                "cutTop_path": None,
                "cutBottom_path": None,
            }

        entry = fruits[fruit]
        if kind == "whole":
            entry["master_path"] = path
        elif kind == "cutA":
            entry["cutA_path"] = path
        elif kind == "cutB":
            entry["cutB_path"] = path
        elif kind == "cutTop":
            entry["cutTop_path"] = path
        elif kind == "cutBottom":
            entry["cutBottom_path"] = path

    complete = {}
    for fruit, entry in fruits.items():
        if entry["master_path"] is None:
            continue

        has_ab = entry["cutA_path"] is not None and entry["cutB_path"] is not None
        has_tb = entry["cutTop_path"] is not None and entry["cutBottom_path"] is not None

        if has_ab or has_tb:
            complete[fruit] = entry

    return complete


def clear_scene():
    """
    Remove all objects, collections, and orphaned meshes/materials
    so we start clean for each FBX import.
    """
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)

    for coll in list(bpy.data.collections):
        bpy.data.collections.remove(coll)

    for mesh in list(bpy.data.meshes):
        bpy.data.meshes.remove(mesh)

    for mat in list(bpy.data.materials):
        bpy.data.materials.remove(mat)


def import_fbx(path: Path):
    bpy.ops.import_scene.fbx(filepath=str(path))


def export_fbx(path: Path):
    """
    Export the current scene to the given FBX path, overwriting it.
    """
    bpy.ops.export_scene.fbx(
        filepath=str(path),
        use_selection=False,
        apply_unit_scale=True,
        bake_space_transform=False,
    )


def compute_scene_bbox_center():
    """
    Compute the combined world-space bounding box center
    of all MESH objects in the scene.

    Returns:
        center (Vector) if any mesh found, otherwise Vector((0, 0, 0))
    """
    meshes = [obj for obj in bpy.context.scene.objects if obj.type == 'MESH']
    if not meshes:
        return Vector((0.0, 0.0, 0.0))

    first = meshes[0]
    corners = [first.matrix_world @ Vector(corner) for corner in first.bound_box]
    min_x = max_x = corners[0].x
    min_y = max_y = corners[0].y
    min_z = max_z = corners[0].z

    for obj in meshes:
        for corner in obj.bound_box:
            world_corner = obj.matrix_world @ Vector(corner)
            x = world_corner.x
            y = world_corner.y
            z = world_corner.z

            if x < min_x:
                min_x = x
            if x > max_x:
                max_x = x
            if y < min_y:
                min_y = y
            if y > max_y:
                max_y = y
            if z < min_z:
                min_z = z
            if z > max_z:
                max_z = z

    center = Vector((
        (min_x + max_x) * 0.5,
        (min_y + max_y) * 0.5,
        (min_z + max_z) * 0.5,
    ))
    return center


def apply_translation_to_all_objects(offset: Vector):
    """
    Move ALL objects in the scene by the given offset.
    We still only used meshes to compute the center, but we move everything
    so transforms stay consistent (armatures, empties, etc).
    """
    for obj in bpy.context.scene.objects:
        obj.location.x += offset.x
        obj.location.y += offset.y
        obj.location.z += offset.z


def process_one_fruit(entry: dict):
    """
    For a single fruit entry:
      - Load master, compute center & offset, apply to all objects, export master.
      - Then for each cut file, load it, apply SAME offset, export.
    """
    fruit_name = entry["fruit"]
    master_path = entry["master_path"]
    cutA_path = entry["cutA_path"]
    cutB_path = entry["cutB_path"]
    cutTop_path = entry["cutTop_path"]
    cutBottom_path = entry["cutBottom_path"]

    print("--------------------------------------------------")
    print(f"Fruit: {fruit_name}")
    print(f"  Master file : {master_path}")

    # 1) Process master: compute center and offset
    clear_scene()
    import_fbx(master_path)
    center = compute_scene_bbox_center()
    offset = -center

    print(f"  Center      : ({center.x:.6f}, {center.y:.6f}, {center.z:.6f})")
    print(f"  Move by     : ({offset.x:.6f}, {offset.y:.6f}, {offset.z:.6f})")

    apply_translation_to_all_objects(offset)
    export_fbx(master_path)
    print(f"  Master updated and saved: {master_path}")

    # 2) Apply SAME offset to cuts (do NOT recalc)
    # CutA / CutB
    if cutA_path is not None and cutB_path is not None:
        print(f"  Cut pair: CutA / CutB")
        # CutA
        clear_scene()
        import_fbx(cutA_path)
        apply_translation_to_all_objects(offset)
        export_fbx(cutA_path)
        print(f"    CutA updated: {cutA_path}")

        # CutB
        clear_scene()
        import_fbx(cutB_path)
        apply_translation_to_all_objects(offset)
        export_fbx(cutB_path)
        print(f"    CutB updated: {cutB_path}")

    # CutTop / CutBottom
    if cutTop_path is not None and cutBottom_path is not None:
        print(f"  Cut pair: CutTop / CutBottom")
        # CutTop
        clear_scene()
        import_fbx(cutTop_path)
        apply_translation_to_all_objects(offset)
        export_fbx(cutTop_path)
        print(f"    CutTop updated: {cutTop_path}")

        # CutBottom
        clear_scene()
        import_fbx(cutBottom_path)
        apply_translation_to_all_objects(offset)
        export_fbx(cutBottom_path)
        print(f"    CutBottom updated: {cutBottom_path}")


def main():
    root = parse_root_folder()
    print(f"Scanning folder: {root}")

    complete_fruits = find_complete_fruits(root)
    if not complete_fruits:
        print("No fruits with complete (master + cut pairs) found.")
        return

    print(f"Found {len(complete_fruits)} complete fruits.\n")

    for fruit_name in sorted(complete_fruits.keys()):
        process_one_fruit(complete_fruits[fruit_name])

    print("\nDone.")


if __name__ == "__main__":
    main()
'@ | Set-Content -Path $blenderPy -Encoding UTF8 -Force

Write-Host ""
Write-Host "Running Blender with the processing script..."
Write-Host ""

# Call Blender in background mode with our script and the FBX folder
& "$blenderPath" -b --python "$blenderPy" -- "$FbxFolder"
