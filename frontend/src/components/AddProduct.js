import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  TextField, 
  Button, 
  Stack, 
  Typography,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AddProductModal = ({ open, onClose, handleProductSubmit }) => {
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [description, setDescription] = useState('');
  const [availableStock, setAvailableStock] = useState('');
  const [unitsSold, setUnitsSold] = useState('');

  const handleProductNameChange = (event) => {
    setProductName(event.target.value);
  };

  const handleProductCategoryChange = (event) => {
    setProductCategory(event.target.value);
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
    setAvailableStock(event.target.value);
  };

  const handleUnitsSoldChange = (event) => {
    setUnitsSold(event.target.value);
  };

  

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>
        <Stack direction="row" alignItems="center">
          <Typography variant="h6">Add New Product</Typography>
          <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Lorem ipsum dolor sit amet, consectetur... 
        </DialogContentText>
        <TextField 
          label="Product Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={productName}
          onChange={handleProductNameChange} 
        />
        <TextField 
          label="Product Category"
          variant="outlined"
          fullWidth
          margin="normal"
          value={productCategory}
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
            value={availableStock}
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
          <Button variant="contained" onClick={()=>handleProductSubmit(
            productName, 
            productCategory, 
            costPrice, 
            sellingPrice, 
            description, 
            availableStock, 
            unitsSold,
            onClose
            )}>
            Add
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;