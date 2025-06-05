import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import OneHotEncoder
from schemas.product import ProductCreate


class DemandForecaster:
    def __init__(self, data_path="product_data.csv"):
        """
        Initializes the DemandForecaster with the path to the product data CSV.

        Args:
            data_path (str, optional): The path to the CSV file containing product data.
                Defaults to "product_data.csv".
        """
        self.data_path = data_path
        self.model = None
        self.load_and_train_model()

    def load_and_train_model(self):
        """
        Loads product data from CSV, prepares data for training, splits into training
        and testing sets, trains a random forest regression model using a pipeline, and evaluates
        its performance using mean squared error (MSE).

        Returns:
            None: The model is stored internally within the DemandForecaster object.
        """
        # Load product data
        try:
            product_data = pd.read_csv(self.data_path)
        except FileNotFoundError:
            raise ValueError(f"Product data CSV not found at path: {self.data_path}")

        # Features (X) and Target (y)
        X = product_data[['cost_price', 'selling_price', 'units_sold', 'customer_rating', 'category']]
        y = product_data['demand_forecast']  # Target

        numeric_features = ['cost_price', 'selling_price', 'units_sold', 'customer_rating']
        categorical_features = ['category']

        preprocessor = ColumnTransformer(
            transformers=[
                ('num', 'passthrough', numeric_features), # 'passthrough' means no transformation for numeric features
                ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
            ]
        )

        # Create the pipeline
        pipeline = Pipeline([
            ('preprocessor', preprocessor),
            ('regressor', RandomForestRegressor(random_state=42))
        ])

        # Split data into training and testing sets
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Fit the pipeline to the training data
        pipeline.fit(X_train, y_train)

        # Evaluate model performance
        y_pred = pipeline.predict(X_test)
        mse = mean_squared_error(y_test, y_pred)
        print(f"Mean Squared Error (MSE): {mse:.2f}")

        # Store the trained pipeline
        self.model = pipeline

    def predict(self, productObj: ProductCreate):
        """
        Predicts the demand forecast for a new product based on the trained model.

        Args:
            productObj (ProductCreate): A `ProductCreate` object containing the new product's features.

        Returns:
            float: The predicted demand forecast.

        Raises:
            ValueError: If the model has not been trained yet.
        """
        product = productObj.dict()
        if self.model is None:
            raise ValueError("Model not trained. Please call load_and_train_model() first.")

        # Ensure the order of features matches the training data and the preprocessor
        product_features = [[
            product['cost_price'],
            product['selling_price'],
            product['units_sold'],
            product['customer_rating'],
            product['category']
        ]]

        product_features_df = pd.DataFrame(product_features, columns=[
            'cost_price', 'selling_price', 'units_sold', 'customer_rating', 'category'
        ])
        
        # Predict demand forecast
        try:
            demand_forecast = self.model.predict(product_features_df)[0]
            return demand_forecast
        except Exception as e:
            print(f"Error during prediction: {e}")
            return None  