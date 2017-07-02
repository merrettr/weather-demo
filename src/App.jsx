import React from 'react';
import { Grid, Table } from 'react-bootstrap';
import City from './City';

export default ({ cities }) =>
  <Grid>
    <Table responsive>
      <thead>
      <tr>
        <th>City</th>
        <th>Country</th>
        <th>Temperature</th>
        <th>Timezone</th>
        <th>Time</th>
      </tr>
      </thead>
      <tbody>
        {cities.map(city => <City key={city._id} {...city} />)}
      </tbody>
    </Table>
  </Grid>
