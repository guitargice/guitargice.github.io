import argparse
import subprocess
import shutil
from pathlib import Path
import os
from concurrent.futures import ProcessPoolExecutor, as_completed

from PIL import Image


def has_pngquant():
    """Check if pngquant is available on the system PATH."""
    return shutil.which("pngquant") is not None


def compress_with_pngquant(input_path: Path, output_path: Path, quality: str = "70-95"):
    """
    Use pngquant for strong PNG compression.
    quality is a string like '70-95' (min-max).
    """
    cmd = [
        "pngquant",
        "--force",
        f"--output={output_path}",
        f"--quality={quality}",
        "--speed=1",
        str(input_path),
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"pngquant failed for {input_path}:\n{result.stderr}")


def compress_with_pillow(input_path: Path, output_path: Path, mode: str):
    """
    Compress PNG using Pillow only.
    mode: 'lossless' or 'small'
    """
    with Image.open(input_path) as im:
        im.load()

        if mode == "small":
            # Convert to an 8-bit palette-based image with adaptive palette
            # This can reduce size significantly while staying visually good.
            # Transparency is preserved if present.
            if "A" in im.getbands():
                alpha = im.getchannel("A")
                rgb = im.convert("RGB")
                paletted = rgb.convert("P", palette=Image.ADAPTIVE, colors=256)
                paletted.putalpha(alpha)
                im = paletted
            else:
                im = im.convert("P", palette=Image.ADAPTIVE, colors=256)

        # Save optimized PNG (lossless in terms of PNG encoding)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        im.save(
            output_path,
            format="PNG",
            optimize=True,
            compress_level=9,  # 0 = none, 9 = max compression
        )


def compress_png(
    input_path: Path,
    output_path: Path,
    mode: str = "lossless",
    use_pngquant_if_available: bool = True,
) -> bool:
    """
    Compress a single PNG.
    Returns True if we attempted and wrote a file (even if later discarded).
    """
    output_path.parent.mkdir(parents=True, exist_ok=True)

    if mode == "small" and use_pngquant_if_available and has_pngquant():
        try:
            compress_with_pngquant(input_path, output_path)
            return True
        except Exception as e:
            print(f"[WARN] pngquant failed for {input_path.name}, falling back to Pillow: {e}")

    # Fallback or lossless path
    compress_with_pillow(input_path, output_path, mode=mode)
    return True


def pretty_bytes(n: int) -> str:
    """Human-readable byte sizes."""
    for unit in ["B", "KB", "MB"]:
        if n < 1024.0:
            return f"{n:.1f}{unit}"
        n /= 1024.0
    return f"{n:.1f}GB"


def process_one_file(task):
    """
    Worker function to process a single file in a separate process.

    task: (src, dst, relative_str, mode, overwrite)
    Returns a log message string.
    """
    src, dst, relative, mode, overwrite = task

    try:
        # If output exists and we shouldn't overwrite, skip
        if dst.exists() and not overwrite:
            return f"[SKIP] {relative} (already exists in output, use --overwrite)"

        # Compress
        success = compress_png(src, dst, mode=mode)
        if not success:
            return f"[ERROR] Compression failed for {relative}"

        # Ensure output exists
        if not dst.exists():
            return f"[ERROR] Compression output missing for {relative}"

        original_size = src.stat().st_size
        new_size = dst.stat().st_size

        # If new size is not smaller, delete it and indicate discard
        if new_size >= original_size:
            dst.unlink(missing_ok=True)
            return (
                f"[DISCARD] {relative} — new file not smaller "
                f"({pretty_bytes(new_size)} >= {pretty_bytes(original_size)})"
            )

        saved_pct = (original_size - new_size) / original_size * 100.0

        return (
            f"[OK] {relative}  "
            f"{pretty_bytes(original_size)} -> {pretty_bytes(new_size)} "
            f"({saved_pct:.1f}% smaller)"
        )

    except Exception as e:
        # In case of any error, try to clean partial output
        try:
            if dst.exists():
                dst.unlink()
        except Exception:
            pass
        return f"[ERROR] Failed to compress {relative}: {e}"


def process_folder(
    input_dir: Path,
    output_dir: Path,
    mode: str = "lossless",
    recursive: bool = False,
    overwrite: bool = False,
    workers: int | None = None,
):
    if not input_dir.exists():
        raise FileNotFoundError(f"Input directory does not exist: {input_dir}")

    pattern = "**/*.png" if recursive else "*.png"
    png_files = list(input_dir.glob(pattern))

    if not png_files:
        print("No PNG files found.")
        return

    if workers is None or workers <= 0:
        workers = os.cpu_count() or 1

    print(f"Found {len(png_files)} PNG file(s) in {input_dir} (recursive={recursive})")
    print(f"Mode: {mode}, output dir: {output_dir}")
    print(f"Using up to {workers} workers\n")

    # Build task list
    tasks = []
    for src in png_files:
        relative = src.relative_to(input_dir)
        dst = output_dir / relative
        tasks.append((src, dst, str(relative), mode, overwrite))

    # Run in parallel
    with ProcessPoolExecutor(max_workers=workers) as executor:
        future_to_task = {executor.submit(process_one_file, t): t for t in tasks}
        for future in as_completed(future_to_task):
            msg = future.result()
            print(msg)


def main():
    parser = argparse.ArgumentParser(
        description="Compress PNG files in a folder while keeping dimensions."
    )
    parser.add_argument(
        "input_dir",
        type=str,
        help="Folder containing PNG files to compress",
    )
    parser.add_argument(
        "-o",
        "--output-dir",
        type=str,
        default="compressed_pngs",
        help="Output folder (default: ./compressed_pngs)",
    )
    parser.add_argument(
        "-m",
        "--mode",
        choices=["lossless", "small"],
        default="lossless",
        help=(
            "Compression mode: "
            "'lossless' = safest, perfect pixels; "
            "'small' = smaller files, still good quality (may use pngquant if installed)."
        ),
    )
    parser.add_argument(
        "-r",
        "--recursive",
        action="store_true",
        help="Scan subfolders recursively for PNG files",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Overwrite files in the output directory if they already exist",
    )
    parser.add_argument(
        "-w",
        "--workers",
        type=int,
        default=None,
        help="Number of parallel workers (default: number of CPU cores)",
    )

    args = parser.parse_args()

    input_dir = Path(args.input_dir).expanduser().resolve()
    output_dir = Path(args.output_dir).expanduser().resolve()

    process_folder(
        input_dir=input_dir,
        output_dir=output_dir,
        mode=args.mode,
        recursive=args.recursive,
        overwrite=args.overwrite,
        workers=args.workers,
    )


if __name__ == "__main__":
    main()
