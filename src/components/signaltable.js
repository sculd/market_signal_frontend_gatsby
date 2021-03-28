import React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { useTable, usePagination } from "react-table";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CssBaseline from '@material-ui/core/CssBaseline'
import MaUTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import 'react-tabs/style/react-tabs.css';

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

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

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    usePagination
  )
  
  // Render the UI for your table
  return (
    <>
      <MaUTable {...getTableProps()}>
        <TableHead>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <TableCell {...column.getHeaderProps()}>{column.render('Header')}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </MaUTable>
      {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}

function SignalTable() {
  function getColumns(headerStr) {
    return [
        {
          Header: headerStr,
          columns: [
            {
              Header: "Datetime",
              accessor: row => new Date(row.datetime_et).toLocaleString()
            },
            {
              Header: "Symbol",
              accessor: "symbol"
            },
            {
              Header: "Price",
              accessor: row => "$" + new String(Number(row.close).toFixed(1))
            },
            {
              Header: "Jump",
              accessor: row => new String(Number(row.max_jump * 100).toFixed(2)) + "%"
            },
            {
              Header: "Drop",
              accessor: row => new String(Number(row.min_drop * 100).toFixed(2)) + "%"
            }
          ]
        }
      ];
  }

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [stockItems, setStockIItems] = useState([]);
  const [cryptoItems, setCryptoItems] = useState([]);

  useEffect(() => {
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
      if (stockItems !== undefined) {
        setStockIItems(data);
      }
    });
  }, []);
  
  useEffect(() => {
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
      if (cryptoItems !== undefined) {
        setCryptoItems(data);
      }
    });
  }, []);
  
  return (
    <Styles>
      <Tabs>
        <TabList>
          <Tab>Stock</Tab>
          <Tab>Crypto</Tab>
        </TabList>
    
        <TabPanel>
          <CssBaseline />
          <Table columns={React.useMemo(() => getColumns("Stock Signals"), [])} data={(stockItems === undefined) ? [] : stockItems} />
        </TabPanel>
        <TabPanel>
          <CssBaseline />
          <Table columns={React.useMemo(() => getColumns("Crypto Signals"), [])} data={(cryptoItems === undefined) ? [] : cryptoItems} />
        </TabPanel>
      </Tabs>
    </Styles>
  );
}

export default SignalTable;
