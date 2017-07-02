import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import App from './App';
import UpdateCity from './UpdateCity';
import Error from './Error';

export default class AppContainer extends Component {
  state = {
    cities: [],
    updateId: undefined,
    error: undefined,
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
      this.setState({ error: e.message });
    }
  };

  updateCity = city => {
    try {
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
    } catch (e) {
      this.setState({ error: e.message });
    }
  };

  deleteCity = id => {
    try {
      fetch(`${process.env.REACT_APP_API_URL}/cities/${id}`, {
        method: 'DELETE',
      });
      this.setState(prev => ({
        cities: prev.cities.filter(({ _id }) => _id !== id),
      }));
    } catch (e) {
      this.setState({ error: e.message });
    }
  };

  render() {
    return (
      <div>
        {this.state.error &&
          <Error
            error={this.state.error}
            onDismiss={() => this.setState({ error: undefined })}
          />}

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
