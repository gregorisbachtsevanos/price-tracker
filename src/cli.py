import argparse
from .main import start_scheduler, run_once

def main():
    parser = argparse.ArgumentParser(description="Crypto/Stock Price Tracker")
    parser.add_argument("command", choices=["check", "start"], help="Run once or start scheduler")
    args = parser.parse_args()

    if args.command == "check":
        run_once()
    elif args.command == "start":
        start_scheduler()
