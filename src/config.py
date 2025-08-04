import json
import os

ASSET_FILE = os.path.join(os.path.dirname(__file__), "data/assets.json")

def load_assets():
    with open(ASSET_FILE, "r") as f:
        return json.load(f)

TO_EMAIL = "test@mail.com"
ENABLE_EMAIL = True
ENABLE_TELEGRAM = True
