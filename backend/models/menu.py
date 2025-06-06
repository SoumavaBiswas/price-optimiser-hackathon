from sqlalchemy import Column, Integer, String, Float, Date
from database.config import Base


class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    meal_type = Column(String, nullable=False)  # breakfast/lunch/dinner
    base_price = Column(Float, nullable=False)
    optimized_price = Column(Float, nullable=True)
    expected_demand = Column(Integer, nullable=True)
    revenue = Column(Float, nullable=True)
    date = Column(Date, nullable=False)
    supplier_id = Column(Integer, nullable=False)  # Foreign key optional for now


