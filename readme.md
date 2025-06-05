# Price Optimization Tool

## Overview

The Price Optimization Tool is a web application designed to help businesses determine optimal pricing strategies based on demand forecasts and market conditions.

## Features

- Product Management: Create, view, update, and delete products with details such as name, category, cost price, selling price, description, stock available, and units sold.
- Advanced Search and Filter: Search products based on multiple criteria and filter by attributes like category.
- Demand Forecast: Get deamnd forecast and optimised price upon adding/ updating a product.

## Requirements

- Python 3.x
- FastAPI
- PostgreSQL
- JWT authentication

## Installation

1. Clone the repository: git clone https://github.com/your-repo/price-optimization-tool.git
2. Install backend dependencies: pip install -r requirements.txt
3. Install frontend dependencies: npm install (in the frontend directory)
4. Create a PostgreSQL database and update the DATABASE_URL environment variable
5. Set environment variables for JWT authentication (JWT_SECRET_KEY, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES)
6. Set environment variables for email verification (SENDER_EMAIL, SENDER_EMAIL_PASSWORD). 
7. Set environment variable with the address where frontend is running (SERVER) eg: http:127.0.0.1/3000

## Running the Application

1. Start the backend server: uvicorn main:app --reload (in the backend directory)
2. Start the frontend server: npm start (in the frontend directory)

## Usage

1. Access the application at http://localhost:3000
2. Log in with your credentials (admin, seller, or buyer)
3. Explore the features and functionalities of the application