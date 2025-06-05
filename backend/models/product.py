from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database.config import Base

class Product(Base):
    """
    Represents a product in the price optimization tool.
    Attributes:
        id (int): The primary key for the product.
        name (str): The name of the product.
        description (str): A brief description of the product.
        cost_price (float): The cost price of the product.
        selling_price (float): The selling price of the product.
        category (str): The category to which the product belongs.
        stock_available (int): The number of units available in stock.
        units_sold (int): The number of units sold.
        customer_rating (float): The average customer rating of the product.
        demand_forecast (float, optional): The forecasted demand for the product.
        optimized_price (float, optional): The optimized price for the product.
        supplier_id (int): The foreign key referencing the user (seller) who supplies the product.
        user (User): The relationship to the User model, indicating the product belongs to a user.
    """
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    cost_price = Column(Float)
    selling_price = Column(Float)
    category = Column(String)
    stock_available = Column(Integer)
    units_sold = Column(Integer)
    customer_rating = Column(Float)
    demand_forecast = Column(Float, nullable=True)
    optimized_price = Column(Float, nullable=True)
    
    # Foreign key for the user (seller)
    supplier_id = Column(Integer, ForeignKey("users.id"))
    
    # Relationship with User (a product belongs to a user)
    user = relationship("User", back_populates="products")
