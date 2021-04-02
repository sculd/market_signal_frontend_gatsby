import React from "react";
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { useState, useEffect } from "react";
import CssBaseline from '@material-ui/core/CssBaseline'
import styled from "styled-components";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { DataGrid } from '@material-ui/data-grid';
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
  
const columns = [
    {
        field: 'datetime_et',
        headerName: 'Datetime',
        type: 'dateTime',
        width: 200,
        valueFormatter: ({ value }) => new Date(value).toLocaleString(),
    },
    { field: 'symbol', headerName: 'Symbol', type: 'number', width: 130 },
    {
      field: 'close',
      headerName: 'Price',
      type: 'number',
      valueFormatter: ({ value }) => "$" + new String(Number(value).toFixed(1)),
      width: 100,
    },
    {
      field: 'max_jump',
      headerName: 'Jump',
      type: 'number',
      valueFormatter: ({ value }) => new String(Number(value * 100).toFixed(2)) + "%",
      width: 100,
    },
    {
      field: 'min_drop',
      headerName: 'Drop',
      type: 'number',
      valueFormatter: ({ value }) => new String(Number(value * 100).toFixed(2)) + "%",
      width: 100,
    },
    {
      field: 'window_size_minutes',
      headerName: 'Window',
      type: 'number',
      width: 90,
    },
    ];

const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
    ];

const theme = createMuiTheme({
    typography: {
        fontSize: 12
    },
});
   
function DataGridWithRows({ rows }) {
    return (
    <MuiThemeProvider theme={theme}>
      <div style={{ height: 700, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={10} />
      </div>
    </MuiThemeProvider>
    );
  }

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

function SignalDataGrid() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isStockLoading, setIsStockLoading] = useState(true);
  const [isCryptoLoading, setIsCryptoLoading] = useState(true);
  const [stockItems, setStockIItems] = useState([]);
  const [cryptoItems, setCryptoItems] = useState([]);

  function addIdsToRows(rows) {
    let id = 0;
    rows.forEach(row => {
        row['id'] = id;
        id += 1;
    });
    return rows;
  }

  function fetchUpdateStock() {
    setIsStockLoading(true);
    fetch(
      "https://7tj23qrgl1.execute-api.us-east-2.amazonaws.com/test/moves?market=stock",
      {
        method: "get",
        headers: new Headers({
          "x-api-key": process.env.GATSBY_API_GATEWAY_API_KEY
        })
      }
    )
    .then(
      (response) => {
      return response.json();
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    )
    .then(data => {
      setIsLoaded(true);
      setIsStockLoading(false);
      if (stockItems !== undefined) {
        setStockIItems(addIdsToRows(data));
      }
    });
  }

  function fetchUpdateCrypto() {
    setIsCryptoLoading(true);
    fetch(
      "https://7tj23qrgl1.execute-api.us-east-2.amazonaws.com/test/moves?market=crypto",
      {
        method: "get",
        headers: new Headers({
          "x-api-key": process.env.GATSBY_API_GATEWAY_API_KEY
        })
      }
    )
    .then(
      (response) => {
      return response.json();
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    )
    .then(data => {
      setIsLoaded(true);
      setIsCryptoLoading(false);
      if (cryptoItems !== undefined) {
        setCryptoItems(addIdsToRows(data));
      }
    });
  }

  function onInterval() {
    fetchUpdateStock();
    fetchUpdateCrypto();
  }
  
  useEffect(() => {
    const interval = setInterval(() => onInterval(), 1000 * 60);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    fetchUpdateStock();
  }, []);
  
  useEffect(() => {
    fetchUpdateCrypto();
  }, []);
    
  const Loading = () => (
    <div>
      Loading...
    </div>
  )

  return (
    <Styles>
      <Tabs>
        <TabList>
          <Tab>Stock</Tab>
          <Tab>Crypto</Tab>
        </TabList>
    
        <div>
          { isStockLoading || isCryptoLoading ? <Loading /> : null }
        </div>
        <TabPanel>
          <DataGridWithRows rows={stockItems} />
        </TabPanel>
        <TabPanel>
          <DataGridWithRows rows={cryptoItems} />
        </TabPanel>
      </Tabs>
    </Styles>
  );
}

export default SignalDataGrid;
