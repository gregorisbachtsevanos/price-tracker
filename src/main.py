import schedule
import time
from .price_fetcher import get_all_prices
from .notifier import send_email, send_telegram
from .logger import log_alert
from . import config
from .config import load_assets

def check_prices():
    assets = load_assets()
    prices = get_all_prices(assets)

    for symbol, meta in config.ASSETS.items():
        price = prices.get(symbol)
        threshold = meta["threshold"]
        if price is None:
            print(f"Failed to fetch {symbol.upper()}")
            continue

        print(f"{symbol.upper()} = {price} {meta['currency'].upper()}")

        if price < threshold:
            msg = f"[ALERT] {symbol.upper()} ({meta['type'].upper()}) dropped below {threshold}.\nCurrent: {price} {meta['currency'].upper()}"

            if config.ENABLE_EMAIL:
                send_email(f"{symbol.upper()} Alert", msg, config.TO_EMAIL)
            if config.ENABLE_TELEGRAM:
                send_telegram(msg)

            log_alert(symbol, meta["type"], price, threshold, meta["currency"])

def run_once():
    from .alert import check_prices
    check_prices()

def run_scheduler():
    print("⏱ Scheduler started: checking every hour.")
    import schedule
    from .alert import check_prices

    schedule.every(1).hours.do(check_prices)

    try:
        while True:
            schedule.run_pending()
            time.sleep(1)
    except KeyboardInterrupt:
        print("🛑 Scheduler stopped.")

def start_scheduler():
    print("Running every 1 hour...")
    check_prices()
    schedule.every(1).hours.do(check_prices)
    while True:
        schedule.run_pending()
        time.sleep(1)
