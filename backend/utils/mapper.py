from models.product import Product
from schemas.product import ProductCreate


def convert_to_product_create(product: Product) -> ProductCreate:
    """
    Converts a Product object (from the database) to a ProductCreate object.

    Args:
        product (Product): The Product object from the database.

    Returns:
        ProductCreate: The converted object.
    """
    return ProductCreate(
        name=product.name,
        description=product.description,
        cost_price=product.cost_price,
        selling_price=product.selling_price,
        category=product.category,
        stock_available=product.stock_available,
        units_sold=product.units_sold,
        customer_rating=product.customer_rating if product.customer_rating is not None else 0.0,
        demand_forecast=product.demand_forecast,
        optimized_price=product.optimized_price
    )
