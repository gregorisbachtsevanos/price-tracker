import schedule
import time

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
