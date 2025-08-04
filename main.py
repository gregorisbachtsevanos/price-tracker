import schedule
import time
from price_fetcher import get_prices
from notifier import send_email, send_telegram
import config

def check_prices():
    prices = get_prices(config.ASSETS)

    for asset, data in config.ASSETS.items():
        current_price = prices[asset][data["currency"]]
        threshold = data["threshold"]

        print(f"{asset.upper()} = {current_price} {data['currency'].upper()}")

        if current_price < threshold:
            alert_msg = f"[ALERT] {asset.upper()} is below {threshold} — Current: {current_price}"

            if config.ENABLE_EMAIL:
                send_email(f"{asset.upper()} Price Alert", alert_msg, config.TO_EMAIL)

            if config.ENABLE_TELEGRAM:
                send_telegram(alert_msg)

schedule.every(1).hours.do(check_prices)

if __name__ == "__main__":
    print("Crypto Tracker Started. Running every 1 hour.")
    check_prices()  # Run immediately
    while True:
        schedule.run_pending()
        time.sleep(1)
