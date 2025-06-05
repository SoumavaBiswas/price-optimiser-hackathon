"""
This module defines the API routes for managing products in the price optimization tool.
Routes:
    - POST /products/:
        Create a new product with an optimized price.
        Accessible by users with the "supplier" role.
    - GET /products/:
        List all products.
        Accessible by all authenticated users. Buyers do not see "optimized_price" and "demand_forecast" fields.
    - PUT /products/{product_id}:
        Update an existing product.
        Accessible by users with "admin" or "supplier" roles. Suppliers can only update their own products.
    - DELETE /products/{product_id}:
        Accessible by users with "admin" or "supplier" roles. Suppliers can only delete their own products.
    - POST /products/forecast:
        Get forecasted demand for a list of product IDs.
        Accessible by users with "admin" or "supplier" roles.
Dependencies:
    - has_role: Dependency to check if the user has the required role.
    - get_current_user: Dependency to get the current authenticated user.
    - get_db: Dependency to get the database session.
Models:
    - Product: The product model.
    - User: The user model.
Schemas:
    - ProductCreate: Schema for creating a product.
    - ProductResponse: Schema for the product response.
    - ForecastRequest: Schema for the forecast request.
    - ForecastResponse: Schema for the forecast response.
Services:
    - forecast_demand: Service to forecast product demand.
    - PriceOptimizer: Service to optimize product prices.
Utilities:
    - pandas (pd): Utility for data manipulation and analysis.
"""
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.product import Product
from schemas.product import ProductCreate, ProductResponse, ForecastRequest, ForecastResponse
from utils.dependencies import has_role, get_current_user
from models.user import User
from database.config import get_db
from typing import List
from utils.mapper import convert_to_product_create
from services.price_optimizer import PriceOptimizer
from services.demand_forecaster import DemandForecaster

router = APIRouter(prefix="/products", tags=["products"])
price_optimizer = PriceOptimizer() 
demand_forecaster = DemandForecaster()

# Suppliers can create or update products
@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(has_role(["supplier"]))])
async def create_product(product: ProductCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    This endpoint allows a user with the "supplier" role to create a new product. 
    It uses a price optimization tool to predict an optimized price for the product 
    and stores the product in the database.
    Args:
        product (ProductCreate): The product data to be created.
        db (AsyncSession, optional): The database session dependency. Defaults to Depends(get_db).
        current_user (User, optional): The current authenticated user. Defaults to Depends(get_current_user).
    Returns:
        Product: The newly created product with the optimized price.
    Raises:
        HTTPException: If there is an error during the product creation process, 
                       an HTTP 500 error is raised with the error details.
    """
   
    try:
        
        optimized_price = price_optimizer.predict(product)
        product_obj = convert_to_product_create(product)
        demand = demand_forecaster.predict(product_obj) 
        
        product_dict = product.dict()
        
        if optimized_price:
            product_dict["optimized_price"] = round(float(optimized_price),2)
        
        if demand:
            total = product_obj.stock_available
            demand_percentage = min((demand/total)*100, 100)
            product_dict["demand_forecast"] = round(float(demand_percentage),2)

        
        db_product = Product(
            **product_dict, supplier_id=current_user.id
        )
        db.add(db_product)
        await db.commit()
        await db.refresh(db_product)
        return db_product
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# Buyers can read all products excluding 'optimized_price' and 'demand_forecast'
@router.get("/", response_model=List[ProductResponse])
async def list_products(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    List all products from the database.

    This function retrieves all products from the database and returns them. If the current user has the role of "buyer",
    the function excludes the "optimized_price" and "demand_forecast" fields from the product data.

    Args:
        db (AsyncSession): The database session dependency.
        current_user (User): The current authenticated user dependency.

    Returns:
        List[dict]: A list of products. If the user is a buyer, certain fields are excluded from the product data.
    """
    result = await db.execute(select(Product))
    products = result.scalars().all()

    if current_user.role == "buyer":
        products = [product.dict(exclude={"optimized_price", "demand_forecast"}) for product in products]

    return products

# Admin can update any product, supplier can only update their own products
@router.put("/{product_id}", response_model=ProductResponse, dependencies=[Depends(has_role(["admin", "supplier"]))])
async def update_product(product_id: int, product: ProductCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Update an existing product in the database.
    Args:
        product_id (int): The ID of the product to update.
        product (ProductCreate): The product data to update.
        db (AsyncSession, optional): The database session. Defaults to Depends(get_db).
        current_user (User, optional): The current authenticated user. Defaults to Depends(get_current_user).
    Raises:
        HTTPException: If the product is not found (404).
        HTTPException: If the current user is a supplier and does not own the product (403).
    Returns:
        Product: The updated product.
    """
    result = await db.execute(select(Product).where(Product.id == product_id))
    db_product = result.scalars().first()

    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Ensure supplier can only update their own product
    if current_user.role == "supplier" and current_user.id != db_product.user_id:
        raise HTTPException(status_code=403, detail="You can only update your own products")

    optimized_price = price_optimizer.predict(product)
    product_obj = convert_to_product_create(product)
    demand = demand_forecaster.predict(product_obj) 
    total = product_obj.stock_available
    demand_percentage = min((demand/total)*100, 100)
    
    for key, value in product.model_dump().items():
        setattr(db_product, key, value)
    setattr(db_product, 'optimized_price', round(float(optimized_price),2))
    setattr(db_product, 'demand_forecast', round(float(demand_percentage),2))
    await db.commit()
    await db.refresh(db_product)
    
    return db_product
    

# Admin can delete any product, supplier can only delete their own products
@router.delete("/{product_id}", response_model=ProductResponse, dependencies=[Depends(has_role(["admin", "supplier"]))])
async def delete_product(product_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Delete a product by its ID.

    Args:
        product_id (int): The ID of the product to delete.
        db (AsyncSession, optional): The database session. Defaults to Depends(get_db).
        current_user (User, optional): The current authenticated user. Defaults to Depends(get_current_user).

    Raises:
        HTTPException: If the product is not found (404).
        HTTPException: If the current user is a supplier and does not own the product (403).

    Returns:
        Product: The deleted product.
    """
    result = await db.execute(select(Product).where(Product.id == product_id))
    db_product = result.scalars().first()

    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Ensure supplier can only delete their own product
    if current_user.role == "supplier" and current_user.id != db_product.user_id:
        raise HTTPException(status_code=403, detail="You can only delete your own products")

    await db.delete(db_product)
    await db.commit()

    return db_product


@router.post("/forecast", response_model=List[ForecastResponse], dependencies=[Depends(has_role(["admin", "supplier"]))])
async def get_products_forecast(request: ForecastRequest, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Get forecasted demand for a list of product IDs, including demand for the current product's price.

    Args:
        request: Request object containing a list of product IDs.

    Returns:
        A list of JSON responses, each containing the product ID and a list of forecasts for each price,
        including the demand for the current product's price.
    """
    forecasts = []
    demand_forecaster = DemandForecaster()
    for product_id in request.product_ids:
        # Fetch product details using await
        res = await db.execute(select(Product).where(Product.id == product_id))
        product = res.scalars().first()
        
        if product:
            # Find the nearest price in the range to the current product price
            product_obj = convert_to_product_create(product)
            demand = demand_forecaster.predict(product_obj) 
            total = product_obj.stock_available
            demand_percentage = min((demand/total)*100, 100)

            forecasts.append(ForecastResponse(product_id=product_id, demand=float(demand_percentage)))
            product.demand_forecast = round(demand_percentage, 2)
            db.add(product)
            await db.commit()
            await db.refresh(product)

    return forecasts