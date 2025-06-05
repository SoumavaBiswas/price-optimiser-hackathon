import { Toolbar, Typography, IconButton, FormControlLabel, Switch, Button, TextField, Select, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import AddProductModal from './AddProduct';
import GridOnIcon from '@mui/icons-material/GridOn';
import { AuthContext } from './AuthProvider';


function EnhancedTableToolbar(props) {
  const { rows, selectedRows, handleFilter, handleSearch, handleProductSubmit, title, is_demand_forecast, handleDemandForeacstUpdate } = props;
  const navigate = useNavigate();
  const [withDemandForecast, setWithDemandForecast] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const {user} = useContext(AuthContext)

  useEffect(() => {
    const uniqueCategories = [...new Set(rows.map((row) => row.category))];
    setUniqueCategories(uniqueCategories);
  }, [rows]);

  const handleDemandForecastChange = (event) => {
    setWithDemandForecast(event.target.checked);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterCategory(event.target.value);
  };
  return (
    <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
      <IconButton onClick={() => navigate(-1)}>
        <ArrowBackIcon sx={{color: "green"}}/>
      </IconButton>
      <Typography sx={{ flexGrow: 1, textAlign: 'left' }} variant="h6" id="tableTitle" component="div">
        {title}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {/* <FormControlLabel
          control={<Switch checked={withDemandForecast} onChange={handleDemandForecastChange} />}
          label="With Demand Forecast"
        /> */}
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{
            width: '200px',
            marginLeft: '10px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'gray', 
              },
              '&.Mui-focused fieldset': {
                borderColor: 'green', 
              },
            },
          }}
        />

        <Button variant="contained" color="success" sx={{ marginLeft: '10px' }} onClick={() => handleSearch(searchQuery)}>
          <SearchIcon /> Search
        </Button>
        <Button variant="contained" color="success" sx={{ marginLeft: '10px' }} onClick={() => handleFilter(filterCategory)}>
          <FilterListIcon /> Filter
        </Button>
        <Select
          value={filterCategory}
          onChange={handleFilterChange}
          sx={{
            width: '100px',
            marginLeft: '10px',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'gray',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'green',
            },
          }}
        >
          <MenuItem value="">All</MenuItem>
          {uniqueCategories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>

      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        {/* {is_demand_forecast && user['role']!=='buyer' && <Button variant="contained" color="success" disabled={selectedRows.length===0 } onClick={handleDemandForeacstUpdate} ><GridOnIcon />Demand Forecast</Button>} */}
        {is_demand_forecast && user['role']!=='buyer' && <Button variant="contained" color="success" onClick={() => setOpenCreateModal(true)}> 
          <AddIcon /> Add Product
        </Button>}
        {openCreateModal && <AddProductModal open={openCreateModal} onClose={() => setOpenCreateModal(false)} handleProductSubmit={handleProductSubmit} />}
      
      </Box>
    </Toolbar>
  );
}

export default EnhancedTableToolbar;