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
import { visuallyHidden } from '@mui/utils';
import EnhancedTableToolbar from './EnhancedToolbar';
import WelcomeBar from './WelcomeBar'
import apiService from '../utils/apiServices';


const headCells = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'category', numeric: false, disablePadding: false, label: 'Category' },
  { id: 'cost_price', numeric: true, disablePadding: false, label: 'Cost Price' },
  { id: 'selling_price', numeric: true, disablePadding: false, label: 'Selling Price' },
  { id: 'description', numeric: false, disablePadding: false, label: 'Description' },
  { id: 'stock_available', numeric: true, disablePadding: false, label: 'Stock Available' },
  { id: 'units_sold', numeric: true, disablePadding: false, label: 'Units Sold' },
  { id: 'optimized_price', numeric: true, disablePadding: false, label: 'Optimized Price' }
];

const columns = [
  { id: 'name', label: 'Product Name', minWidth: 170 },
  { id: 'category', label: 'Category', minWidth: 150 },
  { id: 'cost_price', label: 'Cost Price', minWidth: 100, align: 'right' },
  { id: 'selling_price', label: 'Selling Price', minWidth: 100, align: 'right' },
  { id: 'description', label: 'Description', minWidth: 200 },
  { id: 'stock_available', label: 'Stock Available', minWidth: 100, align: 'right' },
  { id: 'units_sold', label: 'Units Sold', minWidth: 100, align: 'right' },
  { id: 'optimized_price', label: 'Optimized Price', minWidth: 100, align: 'right' }
];

const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : b[orderBy] > a[orderBy] ? 1 : 0)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : a[orderBy] > b[orderBy] ? 1 : 0);
};


function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
        </TableCell>
        {headCells.map((headCell) => (
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
        ))}
      </TableRow>
    </TableHead>
  );
}



export default function EnhancedTable() {
  const token = localStorage.getItem('access_token');
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = useState([])
  const [filteredRows, setFilteredRows] = useState([])
  const [newProductAdded, setNewProductAdded] = useState(0)
  const [isFiltered, setIsFilteredRows] = React.useState(false)
  

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await apiService.get('/products')
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

  const stableSort = (array, comparator) => {
    return [...array].sort(comparator);
  };
  

 
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };



  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

 
  const handleSearch = (searchQuery) => {
    // Filter rows based on searchQuery
    if(searchQuery) {
      setIsFilteredRows(true)
    }
    else{
      setIsFilteredRows(false)
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
    setIsFilteredRows(true)
    if (rows && !filterCategory) {
      setFilteredRows(rows); 
    } else {
      const newRows = rows.filter((row) => row.category === filterCategory);
      setFilteredRows(newRows); 
      
    }
  };
  

 

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
      <WelcomeBar/>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar 
          rows={rows} 
          handleFilter={handleFilter} 
          handleSearch={handleSearch} 
          title="Pricing Optimization"
        />
        <Box sx={{ overflowX: 'auto' }}>
          <TableContainer sx={{ maxHeight: 800, overflowX: 'auto' }}>
            <Table
              //key={filteredRows.length}
              stickyHeader
              aria-label="sticky table"
              sx={{ minWidth: 750 }} // Ensure the table has a width large enough to allow scrolling
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                //onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
                columns={columns}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.id}
                    >
                      <TableCell>
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.name}
                      </TableCell>
                      <TableCell>{row.category}</TableCell>
                      <TableCell align="right">{row.cost_price}</TableCell>
                      <TableCell align="right">{row.selling_price}</TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell align="right">{row.stock_available}</TableCell>
                      <TableCell align="right">{row.units_sold}</TableCell>
                      <TableCell>
                        <span style={{ float: 'left' }}>${row.selling_price}</span>
                        <span style={{ float: 'right' }}>${row.optimized_price}</span> 
                      </TableCell>
                                          
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
          count={isFiltered ? filteredRows.length : rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
