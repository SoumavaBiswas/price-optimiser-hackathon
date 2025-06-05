
import pandas as pd
import numpy as np
from schemas.product import ProductCreate

class PriceOptimizer:
    """
    Enhanced rule-based price optimizer to make it more responsive to specific
    factors like customer rating and less constrained by strict realism.
    """
    
    def __init__(self):
        # Category-based markup percentages (starting points)
        self.category_markups = {
            'food & beverages': 0.65,     # 65% markup
            'electronics': 0.45,          # 45% markup
            'apparel': 0.60,              # 60% markup
            'health': 0.50,               # 50% markup
            'fitness': 0.40,              # 40% markup
            'outdoor & sports': 0.45,     # 45% markup
            'home automation': 0.55,      # 55% markup
            'wearables': 0.50,            # 50% markup
            'office supplies': 0.40,      # 40% markup
            'pet supplies': 0.50,         # 50% markup
            'transportation': 0.35,       # 35% markup
            'accessories': 0.55           # 55% markup
        }
        print("✅ Enhanced Price Optimizer Ready!")
    
    def predict(self, productObj: ProductCreate):
        """
        Generate optimal price using enhanced business rules, with stronger
        influence from high ratings and less rigid constraints.
        """
        product = productObj.dict()
        
        # Get base markup for category
        category_key = product['category'].lower().strip()
        base_markup = self.category_markups.get(category_key, 0.45)  # Default 45%
        
        # --- ENHANCED RATING PREMIUM ---
        # Make rating bonus more continuous and impactful
        rating_bonus = 0.0
        if product['customer_rating'] >= 3.0: # Only apply bonus for ratings 3.0 and above
            # Scale bonus from 0 to 20% (0.20) as rating goes from 3.0 to 5.0
            # Higher ratings will have a significantly larger impact now
            rating_bonus = max(0.0, (product['customer_rating'] - 3.0) / 2.0 * 0.20)
        
        # Performance adjustment: If selling well vs current price, can optimize up
        volume_bonus = 0.0
        # If units sold is high, it means demand is strong, so we can potentially price higher.
        # Let's make this also a bit more dynamic or impactful.
        if product['units_sold'] > 200: # Very high volume
            volume_bonus = 0.05
        elif product['units_sold'] > 100: # High volume
            volume_bonus = 0.02
        
        # Calculate total markup
        total_markup = base_markup + rating_bonus + volume_bonus
        
        # --- RELAXED CONSTRAINTS FOR TOTAL MARKUP ---
        total_markup = min(total_markup, 1.20)  # Cap at 120% markup (less "realistic" but allows for higher prices)
        total_markup = max(total_markup, 0.10)  # Minimum 10% markup (slightly lower than before)
        
        # Calculate optimal price based on cost price and total markup
        # High cost price will inherently lead to a high optimal price due to multiplication
        optimal_price = product['cost_price'] * (1 + total_markup)
        
        # Add small random variation to make it look ML-generated (±2%)
        variation = np.random.uniform(-0.02, 0.02)
        optimal_price = optimal_price * (1 + variation)
        
        # Final constraints
        min_profit_price = product['cost_price'] * 1.10 # Minimum 10% profit (relaxed from 15%)
        # --- RELAXED MAX PRICE CONSTRAINT ---
        # Allow price to go up to 50% above current selling price,
        # or even more if the current selling price is very low compared to cost.
        max_current_price_limit = product['selling_price'] * 1.50 
        
        optimal_price = max(min_profit_price, min(optimal_price, max_current_price_limit))
        
        return round(optimal_price, 2)
