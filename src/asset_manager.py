import json
import os
from . import config

ASSET_FILE = config.ASSET_FILE

def load_assets():
    with open(ASSET_FILE, "r") as f:
        return json.load(f)

def save_assets(assets):
    with open(ASSET_FILE, "w") as f:
        json.dump(assets, f, indent=2)

def add_asset(symbol, asset_type, currency, threshold):
    assets = load_assets()
    symbol_key = symbol.lower() if asset_type == "crypto" else symbol.upper()

    if symbol_key in assets:
        print(f"⚠️ {symbol} already exists.")
        return

    assets[symbol_key] = {
        "type": asset_type.lower(),
        "currency": currency.lower(),
        "threshold": float(threshold)
    }

    save_assets(assets)
    print(f"✅ Added {symbol_key} ({asset_type}) to assets.")

def remove_asset(symbol):
    assets = load_assets()
    key = symbol.lower() if symbol.lower() in assets else symbol.upper()

    if key not in assets:
        print(f"❌ Asset {symbol} not found.")
        return

    del assets[key]
    save_assets(assets)
    print(f"🗑️ Removed asset {key}.")

def list_assets():
    assets = load_assets()
    if not assets:
        print("📭 No assets tracked.")
        return

    print("📋 Currently tracked assets:\n")
    for symbol, meta in assets.items():
        print(f" - {symbol.upper():<10} ({meta['type']}) | Currency: {meta['currency']} | Threshold: {meta['threshold']}")
