from textual.app import App, ComposeResult
from textual.widgets import Header, Footer, Static, ListView, ListItem
from textual.containers import Container
from textual.reactive import reactive
from textual.message import Message
from price_tracker.asset_manager import load_assets, remove_asset

class AssetListView(ListView):
    class AssetSelected(Message):
        def __init__(self, sender, symbol):
            super().__init__()
            self.symbol = symbol

    def on_list_view_selected(self, event: ListView.Selected):
        symbol = event.item.label.plain.split()[0]
        self.post_message(self.AssetSelected(self, symbol))


class TrackerTUI(App):
    CSS_PATH = "tui.css"
    selected_symbol = reactive("")

    def compose(self) -> ComposeResult:
        yield Header()
        yield Container(
            Static("📈 Tracked Assets", id="title"),
            AssetListView(*self.get_asset_items(), id="asset-list"),
        )
        yield Footer()

    def get_asset_items(self):
        assets = load_assets()
        items = []
        for symbol, data in assets.items():
            label = f"{symbol.upper():<10} ({data['type']}) | {data['currency']} | {data['threshold']}"
            items.append(ListItem(Static(label)))
        return items

    def on_mount(self):
        self.query_one(AssetListView).focus()

    def on_asset_list_view_asset_selected(self, message: AssetListView.AssetSelected):
        self.selected_symbol = message.symbol
        self.console.log(f"Selected: {self.selected_symbol}")

    def key_d(self):
        """Press 'd' to delete the selected asset."""
        if self.selected_symbol:
            remove_asset(self.selected_symbol)
            self.refresh()

    def refresh(self):
        self.query_one(AssetListView).clear()
        for item in self.get_asset_items():
            self.query_one(AssetListView).append(item)

if __name__ == "__main__":
    TrackerTUI().run()
