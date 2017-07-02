import React from 'react';
import { Alert } from 'react-bootstrap';

export default ({ error, onDismiss }) =>
  <Alert bsStyle="danger" onDismiss={onDismiss}>
    {error}
  </Alert>;
