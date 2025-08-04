# 📈 Price Tracker CLI

Track cryptocurrency, stocks, ETFs, and forex prices with alerting via **Email** and **Telegram**, scheduled monitoring, and **monthly CSV logging** — all from a convenient **CLI tool** or **Docker container**.

---

## Features

✅ Monitor **multiple asset types** (crypto, stocks, ETFs, forex)  
✅ Send **alerts** when price drops below a defined threshold  
✅ **Email + Telegram** alert support  
✅ **Hourly** price check scheduler  
✅ **Monthly CSV logs** (`logs/YYYY-MM.csv`)  
✅ Packaged as a CLI tool: `price-tracker check` or `start`  
✅ Fully **Dockerized** for easy deployment

---

## Installation

### Local Python CLI

```
git clone https://github.com/your-username/price-tracker.git
cd price-tracker
pip install -e .
```

You can now use the CLI tool globally:

```
price-tracker check
price-tracker start
```

## Configuration

Create a .env file in the root folder:

```
EMAIL=your-email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
TELEGRAM_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
```

Configure assets and alert thresholds:

```
ASSETS = {
    "bitcoin": {"type": "crypto", "currency": "usd", "threshold": 60000},
    "ethereum": {"type": "crypto", "currency": "usd", "threshold": 3500},
    "AAPL": {"type": "stock", "currency": "usd", "threshold": 180},
    "SPY": {"type": "etf", "currency": "usd", "threshold": 450},
    "EURUSD=X": {"type": "forex", "currency": "usd", "threshold": 1.07},
}

TO_EMAIL = "test@mail.com"
ENABLE_EMAIL = True
ENABLE_TELEGRAM = True
```

## Usage

### Once installed (or inside Docker), you can use the CLI:

```
price-tracker <command> [options]
```

#### Available Commands

```
Command	Description
price-tracker check	Run one-time price check on all tracked assets
price-tracker start	Start the hourly scheduler for continuous tracking
price-tracker add	Add a new asset to be tracked
price-tracker remove	Remove a tracked asset
price-tracker list	List all currently tracked assets
```

##### Examples

##### Add an Asset

```
price-tracker add --symbol BTC --type crypto --currency usd --threshold 60000
price-tracker add --symbol AAPL --type stock --currency usd --threshold 180
price-tracker add --symbol EURUSD=X --type forex --currency usd --threshold 1.1
```

##### List Tracked Assets

`price-tracker list`

```
Currently tracked assets:
 - BTC        (crypto) | Currency: usd | Threshold: 60000
 - AAPL       (stock)  | Currency: usd | Threshold: 180
```

##### Remove an Asset

`price-tracker remove --symbol BTC`

### Run a Single Check

```
price-tracker check
```

Checks all asset prices once and triggers alerts if needed.

### Start Hourly Scheduler

```
price-tracker start
```

Runs in the background and checks prices every hour.

## View Logs

Logged to CSV in the logs/ folder (auto-created):

`logs/2025-08.csv`

Contains:

```
Timestamp	Symbol	Type	Price	Threshold	Currency
2025-08-01T08:00:00	BTC	crypto	58700	60000	usd
```

## Docker Setup

Dockerfile

`Docker is already configured to use the CLI tool inside the container.`

### Build

```
docker build -t price-tracker .
```

### Run (once)

```
docker run --env-file .env price-tracker check
```

### Run with scheduler in background

```
docker run -d --restart unless-stopped --env-file .env price-tracker start
```

_Logs and alerts are saved inside the container unless mounted._

CLI Usage
