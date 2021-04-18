import React from 'react'
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { useState, useEffect } from "react";
import CssBaseline from '@material-ui/core/CssBaseline'
import styled from "styled-components";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import ReactDataGrid from '@inovua/reactdatagrid-enterprise'
import NumberFilter from '@inovua/reactdatagrid-community/NumberFilter'
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter'
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
import '@inovua/reactdatagrid-enterprise/index.css'

const columns = [
    {
        name: 'datetime_et',
        header: 'Datetime',
        render: ({ value }) => new Date(value).toLocaleString(),
    },
    { 
      name: 'symbol', 
      header: 'Symbol',
      filterEditor: SelectFilter
    },
    {
      name: 'recent_price',
      header: 'Current',
      render: ({ value }) => "$" + new String(Number(value).toFixed(1))
    },
    {
      name: 'close',
      header: 'Price',
      render: ({ value }) => "$" + new String(Number(value).toFixed(1))
    },
    {
      name: 'max_jump',
      header: 'Jump',
      render: ({ value }) => new String(Number(value * 100).toFixed(2)) + "%"
    },
    {
      name: 'price_at_max_jump',
      header: 'Jump Price',
      render: ({ value }) => "$" + new String(Number(value).toFixed(1))
    },
    {
      name: 'max_jump_epoch_seconds',
      header: 'Jump@',
      render: ({ value }) => new Date(value * 1000).toLocaleString(),
    },
    {
      name: 'min_drop',
      header: 'Drop',
      render: ({ value }) => new String(Number(value * 100).toFixed(2)) + "%"
    },
    {
      name: 'price_at_min_drop',
      header: 'Drop Price',
      render: ({ value }) => "$" + new String(Number(value).toFixed(1))
    },
    {
      name: 'min_drop_epoch_seconds',
      header: 'Drop@',
      render: ({ value }) => new Date(value * 1000).toLocaleString(),
    },
    {
      name: 'window_size_minutes',
      header: 'Window',
    },
    {
      name: 'threshold',
      header: 'Threshold',
      render: ({ value }) => new String(Number(value * 100).toFixed(2)) + "%"
    },
    ];

const gridStyle = { minHeight: 550 }

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
                <ReactDataGrid
                    idProperty="id"
                    columns={columns}
                    dataSource={stockItems}
                    style={gridStyle}
                />
            </TabPanel>
            <TabPanel>
                <ReactDataGrid
                    idProperty="id"
                    columns={columns}
                    dataSource={cryptoItems}
                    style={gridStyle}
                />
            </TabPanel>
          </Tabs>
        </Styles>
    );
  }
  
export default SignalDataGrid;
