import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const EditProductDialog = ({ open, onClose, rowData, handleEditSubmit }) => {
  const productId = rowData?.id
  const customer_rating = rowData?.customer_rating
  const [name, setName] = useState(rowData?.name || '');
  const [category, setCategory] = useState(rowData?.category || '');
  const [costPrice, setCostPrice] = useState(rowData?.cost_price || '');
  const [sellingPrice, setSellingPrice] = useState(rowData?.selling_price || '');
  const [description, setDescription] = useState(rowData?.description || '');
  const [stockAvailable, setStockAvailable] = useState(rowData?.stock_available || '');
  const [unitsSold, setUnitsSold] = useState(rowData?.units_sold || '');


  const handleProductNameChange = (event) => {
    setName(event.target.value);
  };

  const handleProductCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleCostPriceChange = (event) => {
    setCostPrice(event.target.value);
  };

  const handleSellingPriceChange = (event) => {
    setSellingPrice(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleAvailableStockChange = (event) => {
    setStockAvailable(event.target.value);
  };

  const handleUnitsSoldChange = (event) => {
    setUnitsSold(event.target.value);
  };

  const handleSubmit = () => {
    // Prepare the updated product data
    const updatedProduct = {
      name,
      category,
      productId,
      cost_price: parseFloat(costPrice),
      selling_price: parseFloat(sellingPrice),
      description,
      stock_available: parseInt(stockAvailable),
      units_sold: parseInt(unitsSold),
      customer_rating,
    };

    // Call the handleEditSubmit function to update the product in the parent component
    handleEditSubmit(updatedProduct); 

    // Close the dialog
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Product</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please update the product details:
        </DialogContentText>
        <TextField
          label="Product Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={handleProductNameChange}
        />
        <TextField
          label="Product Category"
          variant="outlined"
          fullWidth
          margin="normal"
          value={category}
          onChange={handleProductCategoryChange}
        />
        <Stack direction="row" spacing={2}>
          <TextField
            label="Cost Price"
            variant="outlined"
            type="number"
            fullWidth
            margin="normal"
            value={costPrice}
            onChange={handleCostPriceChange}
          />
          <TextField
            label="Selling Price"
            variant="outlined"
            type="number"
            fullWidth
            margin="normal"
            value={sellingPrice}
            onChange={handleSellingPriceChange}
          />
        </Stack>
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          value={description}
          onChange={handleDescriptionChange}
        />
        <Stack direction="row" spacing={2}>
          <TextField
            label="Available Stock"
            variant="outlined"
            type="number"
            fullWidth
            margin="normal"
            value={stockAvailable}
            onChange={handleAvailableStockChange}
          />
          <TextField
            label="Units Sold"
            variant="outlined"
            type="number"
            fullWidth
            margin="normal"
            value={unitsSold}
            onChange={handleUnitsSoldChange}
          />
        </Stack>
        <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;