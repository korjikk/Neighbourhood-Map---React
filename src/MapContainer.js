import React, { Component } from 'react';

class MapContainer extends Component {

  componentDidMount() {
    window.initMap = this.initMap;
    loadMapScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyAUB3B2Vp2AFLsAQesz3PiNSrINPRjWU9E&callback=initMap');
  }

  initMap = () => {
    var map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: 47.0105, lng: 28.8638 },
      zoom: 12
    });

  }

  render() {
    return (
      <div id="map"></div>
    );
  }
}

function loadMapScript(mapURL) {
  var scriptElement = window.document.getElementsByTagName("script")[0];
  var configuredScript = window.document.createElement("script");
  configuredScript.src = mapURL;
  configuredScript.async = true;
  scriptElement.parentNode.insertBefore(configuredScript, scriptElement);
}

export default MapContainer
