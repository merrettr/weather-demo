import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import App from './App';
import UpdateCity from './UpdateCity';

export default class AppContainer extends Component {
  state = {
    cities: [],
    updateId: undefined,
  };

  componentDidMount() {
    this.fetchCities();

    // refresh the data ever 30 mins
    this.interval = setInterval(this.fetchCities, 1800000);
  }

  fetchCities = async () => {
    try {
      const cities = await fetch(`${process.env.REACT_APP_API_URL}/cities`);
      this.setState({ cities: await cities.json() });
    } catch (e) {
      console.error(e);
    }
  };

  updateCity = city => {
    fetch(`${process.env.REACT_APP_API_URL}/cities/${city._id}`, {
      method: 'PATCH',
      body: JSON.stringify(city),
      headers: { 'content-type': 'application/json' },
    });
    this.setState(prev => ({
      updateId: undefined,
      cities: prev.cities.map(c => {
        if (c._id !== city._id) {
          return c;
        }

        return city;
      }),
    }));
  };

  deleteCity = id => {
    fetch(`${process.env.REACT_APP_API_URL}/cities/${id}`, {
      method: 'DELETE',
    });
    this.setState(prev => ({
      cities: prev.cities.filter(({ _id }) => _id !== id),
    }));
  };

  render() {
    return (
      <div>
        <App
          cities={this.state.cities}
          onDelete={this.deleteCity}
          onEdit={id => this.setState({ updateId: id })}
        />

        {this.state.updateId &&
          <UpdateCity
            city={this.state.cities.find(
              ({ _id }) => _id === this.state.updateId
            )}
            onCancel={() => this.setState({ updateId: undefined })}
            onUpdate={this.updateCity}
          />}
      </div>
    );
  }
}
