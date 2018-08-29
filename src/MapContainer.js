import React, { Component } from 'react';



class MapContainer extends Component {
  //the API used to retrieve data for infowindow
  serverAPI = 'https://en.wikipedia.org/w/api.php';
  //we don't need to re-redner the mapContainer when data changes, we just use Google Maps API
  //so we just declare the variables, instead of using the state
  locations = [];
  map = {};
  allMarkers = [];
  clickedItemName = '';
  infowindow = {};

  //load the Google Maps script when the component mounts
  componentDidMount() {
    window.gm_authFailure = this.gm_authFailure;
    window.initMap = this.initMap;
    loadMapScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyAUB3B2Vp2AFLsAQesz3PiNSrINPRjWU9E&callback=initMap');
  }

  componentDidUpdate(prevProps) {
    //when the state is changed
    //if there is a list item clicked, save it's name 
    //  this.getDataForInfowindow('Rose Valley Chișinău');
    this.clickedItemName = this.props.clickedItemName ? this.props.clickedItemName : '';

    //componentDidUpdate function triggers also on first loading, so we check that the google maps script is already loaded
    if (window.google) {
      //check if the locations have changed
      if (JSON.stringify(prevProps.locations) !== JSON.stringify(this.props.locations)) {
        //if locations changed, update the map by deleting the markers and setting them again
        this.locations = this.props.locations ? this.props.locations : [];
        this.deleteAllMarkers();
        this.setMarkers();
      }
      //if there was a list item clicked, find the corresponding marker, open its infowindow and set its animation
      if (this.clickedItemName.length) {
        for (let i = 0; i < this.allMarkers.length; i++) {
          if (this.allMarkers[i].title === this.clickedItemName) {
            this.populateInfoWindow(this, this.allMarkers[i], this.infowindow);
            this.allMarkers[i].setAnimation(window.google.maps.Animation.BOUNCE);
            this.allMarkers[i].setAnimation(null);
          }
          //if there is an animated marker, stop its animation
          else {
            if (this.allMarkers[i].getAnimation !== null) {
              this.allMarkers[i].setAnimation(null);
            }
          }
        }
      }
    }
    else {
      //on first loading, just update the locations variable
      this.locations = this.props.locations ? this.props.locations : [];
    }

  }

  //Callback function that shows an alert in case of Google Maps authentication error
  gm_authFailure() {
    window.alert("Google Maps error!");
    console.log("MAPS ERROR");
  }

  //initialization of the map, occurs just on the first loading
  initMap = () => {
    this.map = new window.google.maps.Map(document.getElementById('map'), {
      //47.013781, 28.853765
      center: { lat: 47.013781, lng: 28.853765 },
      zoom: 14
    });
    this.infowindow = new window.google.maps.InfoWindow();
    this.setMarkers();
  }

  //delete markers from the map by setting their map to null and clear the allMarkers array
  deleteAllMarkers = () => {
    for (let i = 0; i < this.allMarkers.length; i++) {
      this.allMarkers[i].setMap(null);
    }
    this.allMarkers = [];
  }

  //create markers, set their event listeners and update the allMarkers array
  setMarkers = () => {
    for (let i = 0; i < this.locations.length; i++) {
      let marker = new window.google.maps.Marker({
        position: this.locations[i].location,
        map: this.map,
        animation: window.google.maps.Animation.DROP,
        title: this.locations[i].title
      });

      //this IFFE injects the current scope as a function argument, in order it to be usable in the event listener
      //and sets an event listener for the marker.
      (function (parentScope) {
        marker.addListener('click', function () {
          marker.setAnimation(window.google.maps.Animation.BOUNCE);
          marker.setAnimation(null);
          parentScope.populateInfoWindow(parentScope, marker, parentScope.infowindow);
        });
      }
      )(this);

      this.allMarkers.push(marker);
    }
  }

  //Uses the Wikipedia API in order to retrive the location data
  //This function returns a promise!
  getDataForInfowindow = (locationTitle) => {
    return fetch(this.serverAPI + '?action=opensearch&search=' + locationTitle + '&limit=1&format=json&origin=*')
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          //If the call fails, show the message
          return "Wikipedia API is not available";
        }
      })
      .then((json) => {
        if (!json.error)
          //the returned object contains the description of the location
          return json[2][0];
        else
          return "There was an error processing the Wikipedia API request."
      })
      .catch((error) => {
        //in case that fetching fails
        return "There was an error processing the location info request";
      });
  }

  //this function sets the infowindow corresponding for a marker
  populateInfoWindow = (parentScope, marker, infowindow) => {
    //do not run the code if the infowindow is already open for the selected marker
    if (infowindow.marker === marker) {
      return;
    }
    //sets the content, binds the marker to the infowindow and opens it
    parentScope.getDataForInfowindow(marker.title).then((infowindowContent) => {
      infowindow.setContent('<div class="infowindowWikiText">' + infowindowContent + '</div><div class="float-right">Data fetched from Wikipedia.</div>');
      infowindow.marker = marker;
      infowindow.open(parentScope.map, marker);

      //Clears the marker for the infowindow, and stops its animation
      infowindow.addListener('closeclick', function () {
        marker.setAnimation(null);
        infowindow.marker = null;
      });
    })
  }

  render() {
    return (
      <div id="map" className="col-md-9"></div>
    );
  }
}

//helper function that loads the script when the component mounts
function loadMapScript(mapURL) {
  var scriptElement = window.document.getElementsByTagName("script")[0];
  var configuredScript = window.document.createElement("script");
  configuredScript.src = mapURL;
  configuredScript.async = true;
  configuredScript.onerror = function () { window.alert("Google Maps API failed to load data!"); }
  scriptElement.parentNode.insertBefore(configuredScript, scriptElement);
}

export default MapContainer
