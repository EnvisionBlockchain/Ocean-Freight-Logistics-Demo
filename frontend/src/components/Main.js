import React from 'react';
import { Link } from 'react-router-dom';
import Table from "semantic-ui-react/dist/commonjs/collections/Table/Table";

export default () => (
  <div>
    <Table unstackable>
      <Table.Row>
        <Table.Cell>
          <h3>SERVICE</h3>
        </Table.Cell>
        <Table.Cell>
          <h3>DESC</h3>
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          <Link to="/UI-project">Workbench</Link>
        </Table.Cell>
        <Table.Cell>
          This version uses the Microsoft Workbench API to connect with the Blockchain network.
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          <a target="_blank" href={"http://uploadcustomsfiles.z13.web.core.windows.net"}>BaaS (Blockchain as a Service)</a>
        </Table.Cell>
        <Table.Cell>
          This version connects directly to the Etherum network using Webj3
        </Table.Cell>
      </Table.Row>
    </Table>
  </div >
)