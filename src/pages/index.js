import React from "react"
import Layout from "../components/layout"
import SignalTable from "../components/signaltable"
import SignalDataGrid from "../components/signaldatagrid"
import SignalAgDataGrid from "../components/signalagdatagrid"

export default function Home() {
  return (
    <Layout>
      
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
 
      <h1>Realtime Big Mover Picker</h1>
      <p>
        Where the big moves happen, so do the big opportunities.
      </p>
      <SignalAgDataGrid />
      
    </Layout>
  );
}