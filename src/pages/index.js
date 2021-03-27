import React from "react"
import Layout from "../components/layout"
import SignalTable from "../components/signaltable"

export default function Home() {
  return (
    <Layout>
      <h1>Realtime Big Mover Picker</h1>
      <p>
        Where the big moves happen, so do the big opportunities.
      </p>
      <SignalTable />
    </Layout>
  );
}