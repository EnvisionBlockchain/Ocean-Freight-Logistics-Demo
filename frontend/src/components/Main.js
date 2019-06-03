import React from 'react';
import { Link } from 'react-router-dom';
import Table from "semantic-ui-react/dist/commonjs/collections/Table/Table";

export default () => (
  <div>
    <Table>
      <Table.Row>
        <Table.Cell>
          <h3>Name/Version</h3>
        </Table.Cell>
        <Table.Cell>
          <h3>Link</h3>
        </Table.Cell>
        <Table.Cell>
          <h3>Description</h3>
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          Workbench
        </Table.Cell>
        <Table.Cell>
          <Link to="/UI-project">UI Project</Link>
        </Table.Cell>
        <Table.Cell>
          This version uses the Microsoft Workbench API to connect with the Blockchain network.
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          Etherum
        </Table.Cell>
        <Table.Cell>
          <a href={"http://uploadcustomsfiles.z13.web.core.windows.net/UI-project"}>Etherum</a>
        </Table.Cell>
        <Table.Cell>
          This version connects directly to the Etherum network using Webj3
        </Table.Cell>
      </Table.Row>
    </Table>


  </div>
)