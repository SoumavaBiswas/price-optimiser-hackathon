from pydantic import BaseModel
from typing import Optional, List

# Request schema for creating/updating a product
class ProductCreate(BaseModel):
    name: str
    description: str
    cost_price: float
    selling_price: float
    category: str
    stock_available: int
    units_sold: int
    customer_rating: Optional[float] = 4.0
    demand_forecast: Optional[float] = None
    optimized_price: Optional[float] = None

# Response schema for reading a product
class ProductResponse(ProductCreate):
    id: int

    class Config:
        from_attributes = True


class ForecastRequest(BaseModel):
    product_ids: List[int]  # List of product IDs # List of products to forecast

class ForecastResponse(BaseModel):
    product_id: int
    demand: float

class OptimizePriceResponse(BaseModel):
    optimized_prices: List[dict] 
