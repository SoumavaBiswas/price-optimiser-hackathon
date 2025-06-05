import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { visuallyHidden } from '@mui/utils';
import EnhancedTableToolbar from './EnhancedToolbar';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditProductDialog from './EditProduct';
import WelcomeBar from './WelcomeBar'
import { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import apiService from '../utils/apiServices';



const headCells = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'category', numeric: false, disablePadding: false, label: 'Category' },
  { id: 'cost_price', numeric: true, disablePadding: false, label: 'Cost Price ($)' },
  { id: 'description', numeric: false, disablePadding: false, label: 'Description' },
  { id: 'stock_available', numeric: true, disablePadding: false, label: 'Stock Available (K)' },
  { id: 'units_sold', numeric: true, disablePadding: false, label: 'Units Sold (K)' },
  { id: 'customer_rating', numeric: true, disablePadding: false, label: 'Rating' },
  { id: 'selling_price', numeric: true, disablePadding: false, label: 'Selling Price ($)' },
  { id: 'optimized_price', numeric: true, disablePadding: false, label: 'Optimized Price ($)' },
  { id: 'demand_forecast', numeric: true, disablePadding: false, label: 'Demand (%)' },
  { id: 'action', numeric: false, disablePadding: false, label: 'Actions' },
];

const columns = [
  { id: 'name', label: 'Product Name', minWidth: 170 },
  { id: 'category', label: 'Category', minWidth: 150 },
  { id: 'cost_price', label: 'Cost Price ($)', minWidth: 100, align: 'right' },
  { id: 'description', label: 'Description', minWidth: 200 },
  { id: 'stock_available', label: 'Stock Available (K)', minWidth: 100, align: 'right' },
  { id: 'units_sold', label: 'Units Sold (K)', minWidth: 100, align: 'right' },
  { id: 'customer_rating', label: 'Rating', minWidth: 100, align: 'right' },
  { id: 'selling_price', label: 'Selling Price', minWidth: 100, align: 'right' },
  { id: 'optimized_price', label: 'Optimized Price ($)', minWidth: 100, align: 'right' },
  { id: 'demand_forecast', label: 'Demand', minWidth: 100, align: 'right' },
  { id: 'action', label: 'Action', minWidth: 100 }, // Added Action column
];


const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : b[orderBy] > a[orderBy] ? 1 : 0)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : a[orderBy] > b[orderBy] ? 1 : 0);
};

const stableSort = (array, comparator) => {
  return [...array].sort(comparator);
};


function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all items' }}
          />
        </TableCell>
        {headCells.map((headCell) => {
          // Conditionally render the "action" column based on the userRole
          if (headCell.id === "action" && props.userRole === "buyer") {
            return null; // Skip rendering this cell
          }
  
          return (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
  
}



export default function EnhancedTable() {
  const token = localStorage.getItem('access_token');
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = useState([])
  const [filteredRows, setFilteredRows] = useState([])
  const [newProductAdded, setNewProductAdded] = useState(0)
  const [selectedRows, setSelectedRows] = React.useState(selected || []);
  const [currentEditRow, setCurrentEditRow] = React.useState({});
  const [openEditDialog, setOpenEditDialog] = React.useState(false); 
  const [isFiltered, setIsFiltered] = React.useState(false)
  const {user} = useContext(AuthContext);

  
  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await apiService.get('/products');
        const fetchedRows = await response.data;
        setRows(fetchedRows);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (token) { // Only fetch data if a token is available
      fetchData();
    }
  }, [newProductAdded, token]);

  useEffect(() => {
    setFilteredRows(rows);
  }, [rows]);

 
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    if (!event.shiftKey) {
      setSelectedRows([]);
    }
  
    const selectedIndex = selectedRows.indexOf(name);
    let newSelectedRows = [...selectedRows];
  
    if (selectedIndex === -1) {
      // If the row is not selected, add it to the selection
      newSelectedRows.push(name);
    } else {
      // If the row is already selected, remove it from the selection
      newSelectedRows.splice(selectedIndex, 1); 
    }
  
    setSelectedRows(newSelectedRows);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  
  const handleProductSubmit = (
  productName, 
  productCategory, 
  costPrice, 
  sellingPrice, 
  description, 
  availableStock, 
  unitsSold,
  onClose
) => {
  const ProductData = {
    name: productName, 
    category: productCategory,
    cost_price: parseFloat(costPrice),
    selling_price: parseFloat(sellingPrice),
    description,
    stock_available: parseInt(availableStock),
    units_sold: parseInt(unitsSold),
  };

  // define and immediately call an async function
  (async () => {
    try {
      const response = await apiService.post('/products', ProductData);
      setNewProductAdded(prev => prev + 1);
      onClose();  // only called if API succeeds
    } catch (err) {
      console.error("Failed to submit product:", err);
      // optionally show an error toast/snackbar
    }
  })();
};


  const handleEditClick = (row) => {
    setCurrentEditRow(row); 
    setOpenEditDialog(true);
  };

  const handleDeleteClick = (row) => {
    console.log('Delete product:', row); 
    async function submitProduct() {
      const productId = parseInt(row["id"]); // Extract the product ID
      try {
          const response = await apiService.delete(
              `/products/${productId}`,
          );
          console.log('Product updated successfully:', response.data);
          setNewProductAdded(newProductAdded + 1);
      } catch (error) {
          console.error('Error updating product:', error.response?.data || error.message);
      }
  }

  submitProduct();
  };


  const handleSearch = (searchQuery) => {
    // Filter rows based on searchQuery
    if(searchQuery){
      setIsFiltered(true)
    }
    else{
      setIsFiltered(false)
    }
    const newRows = rows.filter((row) => {
      const searchText = searchQuery.toLowerCase(); 
      return (
        row.name.toLowerCase().includes(searchText) || 
        row.description.toLowerCase().includes(searchText) || 
        row.category.toLowerCase().includes(searchText) 
      );
    });
  
    // Update the state with the filtered rows
    setFilteredRows(newRows); 
  };
  
  const handleFilter = (filterCategory) => {
    // Filter rows based on filterCategory
    setIsFiltered(false)
    if (!filterCategory) {
      setFilteredRows(rows); 
      
    } else {
      const newRows = rows.filter((row) => row.category === filterCategory);
      setFilteredRows(newRows);
      setIsFiltered(true) 
    }
  };

  const handleEditSubmit = (updatedRow) => {
    const ProductData = {
        name: updatedRow["name"],
        category: updatedRow["category"],
        cost_price: parseFloat(updatedRow["cost_price"]),
        selling_price: parseFloat(updatedRow["selling_price"]),
        description: updatedRow["description"],
        stock_available: parseInt(updatedRow["stock_available"]),
        customer_rating: parseInt(updatedRow["customer_rating"]),
        units_sold: parseInt(updatedRow["units_sold"]),
    };

    async function submitProduct() {
        const productId = parseInt(updatedRow["productId"]); // Extract the product ID
        try {
            const response = await apiService.put(`/products/${productId}`, ProductData);
            console.log('Product updated successfully:', response.data);
            setNewProductAdded(newProductAdded + 1); // Refresh state if needed
            setSelectedRows([productId]);
        } catch (error) {
            console.error('Error updating product:', error.response?.data || error.message);
        }
    }

    submitProduct();
  };

  const handleDemandForeacstUpdate = () => {
    const fetchData = async () => {
          try {
            const response = await apiService.post('/products/forecast', { product_ids: selectedRows });
            setNewProductAdded(newProductAdded+1)
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
        fetchData();
  }

  const emptyRows = Math.max(0, (1 + page) * rowsPerPage - (isFiltered ? filteredRows.length : rows.length));
  
    const visibleRows = React.useMemo(() => {
      const data = isFiltered ? filteredRows : rows;
      return stableSort([...data], getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
    }, [order, orderBy, page, rowsPerPage, isFiltered ? filteredRows : rows]);
  
  

  return (
    <Box sx={{ width: '100%' }}>
      <WelcomeBar />
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar 
          rows={rows} 
          selectedRows={selectedRows} 
          handleFilter={handleFilter} 
          handleSearch={handleSearch} 
          handleProductSubmit={handleProductSubmit} 
          title="Create and Manage Product"
          is_demand_forecast={true}
          handleDemandForeacstUpdate={handleDemandForeacstUpdate}
        />
        <Box sx={{ overflowX: 'auto' }}>
          <TableContainer sx={{ maxHeight: 800, overflowX: 'auto' }}>
            <Table
              key={filteredRows.length}
              stickyHeader
              aria-label="sticky table"
              sx={{ minWidth: 750 }} 
            >
              <EnhancedTableHead
                numSelected={selectedRows.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
                columns={columns}
                userRole={user['role']}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = selectedRows.indexOf(row.id) !== -1;
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.name}
                      </TableCell>
                      <TableCell>{row.category}</TableCell>
                      <TableCell align="right">{row.cost_price}</TableCell>
                      
                      <TableCell>{row.description}</TableCell>
                      <TableCell align="right">{row.stock_available}</TableCell>
                      <TableCell align="right">{row.units_sold}</TableCell>
                      <TableCell align="right">{row.customer_rating}</TableCell>
                      <TableCell align="right">{row.selling_price}</TableCell>
                      <TableCell align="right">{row.optimized_price}</TableCell>
                      <TableCell align="right">{row.demand_forecast}</TableCell>
                      {user['role']!=='buyer' && <TableCell>
                        <IconButton onClick={()=>handleEditClick(row)}>
                          <EditIcon /> 
                        </IconButton>
                        <IconButton onClick={()=>handleDeleteClick(row)}>
                          <DeleteIcon /> 
                        </IconButton>
                      </TableCell> }
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <TablePagination
          rowsPerPageOptions={[10, 20, 30]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {openEditDialog && currentEditRow &&<EditProductDialog 
      open={openEditDialog} 
      onClose={() => {
        setOpenEditDialog(false)
        setSelectedRows([])
      }} 
      rowData={currentEditRow} 
      handleEditSubmit={handleEditSubmit} 
    /> }
      
    </Box>
  );
}
