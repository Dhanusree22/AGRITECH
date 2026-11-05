# Master UI Phrases for all 7 languages
import json

with open("/tmp/master_phrase_keys.json", "r", encoding="utf-8") as f:
    master_keys = json.load(f)

# Base Kannada phrases
import sys
sys.path.append("/tmp")
from create_all_translations import kn_phrases

print(f"Loaded {len(master_keys)} master keys and {len(kn_phrases)} Kannada phrases.")
