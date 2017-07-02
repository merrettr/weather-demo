import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import App from './App';

export default class AppContainer extends Component {
  state = {
    cities: [],
  };

  componentDidMount() {
    this.fetchCities();

    // refresh the data ever 30 mins
    this.interval = setInterval(this.fetchCities, 1800000);
  }

  fetchCities = async () => {
    const cities = await fetch(`${process.env.REACT_APP_API_URL}/cities`);
    this.setState({ cities: await cities.json() });
  };

  render() {
    return <App
      cities={this.state.cities.sort((a, b) => a.name.localeCompare(b.name))}
      onHeaderClick={sortBy => this.setState({ sortBy })}
    />
  }
}