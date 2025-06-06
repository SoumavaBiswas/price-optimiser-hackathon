import pandas as pd
from datetime import datetime


class MenuPriceOptimizer:
    def __init__(self):
        self.base_markup = 0.35
        self.weekend_bonus = 0.05
        self.demand_surge_markup = 0.10

    def predict(self, base_price: float, expected_demand: int, meal_type: str, date: str) -> float:
        markup = self.base_markup
        day = pd.to_datetime(date).day_name()

        if day in ["Saturday", "Sunday"]:
            markup += self.weekend_bonus

        if expected_demand > 100:
            markup += self.demand_surge_markup

        markup = min(markup, 0.60)
        markup = max(markup, 0.15)

        return round(base_price * (1 + markup), 2)


def load_booking_data(csv_path: str) -> pd.DataFrame:
    return pd.read_csv(csv_path, parse_dates=["check_in_date", "check_out_date"])


def get_total_headcount_for_date(df: pd.DataFrame, target_date_str: str) -> int:
    target_date = pd.to_datetime(target_date_str)
    active_bookings = df[
        (df["check_in_date"] <= target_date) & (df["check_out_date"] > target_date)
    ]
    return active_bookings["guest_count"].sum()


def estimate_meal_demand(headcount: int, meal_type: str) -> int:
    base_percentage = {
        "breakfast": 0.4,
        "lunch": 0.5,
        "dinner": 0.45
    }
    return int(headcount * base_percentage.get(meal_type, 0.4))


def run_menu_pricing_for_date(target_date: str, csv_path: str, menu_items: list) -> list:
    df = load_booking_data(csv_path)
    headcount = get_total_headcount_for_date(df, target_date)
    optimizer = MenuPriceOptimizer()

    results = []
    for item in menu_items:
        demand = estimate_meal_demand(headcount, item["meal_type"])
        optimized_price = optimizer.predict(item["base_price"], demand, item["meal_type"], target_date)
        results.append({
            "name": item["name"],
            "base_price": item["base_price"],
            "meal_type": item["meal_type"],
            "optimized_price": optimized_price,
            "expected_demand": demand,
            "revenue": round(optimized_price * demand, 2)
        })
    return results

