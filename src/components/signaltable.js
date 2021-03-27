import React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { useTable } from "react-table";

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
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({
    columns,
    data
  });

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function SignalTable() {
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        columns: [
          {
            Header: "Date",
            accessor: "date"
          },
          {
            Header: "Datetime",
            accessor: "datetime_et"
          }
        ]
      },
      {
        Header: "Info",
        columns: [
          {
            Header: "Symbol",
            accessor: "symbol"
          },
          {
            Header: "Price",
            accessor: "close"
          },
          {
            Header: "Jump",
            accessor: "max_jump"
          },
          {
            Header: "Drop",
            accessor: "min_drop"
          }
        ]
      }
    ],
    []
  );

  const testResults = [
    {
      close: "36.085",
      date: "2021-03-26",
      datetime: "2021-03-26T04:26:01-0400",
      datetime_et: "2021-03-26 00:26:01.399688-04:00",
      max_jump: 0.146,
      min_drop: 0.0,
      symbol: "BTCSTUSDT",
      window_size_minutes: 10
    },
    {
      close: "36.108",
      date: "2021-03-26",
      datetime: "2021-03-26T04:26:14-0400",
      datetime_et: "2021-03-26 00:26:14.809617-04:00",
      max_jump: 0.149,
      min_drop: 0.0,
      symbol: "BTCSTBUSD",
      window_size_minutes: 10
    }
  ];

  const data = React.useMemo(() => testResults, []);

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  console.log(process.env.GATSBY_API_GATEWAY_API_KEY)
  useEffect(() => {
    fetch(
      "https://7tj23qrgl1.execute-api.us-east-2.amazonaws.com/test/moves/",
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
      if (items !== undefined) {
        setItems(data);
      }
    });
  }, []);

  return (
    <Styles>
      <Table columns={columns} data={(items === undefined) ? [] : items} />
    </Styles>
  );
}

export default SignalTable;
