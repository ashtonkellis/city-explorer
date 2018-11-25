import React, { Component } from 'react';
import superagent from 'superagent';
import Column from '../column/column.js';

import './App.scss';

const API_URL = 'https://city-explorer-backend.herokuapp.com';

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      location: '',
      mapUrl: '',
      weather: [],
      yelp: [],
      meetups: [],
      movies: [],
      trails: [],
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.getResource = this.getResource.bind(this);
  }

  async getLocation(locationStr) {
    try {
      const response = await superagent.get(`${API_URL}/location`).query({ data: locationStr });
      const location = response.body;
      const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${location.latitude}%2c%20${location.longitude}&zoom=13&size=600x300&maptype=roadmap
      &key=AIzaSyDp0Caae9rkHUHwERAFzs6WN4_MuphTimk`;

      this.setState({ location, mapUrl });
      return location;
    } catch (err) {
      return;
    }
  }

  async getResource(resource, data) {
    try {
      const response = await superagent.get(`${API_URL}/${resource}`).query({ data });
      this.setState({ [resource]: response.body });
    } catch(err) {
      this.setState({ [resource]: [] });
    }
  }

  async handleSubmit(event) {
    event.preventDefault();

    const location = await this.getLocation(event.target.location.value);
    const resources = ['weather', 'movies', 'yelp', 'meetups', 'trails'];
    Promise.all(resources.map(resource => this.getResource(resource, location)));
  }

  componentDidMount() {
    const event = { target: { location: { value: 'seattle' } } };
    event.preventDefault = () => undefined;
    this.handleSubmit(event);
  }

  render() {
    return (
      <React.Fragment>
        <header>
          <h1>City Explorer</h1>
          <p>Enter a location below to learn about the weather, events, restaurants, movies filmed there, and more!</p>
        </header>
        <main>
          <form onSubmit={ this.handleSubmit }>
            <label id="location">Search for a location</label>
            <input htmlFor="location" placeholder="Enter a location here" name="location"/>
            <button type="submit">Explore!</button>
          </form>
          { this.state.location &&  
            <div>
              <img id="map" src={ this.state.mapUrl } alt="Map of search query"></img>
              <h2>Here are the results for { this.state.location.formatted_query }</h2>
              <div className="column-container">
                <Column apiName="Dark Sky">
                  {
                    this.state.weather.map((forecast, i) => (
                      <li key={i}>
                        The forecast for {forecast.time} is: { forecast.forecast }
                      </li>))
                  }
                </Column>
                <Column apiName="Yelp">
                  {
                    this.state.yelp.map((review, i) => (
                      <li key={i}>
                        <a href={ review.url }>{ review.name }</a>
                        <p>The average rating is { review.rating } out of 5 and the average cost is { review.price } our of 4.  </p>
                        <img src={ review.image_url } alt=""/>
                      </li>))
                  }
                </Column>
                <Column apiName="Meetup">
                  {
                    this.state.meetups.map((event, i) => (
                      <li key={i}>
                        <a href={ event.link }>{ event.name }</a>
                        <p>Hosted by: { event.host }</p>
                        <p>Created on: { event.creation_date }</p>
                      </li>
                    ))
                  }
                </Column>
                <Column apiName="MovieDB">
                  {
                    this.state.movies.map((movie, i) => (
                      <li key={i}>
                        <p><span>{ movie.title }</span> was released on { movie.released_on }. Out of { movie.total_votes } votes, { movie.title } has an average vote of { movie.average_votes } and a populatory score of { movie.popularity }</p>
                        <img src={ movie.image_url } alt=""/>
                        <p>{ movie.overview }</p>
                      </li>
                    ))
                  }
                </Column>
                <Column apiName="Hiking Project">
                  {
                    this.state.trails.map((trail, i) => (
                      <li key={i}>
                        <p>Hike Name: <a src={ trail.trail_url }>{ trail.name }</a></p>
                        <p>Location: { trail.location }. Distance: { trail.length } miles.</p>
                        <p>On { trail.condition_date } at { trail.condition_time }, trail conditions were reported as: { trail.conditions }</p>
                        <p>This trail has a rating of { trail.stars } (out of {trail.star_votes} votes.</p>
                        <p>{ trail.summary }</p>
                      </li>
                    ))
                  }
                </Column>
              </div>
            </div>
          }
        </main>
      </React.Fragment>
    );
  }
}

export default App;
