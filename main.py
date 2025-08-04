import schedule
import time
from .price_fetcher import get_all_prices
from .notifier import send_email, send_telegram
from .logger import log_alert
from . import config

def check_prices():
    prices = get_all_prices(config.ASSETS)

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
    check_prices()

def start_scheduler():
    print("Running every 1 hour...")
    check_prices()
    schedule.every(1).hours.do(check_prices)
    while True:
        schedule.run_pending()
        time.sleep(1)
