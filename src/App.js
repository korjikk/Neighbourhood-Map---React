import React, { Component } from 'react';
import './App.css';
import MapContainer from './MapContainer'
import LocationList from './LocationList';

const allLocations = [
  { title: 'Stephen the Great Monument', location: { lat: 47.025495, lng: 28.830342 } },
  { title: 'Rose Valley Chișinău', location: { lat: 47.001977, lng: 28.851942 } },
  { title: 'Triumphal Arch Chișinău', location: { lat: 47.024734, lng: 28.832577 } },
  { title: 'Alley of Classics', location: { lat: 47.025967, lng: 28.828549 } },
  { title: 'Memorial to Victims of Stalinist Repression', location: { lat: 47.011873, lng: 28.858238 } }
];

class App extends Component {

  //locations - stores the current locations array
  //clickedItemName - stores the name of a location when the user clicks on it
  state = {
    locations: [],
    clickedItemName: ''
  };

  componentDidMount(prevProps) {
    this.setState({ locations: allLocations });
  }

  //uses the query string from LocationList component and filters the locations array
  filterLocationList = (query) => {
    if (query === '') {
      //if the query is empty, sets the default locations, also resets the clickedItemName
      this.setState({ locations: allLocations, clickedItemName: '' });
    }
    else {
      //filters the locations array and updates the state
      let newLocations = allLocations.filter((location) => location.title.toUpperCase().includes(query.toUpperCase()));
      this.setState({ locations: newLocations, clickedItemName: '' });
    }

  }

  //when the list item is clicked, we update the clickedItemName, which is used in the MapContainer component
  listItemClicked = (locationTitle) => {
    this.setState({ clickedItemName: locationTitle });
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Neighbourhood Map of Chișinău</h1>
        </header>

        <div className="row">
          <LocationList locations={this.state.locations} onListFiltering={this.filterLocationList} onListItemClicked={this.listItemClicked}></LocationList>
          <MapContainer locations={this.state.locations} clickedItemName={this.state.clickedItemName}></MapContainer>
        </div>

        <footer className="App-footer">
          <h1 className="App-title">Sergiu Catan © 2018</h1>
        </footer>
      </div>
    );
  }
}

export default App;
