import json
import posixpath
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
DOCX_PATH = ROOT / "source-docs" / "me-var-pasukhi.docx"
ASSET_DIR = ROOT / "assets" / "library"
OUTPUT_JS = ROOT / "src" / "book-content.js"
EXCLUDED_IMAGE_SRCS = {"/assets/library/me-var-pasukhi-33.webp"}
EXCLUDED_TEXTS = {
    "ეს წიგნი არ არის ფუფუნება. ეს არის საჭიროება...",
    ",, ვისაც ბრძოლა შიგნით აქვს, აქ საკუთარ თავს იპოვის. “",
}

NS = {
    "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "rel": "http://schemas.openxmlformats.org/package/2006/relationships",
}


def rels_for_document(zf):
    rels = {}
    raw = zf.read("word/_rels/document.xml.rels")
    tree = ET.fromstring(raw)
    for rel in tree.findall("rel:Relationship", NS):
        rels[rel.attrib["Id"]] = rel.attrib["Target"]
    return rels


def paragraph_text(node):
    parts = []
    for text in node.findall(".//w:t", NS):
        if text.text:
            parts.append(text.text)
    return "".join(parts).strip()


def paragraph_max_size(node):
    sizes = []
    for size in node.findall(".//w:sz", NS):
        value = size.attrib.get(f"{{{NS['w']}}}val", "")
        if value.isdigit():
            sizes.append(int(value))
    return max(sizes) if sizes else 0


def paragraph_has_bold(node):
    return node.find(".//w:b", NS) is not None or node.find(".//w:bCs", NS) is not None


def is_heading_paragraph(node, text):
    clean = " ".join(text.split())
    if not clean or len(clean) > 110:
        return False
    if clean.endswith((".", ",", ":", ";", "!", "“", "\"")) and paragraph_max_size(node) < 26:
        return False
    return paragraph_max_size(node) >= 26 or paragraph_has_bold(node)


def table_text(node):
    rows = []
    for row in node.findall(".//w:tr", NS):
        cells = []
        for cell in row.findall("./w:tc", NS):
            text = " ".join(filter(None, (paragraph_text(p) for p in cell.findall("./w:p", NS))))
            if text:
                cells.append(text)
        if cells:
            rows.append(" | ".join(cells))
    return "\n".join(rows).strip()


def image_rel_ids(node):
    ids = []
    for blip in node.findall(".//a:blip", NS):
        rel_id = blip.attrib.get(f"{{{NS['r']}}}embed")
        if rel_id and rel_id not in ids:
            ids.append(rel_id)
    return ids


def write_web_image(zf, media_path, out_path):
    with zf.open(media_path) as source:
        image = Image.open(source)
        if image.mode not in {"RGB", "RGBA"}:
            image = image.convert("RGB")
        max_width = 1400
        if image.width > max_width:
            ratio = max_width / image.width
            image = image.resize((max_width, int(image.height * ratio)), Image.LANCZOS)
        image.save(out_path, "WEBP", quality=84, method=6)


def main():
    if not DOCX_PATH.exists():
        raise FileNotFoundError(DOCX_PATH)

    ASSET_DIR.mkdir(parents=True, exist_ok=True)

    with zipfile.ZipFile(DOCX_PATH) as zf:
        rels = rels_for_document(zf)
        document = ET.fromstring(zf.read("word/document.xml"))
        body = document.find("w:body", NS)
        blocks = []
        image_index = 1
        copied = {}

        for child in list(body):
            tag = child.tag.rsplit("}", 1)[-1]
            if tag == "p":
                text = paragraph_text(child)
                if text:
                    block_type = "heading" if is_heading_paragraph(child, text) else "paragraph"
                    blocks.append({"type": block_type, "text": text})

                for rel_id in image_rel_ids(child):
                    target = rels.get(rel_id)
                    if not target:
                        continue
                    media_path = posixpath.normpath(posixpath.join("word", target))
                    if media_path not in zf.namelist():
                        continue
                    if media_path not in copied:
                        filename = f"me-var-pasukhi-{image_index:02d}.webp"
                        image_index += 1
                        out_path = ASSET_DIR / filename
                        write_web_image(zf, media_path, out_path)
                        copied[media_path] = f"/assets/library/{filename}"
                    blocks.append({"type": "image", "src": copied[media_path], "alt": "მე ვარ პასუხი"})

            elif tag == "tbl":
                text = table_text(child)
                if text:
                    blocks.append({"type": "paragraph", "text": text})

                for rel_id in image_rel_ids(child):
                    target = rels.get(rel_id)
                    if not target:
                        continue
                    media_path = posixpath.normpath(posixpath.join("word", target))
                    if media_path not in copied and media_path in zf.namelist():
                        filename = f"me-var-pasukhi-{image_index:02d}.webp"
                        image_index += 1
                        out_path = ASSET_DIR / filename
                        write_web_image(zf, media_path, out_path)
                        copied[media_path] = f"/assets/library/{filename}"
                    if media_path in copied:
                        blocks.append({"type": "image", "src": copied[media_path], "alt": "მე ვარ პასუხი"})

    blocks = clean_blocks(blocks)

    payload = {
        "title": "მე ვარ პასუხი",
        "description": "დაცული ონლაინ წიგნი Team4-ის მყიდველებისთვის.",
        "cover": "/assets/book-gallery-01.webp",
        "blocks": blocks,
    }
    js = "window.Team4BookContent = "
    js += json.dumps(payload, ensure_ascii=False, indent=2)
    js += ";\n"
    OUTPUT_JS.write_text(js, encoding="utf-8")

    print(json.dumps({"blocks": len(blocks), "images": sum(1 for block in blocks if block["type"] == "image")}, ensure_ascii=False))


def clean_blocks(blocks):
    def text_of(block):
        return block.get("text", "").strip() if block.get("type") in {"paragraph", "heading"} else ""

    cleaned = [
        block
        for block in blocks
        if block.get("src") not in EXCLUDED_IMAGE_SRCS and text_of(block) not in EXCLUDED_TEXTS
    ]

    if cleaned and text_of(cleaned[0]) == "მე ვარ პასუხი":
        cleaned.pop(0)
    if cleaned and text_of(cleaned[0]) == "ლაშა ხურციძე":
        cleaned.pop(0)

    toc_start = next(
        (index for index, block in enumerate(cleaned) if text_of(block) == "სარჩევი"),
        None,
    )
    if toc_start is not None:
        toc_end = None
        for index in range(toc_start + 1, len(cleaned)):
            block = cleaned[index]
            text = text_of(block)
            if text == "კითხვა, რომელსაც გავურბოდი":
                toc_end = index
                break
        if toc_end is not None:
            del cleaned[toc_start:toc_end]

    return cleaned


if __name__ == "__main__":
    main()
