import React, { useState } from 'react';
import { useEffect } from "react";
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import styled from "styled-components";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {LicenseManager} from "ag-grid-enterprise";

// LicenseManager.setLicenseKey("your license key");

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

const SignalAgDataGrid = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isStockLoading, setIsStockLoading] = useState(true);
  const [isCryptoLoading, setIsCryptoLoading] = useState(true);
  const [stockItems, setStockIItems] = useState([]);
  const [cryptoItems, setCryptoItems] = useState([]);

  function addIdsToRows(rows) {
    let id = 0;
    if (rows === undefined) {
        return [];
    }
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
    // not activated as refreshing data would remove the current filters.
    // fetchUpdateStock();
    // fetchUpdateCrypto();
  }
  
  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);

    fetchUpdateStock();
    fetchUpdateCrypto();

    const interval = setInterval(() => onInterval(), 1000 * 60);
    return () => {
        clearInterval(interval);
    };
  };

  const onFirstDataRendered = (params) => {
    params.api.sizeColumnsToFit();
  };

  const Loading = () => (
    <div>
      Loading...
    </div>
  )

  function percentFormatter(params) {
    return new String(Number(params.value).toFixed(1)) + '%';
  }

  function dollarFormatter(params) {
    return '$' + new String(Number(params.value).toFixed(2));
  }

  function datetimeFormatter(params) {
    return new Date(params.value).toLocaleString();
  }

  function epochFormatter(params) {
    return new Date(params.value * 1000).toLocaleString();
  }

  function minDropValueGetter(params) {
    return params.data.min_drop * 100;
  }

  function maxJumpValueGetter(params) {
    return params.data.max_jump * 100;
  }

  function thresholdValueGetter(params) {
    return params.data.threshold * 100;
  }

  const tableHeight = 700;
  const tableWidth = 1200;
  
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
            <div className="ag-theme-alpine" style={{ height: tableHeight, width: tableWidth }}>
                <AgGridReact
                    defaultColDef={{
                        flex: 1,
                        minWidth: 200,
                        resizable: true,
                        floatingFilter: true,
                    }}
                    onGridReady={onGridReady}
                    onFirstDataRendered={onFirstDataRendered}
                    rowData={stockItems}
                    >
                    <AgGridColumn field="datetime_et" headerName="Time" sortable={true} valueFormatter={datetimeFormatter} />
                    <AgGridColumn field="symbol" headerName="Symbol" filter="agSetColumnFilter" />
                    <AgGridColumn field="window_size_minutes" headerName="Window" filter="agSetColumnFilter" />
                    <AgGridColumn field="recent_price" headerName="Current" sortable={true} filter="agNumberColumnFilter" valueFormatter={dollarFormatter} />
                    <AgGridColumn field="type_str" headerName="Type" sortable={true} filter="agSetColumnFilter" />
                    <AgGridColumn field="summary" headerName="Summary" />
                </AgGridReact>
            </div>
        </TabPanel>
        <TabPanel>
            <div className="ag-theme-alpine" style={{ height: tableHeight, width: tableWidth }}>
                <AgGridReact
                    defaultColDef={{
                        flex: 1,
                        minWidth: 200,
                        resizable: true,
                        floatingFilter: true,
                    }}
                    onGridReady={onGridReady}
                    onFirstDataRendered={onFirstDataRendered}
                    rowData={cryptoItems}
                    >
                    <AgGridColumn field="datetime_et" headerName="Time" sortable={true} valueFormatter={datetimeFormatter} />
                    <AgGridColumn field="symbol" headerName="Symbol" filter="agSetColumnFilter" />
                    <AgGridColumn field="threshold" headerName="Threshold" filter="agSetColumnFilter" valueGetter={thresholdValueGetter} valueFormatter={percentFormatter} />
                    <AgGridColumn field="window_size_minutes" headerName="Window" filter="agSetColumnFilter" />
                    <AgGridColumn field="recent_price" headerName="Current" sortable={true} filter="agNumberColumnFilter" valueFormatter={dollarFormatter} />
                    <AgGridColumn field="type_str" headerName="Type" sortable={true} filter="agSetColumnFilter" />
                    <AgGridColumn field="summary" headerName="Summary" />
                </AgGridReact>
            </div>
        </TabPanel>
      </Tabs>
    </Styles>
  );
};

export default SignalAgDataGrid;