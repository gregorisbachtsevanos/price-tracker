import os
import csv
from datetime import datetime

def log_alert(symbol, asset_type, price, threshold, currency):
    now = datetime.now()
    log_dir = "logs"
    os.makedirs(log_dir, exist_ok=True)
    log_file = os.path.join(log_dir, f"{now.strftime('%Y-%m')}.csv")

    file_exists = os.path.isfile(log_file)

    with open(log_file, "a", newline="") as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(["Timestamp", "Symbol", "Type", "Price", "Threshold", "Currency"])
        writer.writerow([now.isoformat(), symbol, asset_type, price, threshold, currency])
