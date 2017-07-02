import React, { Component } from 'react';

export default class extends Component {
  state = {
    time: ''
  };

  componentDidMount() {
    this.calculateTime();
    setInterval(this.calculateTime, 1000)
  }

  calculateTime = () => {
    const { dstOffset, rawOffset } = this.props;
    const now = new Date();
    const timestamp = now.getTime() / 1000 + now.getTimezoneOffset() * 60;

    this.setState({
      time: new Date(timestamp * 1000 + dstOffset + rawOffset).toLocaleString(),
    })
  };

  render() {
    const { _id, name, country, temperature, timezone} = this.props;

    return (
      <tr key={_id}>
        <td>{name}</td>
        <td>{country}</td>
        <td>{temperature}</td>
        <td>{timezone}</td>
        <td>{this.state.time}</td>
      </tr>
    )
  }
}