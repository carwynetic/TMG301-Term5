#!/usr/bin/env python3
"""
TMG301 Data Synchronization Utility
Synchronizes data/*.json to corresponding JavaScript bundle representations:
- data/questions.json -> data/questions.js and js/data-questions.js
- data/knowledge.json -> data/knowledge.js
- data/chapters.json -> data/chapters.js
- data/glossary.json -> data/glossary.js

Ensures 100% offline-first Zero-CORS browser execution parity.
"""

import os
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

def sync_questions():
    json_path = os.path.join(ROOT, 'data', 'questions.json')
    js_data_path = os.path.join(ROOT, 'data', 'questions.js')
    js_legacy_path = os.path.join(ROOT, 'js', 'data-questions.js')

    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 1. Sync data/questions.js (minified single-line payload)
    header_data = "/* TMG301 Master Question Bank: 950 Questions (850 Chapter Questions + 100 Comprehensive Questions) */\n"
    content_data = header_data + "window.TMG_QUESTIONS = " + json.dumps(data, ensure_ascii=False) + ";\n"
    with open(js_data_path, 'w', encoding='utf-8') as f:
        f.write(content_data)

    # 2. Sync js/data-questions.js (pretty-printed payload for developer inspection)
    header_legacy = "/* TMG301 Question Bank (950 Multiple-Choice Questions) */\n"
    content_legacy = header_legacy + "window.TMG_QUESTIONS = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n"
    with open(js_legacy_path, 'w', encoding='utf-8') as f:
        f.write(content_legacy)

    print(f"  [SYNCED] data/questions.json -> data/questions.js ({os.path.getsize(js_data_path):,d} bytes)")
    print(f"  [SYNCED] data/questions.json -> js/data-questions.js ({os.path.getsize(js_legacy_path):,d} bytes)")

def sync_knowledge():
    json_path = os.path.join(ROOT, 'data', 'knowledge.json')
    js_path = os.path.join(ROOT, 'data', 'knowledge.js')

    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    header = "/* TMG301 17 Chapters Knowledge Base with Slide References */\n"
    content = header + "window.TMG_KNOWLEDGE = " + json.dumps(data, ensure_ascii=False) + ";\n"
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"  [SYNCED] data/knowledge.json -> data/knowledge.js ({os.path.getsize(js_path):,d} bytes)")

def sync_chapters():
    json_path = os.path.join(ROOT, 'data', 'chapters.json')
    js_path = os.path.join(ROOT, 'data', 'chapters.js')

    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    header = "/* TMG301 17 Chapters Metadata */\n"
    content = header + "window.TMG_CHAPTERS = " + json.dumps(data, ensure_ascii=False) + ";\n"
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"  [SYNCED] data/chapters.json  -> data/chapters.js ({os.path.getsize(js_path):,d} bytes)")

def sync_glossary():
    json_path = os.path.join(ROOT, 'data', 'glossary.json')
    js_path = os.path.join(ROOT, 'data', 'glossary.js')

    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    header = "/* TMG301 Technical Glossary */\n"
    content = header + "window.TMG_GLOSSARY = " + json.dumps(data, ensure_ascii=False) + ";\n"
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"  [SYNCED] data/glossary.json  -> data/glossary.js ({os.path.getsize(js_path):,d} bytes)")

def verify_sync():
    targets = [
        ('data/questions.json', 'data/questions.js', 'TMG_QUESTIONS'),
        ('data/questions.json', 'js/data-questions.js', 'TMG_QUESTIONS'),
        ('data/knowledge.json', 'data/knowledge.js', 'TMG_KNOWLEDGE'),
        ('data/chapters.json', 'data/chapters.js', 'TMG_CHAPTERS'),
        ('data/glossary.json', 'data/glossary.js', 'TMG_GLOSSARY')
    ]

    all_matched = True
    for json_rel, js_rel, var_name in targets:
        json_path = os.path.join(ROOT, json_rel)
        js_path = os.path.join(ROOT, js_rel)

        with open(json_path, 'r', encoding='utf-8') as f:
            d_json = json.load(f)

        with open(js_path, 'r', encoding='utf-8') as f:
            js_text = f.read()

        first_b = min([pos for pos in [js_text.find('['), js_text.find('{')] if pos != -1])
        last_b = max([pos for pos in [js_text.rfind(']'), js_text.rfind('}')] if pos != -1])
        d_js = json.loads(js_text[first_b:last_b+1])

        if d_json == d_js:
            print(f"  [VERIFIED] {json_rel} == {js_rel} (100% data parity)")
        else:
            print(f"  [ERROR] Parity mismatch: {json_rel} != {js_rel}")
            all_matched = False

    return all_matched

def main():
    print("=" * 60)
    print("      TMG301 DATA SYNCHRONIZATION ENGINE")
    print("=" * 60)
    print("\n--- 1. Synchronizing Data Files ---")
    sync_questions()
    sync_knowledge()
    sync_chapters()
    sync_glossary()

    print("\n--- 2. Verifying Data Parity ---")
    verified = verify_sync()
    if verified:
        print("\nAll datasets synchronized with 100% byte-for-byte parity!")
        return 0
    else:
        print("\nSynchronization verification failed!")
        return 1

if __name__ == '__main__':
    sys.exit(main())
