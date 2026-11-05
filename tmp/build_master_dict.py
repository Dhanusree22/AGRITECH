import json
import os

with open("/tmp/all_ui_strings.json", "r", encoding="utf-8") as f:
    ui_strings = json.load(f)

with open("/tmp/all_ui_words.json", "r", encoding="utf-8") as f:
    ui_words = json.load(f)

# Master mappings for Kannada (and high-quality multi-language support)
# We will create comprehensive mappings for every string and word.

print(f"Read {len(ui_strings)} strings and {len(ui_words)} words.")
