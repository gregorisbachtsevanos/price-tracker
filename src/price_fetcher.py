import requests
import yfinance as yf

def get_crypto_prices(assets):
    ids = ",".join([k for k, v in assets.items() if v["type"] == "crypto"])
    url = "https://api.coingecko.com/api/v3/simple/price"
    params = {"ids": ids, "vs_currencies": "usd"}
    resp = requests.get(url, params=params).json()
    return {k: resp[k]["usd"] for k in resp}

def get_yf_prices(assets):
    symbols = [k for k, v in assets.items() if v["type"] in ("stock", "etf", "forex")]
    if not symbols:
        return {}
    tickers = yf.Tickers(" ".join(symbols)).tickers
    prices = {}
    for symbol in symbols:
        ticker = tickers[symbol]
        try:
            prices[symbol] = round(ticker.history(period="1d")["Close"].iloc[-1], 4)
        except:
            prices[symbol] = None
    return prices

def get_all_prices(assets):
    prices = {}
    prices.update(get_crypto_prices(assets))
    prices.update(get_yf_prices(assets))
    return prices
