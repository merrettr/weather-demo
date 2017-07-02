import React, { Component } from 'react';
import { Modal, Button, ControlLabel, FormControl } from 'react-bootstrap';

const { Header, Title, Body, Footer } = Modal;

export default class UpdateCity extends Component {
  state = {
    name: this.props.city.name,
    country: this.props.city.country,
  };

  handleName = e => {
    this.setState({ name: e.target.value });
  };

  handleCountry = e => {
    this.setState({ country: e.target.value });
  };

  render() {
    const { city, onCancel, onUpdate } = this.props;
    const { name } = city;

    return (
      <Modal show>
        <Header>
          <Title>
            {name}
          </Title>
        </Header>

        <Body>
          <ControlLabel>City</ControlLabel>
          <FormControl
            type="text"
            value={this.state.name}
            placeholder="City"
            onChange={this.handleName}
          />

          <ControlLabel>Country</ControlLabel>
          <FormControl
            type="text"
            value={this.state.country}
            placeholder="Country"
            onChange={this.handleCountry}
          />
        </Body>

        <Footer>
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            onClick={() => onUpdate({ ...this.props.city, ...this.state })}
          >
            Update
          </Button>
        </Footer>
      </Modal>
    );
  }
}
