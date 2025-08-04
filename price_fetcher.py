import requests

def get_prices(assets):
    ids = ",".join(assets.keys())
    currencies = ",".join(set(asset["currency"] for asset in assets.values()))

    url = "https://api.coingecko.com/api/v3/simple/price"
    params = {"ids": ids, "vs_currencies": currencies}
    response = requests.get(url, params=params)
    return response.json()
