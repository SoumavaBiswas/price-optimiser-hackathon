"""
This module initializes and configures a FastAPI application for a price optimization tool.

Modules:
    - fastapi: The FastAPI framework.
    - fastapi.middleware.cors: Middleware for handling Cross-Origin Resource Sharing (CORS).
    - routers: Custom modules for handling product, user, and authentication routes.
    - database.config: Configuration for the database engine and base models.

Functions:
    - init_models: Asynchronously initializes the database models.
    - lifespan: Context manager for the application lifespan, ensuring database models are initialized.

Variables:
    - app: The FastAPI application instance.
    - origins: List of allowed origins for CORS.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import product, user, auth
from database.config import engine, Base

# Initialize the database
async def init_models():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_models()
    yield

app = FastAPI(lifespan=lifespan)

origins = ["http://localhost:3000"]  

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"] 
)

# Include Routers
app.include_router(product.router)
app.include_router(user.router)
app.include_router(auth.router)

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_models()
    yield

@app.get("/")
async def root():
    return {"message": "Welcome to the Product Management API"}
