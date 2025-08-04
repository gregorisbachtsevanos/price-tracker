import argparse
from .main import start_scheduler,run_scheduler, run_once
from .asset_manager import add_asset, remove_asset, list_assets
from price_tracker.tui import TrackerTUI 
import click

def main():
    parser = argparse.ArgumentParser(description="Price Tracker CLI")
    subparsers = parser.add_subparsers(dest="command")

    subparsers.add_parser("check", help="Run price check once")
    subparsers.add_parser("start", help="Run hourly scheduler")
    subparsers.add_parser("list", help="List all tracked assets")

    add_parser = subparsers.add_parser("add", help="Add a new asset to track")
    add_parser.add_argument("--symbol", required=True)
    add_parser.add_argument("--type", required=True, choices=["crypto", "stock", "etf", "forex"])
    add_parser.add_argument("--currency", required=True)
    add_parser.add_argument("--threshold", required=True)

    remove_parser = subparsers.add_parser("remove", help="Remove an asset")
    remove_parser.add_argument("--symbol", required=True, help="Symbol to remove (e.g. BTC)")

    args = parser.parse_args()

    if args.command == "check":
        run_once()
    elif args.command == "start":
        start_scheduler()
    elif args.command == "add":
        add_asset(args.symbol, args.type, args.currency, args.threshold)
    elif args.command == "remove":
        remove_asset(args.symbol)
    elif args.command == "list":
        list_assets()
    else:
        parser.print_help()

@click.group()
def cli():
    pass

@cli.command()
@click.option("--symbol", required=True)
@click.option("--type", type=click.Choice(["crypto", "stock", "etf", "forex"]), required=True)
@click.option("--currency", default="usd")
@click.option("--threshold", type=float, required=True)
def add(symbol, type, currency, threshold):
    """Add a new asset to track."""
    add_asset(symbol, type, currency, threshold)

@cli.command()
@click.option("--symbol", required=True)
def remove(symbol):
    """Remove a tracked asset."""
    remove_asset(symbol)

@cli.command()
def list():
    """List all tracked assets."""
    list_assets()

@cli.command()
def check():
    """Run a one-time price check."""
    run_once()

@cli.command()
def start():
    """Start the scheduler (runs every hour)."""
    run_scheduler   ()

@cli.command()
def tui():
    """Launch the TUI (text user interface)."""
    TrackerTUI().run()

if __name__ == "__main__":
    cli()