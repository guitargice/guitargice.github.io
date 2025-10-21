#!/usr/bin/env python3
from xml.etree import ElementTree as ET
from pathlib import Path

svg_path = Path("keyboard.svg")  # update path as needed
root = ET.fromstring(svg_path.read_text(encoding="utf-8", errors="ignore"))

def local(tag):
    return tag.split('}', 1)[1] if '}' in tag else tag

INKSCAPE = "http://www.inkscape.org/namespaces/inkscape"
def ns_attr(el, ns, name):
    return el.get(f"{{{ns}}}{name}")

def group_name(g):
    label = ns_attr(g, INKSCAPE, "label")
    if label:
        return label
    gid = g.get("id")
    if gid:
        return gid
    for ch in g:
        if local(ch.tag) == "title" and (ch.text or "").strip():
            return ch.text.strip()
    return "(unnamed group)"

# collect only top-level <g> groups directly under <svg>
groups = [g for g in root.findall("./*") if local(g.tag) == "g"]

for g in groups:
    print(group_name(g))
