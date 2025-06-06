from pydantic import BaseModel
from typing import Optional
from datetime import date

class MenuCreate(BaseModel):
    name: str
    meal_type: str
    base_price: float
    date: date

class MenuResponse(MenuCreate):
    id: int
    optimized_price: Optional[float]
    expected_demand: Optional[int]
    revenue: Optional[float]

    class Config:
        orm_mode = True
