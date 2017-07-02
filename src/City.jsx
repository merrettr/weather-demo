import React, { Component } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';

export default class extends Component {
  state = {
    time: '',
  };

  componentDidMount() {
    this.calculateTime();
    this.interval = setInterval(this.calculateTime, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  calculateTime = () => {
    const { dstOffset, rawOffset } = this.props;

    this.setState({
      time: new Date(
        new Date().getTime() + (dstOffset + rawOffset || 0) * 1000
      ).toLocaleString(),
    });
  };

  render() {
    const {
      _id,
      name,
      country,
      temperature,
      timezone,
      onEdit,
      onDelete,
    } = this.props;

    return (
      <tr key={_id}>
        <td>
          {name}
        </td>
        <td>
          {country}
        </td>
        <td>
          {temperature}&deg;C
        </td>
        <td>
          {timezone}
        </td>
        <td>
          {this.state.time}
        </td>
        <td>
          <Button onClick={() => onEdit(_id)}>
            <Glyphicon glyph="edit" />
          </Button>
        </td>
        <td>
          <Button onClick={() => onDelete(_id)}>
            <Glyphicon style={{ color: 'red' }} glyph="remove" />
          </Button>
        </td>
      </tr>
    );
  }
}
