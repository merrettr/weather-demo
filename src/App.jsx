import React from 'react';
import { Grid, Table } from 'react-bootstrap';
import City from './City';

export default ({ cities, onEdit, onDelete }) =>
  <Grid>
    <Table responsive>
      <thead>
        <tr>
          <th>City</th>
          <th>Country</th>
          <th>Temperature</th>
          <th>Timezone</th>
          <th>Time</th>
          <th />
          <th />
        </tr>
      </thead>
      <tbody>
        {cities.map(city =>
          <City key={city._id} {...city} onEdit={onEdit} onDelete={onDelete} />
        )}
      </tbody>
    </Table>
  </Grid>;
