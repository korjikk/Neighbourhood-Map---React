import React, { Component } from 'react';
import './App.css';
import MapContainer from './MapContainer'

class App extends Component {
  render() {
    return (
      <div className="App">
              <header className="App-header">
          <h1 className="App-title">Boilerplate- react app + google maps container</h1>
        </header>
      <MapContainer></MapContainer>
      </div>
    );
  }
}

export default App;
