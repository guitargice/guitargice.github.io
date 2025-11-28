#!/usr/bin/env python3
"""
process_fruits_fbx.py

Single script that:

1. Traverses a folder of .fbx files.
2. Finds fruits that have all three models:
   - Master:   SM_<Fruit>.fbx
   - Cuts:     SM_<Fruit>CutA.fbx & SM_<Fruit>CutB.fbx
        OR     SM_<Fruit>CutTop.fbx & SM_<Fruit>CutBottom.fbx
3. For each such fruit, treats SM_<Fruit>.fbx as the master file, loads it,
   computes the bounding-box center in world space, and prints the translation
   vector needed to move that center to the origin.

Usage:

    blender -b --python process_fruits_fbx.py -- "C:\\path\\to\\fbx_folder"

Output:

    Fruit: AppleGreen
      Master file : C:\...\SM_AppleGreen.fbx
      Center      : (x, y, z)
      Move by     : (-x, -y, -z)

No files are modified or saved; we only print the offsets.
"""

import sys
from pathlib import Path

import bpy
from mathutils import Vector


# ---------------------------------------------------------------------------
# Argument parsing
# ---------------------------------------------------------------------------

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
        # Default to current working directory if none given
        root = Path(".").resolve()
    else:
        root = Path(argv[0]).resolve()

    if not root.is_dir():
        raise SystemExit(f"ERROR: Root path is not a directory: {root}")

    return root


# ---------------------------------------------------------------------------
# Filename classification and grouping
# ---------------------------------------------------------------------------

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

    # Check suffixes longest to shortest to avoid partial conflicts
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
        # No recognized cut suffix => whole fruit model
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
            "has_cutA": bool,
            "has_cutB": bool,
            "has_cutTop": bool,
            "has_cutBottom": bool,
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
            # Ignore files that don't fit the naming scheme
            continue

        if fruit not in fruits:
            fruits[fruit] = {
                "fruit": fruit,
                "master_path": None,
                "has_cutA": False,
                "has_cutB": False,
                "has_cutTop": False,
                "has_cutBottom": False,
            }

        entry = fruits[fruit]
        if kind == "whole":
            entry["master_path"] = path
        elif kind == "cutA":
            entry["has_cutA"] = True
        elif kind == "cutB":
            entry["has_cutB"] = True
        elif kind == "cutTop":
            entry["has_cutTop"] = True
        elif kind == "cutBottom":
            entry["has_cutBottom"] = True

    # Filter to only complete fruits
    complete = {}
    for fruit, entry in fruits.items():
        if entry["master_path"] is None:
            continue

        has_ab = entry["has_cutA"] and entry["has_cutB"]
        has_tb = entry["has_cutTop"] and entry["has_cutBottom"]

        if has_ab or has_tb:
            complete[fruit] = entry

    return complete


# ---------------------------------------------------------------------------
# Blender-side helpers
# ---------------------------------------------------------------------------

def clear_scene():
    """
    Remove all objects, collections, and orphaned meshes/materials
    so we start clean for each FBX import.
    """
    # Delete objects
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)

    # Remove collections
    for coll in list(bpy.data.collections):
        bpy.data.collections.remove(coll)

    # Remove meshes
    for mesh in list(bpy.data.meshes):
        bpy.data.meshes.remove(mesh)

    # Optionally remove materials, etc.
    for mat in list(bpy.data.materials):
        bpy.data.materials.remove(mat)


def import_fbx(path: Path):
    bpy.ops.import_scene.fbx(filepath=str(path))


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

    # Initialize mins and maxes from first mesh's first bbox corner
    first = meshes[0]
    corners = [first.matrix_world @ Vector(corner) for corner in first.bound_box]
    min_x = max_x = corners[0].x
    min_y = max_y = corners[0].y
    min_z = max_z = corners[0].z

    # Iterate over all meshes and all bbox corners
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


# ---------------------------------------------------------------------------
# Main processing
# ---------------------------------------------------------------------------

def main():
    root = parse_root_folder()
    print(f"Scanning folder: {root}")

    complete_fruits = find_complete_fruits(root)
    if not complete_fruits:
        print("No fruits with complete (master + cut pairs) found.")
        return

    print(f"Found {len(complete_fruits)} complete fruits.\n")

    for fruit_name in sorted(complete_fruits.keys()):
        entry = complete_fruits[fruit_name]
        master_path = entry["master_path"]

        if master_path is None:
            # Should not happen due to filtering, but guard anyway
            continue

        print("--------------------------------------------------")
        print(f"Fruit: {fruit_name}")
        print(f"  Master file : {master_path}")

        # Load master FBX into a clean scene and compute center
        clear_scene()
        import_fbx(master_path)
        center = compute_scene_bbox_center()
        offset = -center

        print(f"  Center      : ({center.x:.6f}, {center.y:.6f}, {center.z:.6f})")
        print(f"  Move by     : ({offset.x:.6f}, {offset.y:.6f}, {offset.z:.6f})")

    print("\nDone.")


if __name__ == "__main__":
    main()
