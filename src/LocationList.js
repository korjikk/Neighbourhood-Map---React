import React, { Component } from 'react'

class LocationList extends Component {
    //filterQuery stores the current user input text
    state = {
        filterQuery: ''
    }

    //callback which fires when the user types in the search input.
    //it updates the component state and triggers the listFiltering callbcak.
    onSearch = (event) => {
        this.setState({ filterQuery: event.target.value })

        this.props.onListFiltering(event.target.value);
    }


    render() {
        const { locations } = this.props;
        return (
            <main id="maincontent" role="main" className='col-md-3'>
                <div className="locationListWrapper" role="navigation" aria-label="Locations filter and locations list">
                    <input
                        aria-label="Filter locations by text"
                        type="text"
                        placeholder="Filter locations"
                        value={this.state.filterQuery}
                        onChange={this.onSearch} />
                    <ul className="locationsList" role="menu" aria-label="Locations list">
                        {locations.map((location) =>
                            <li key={location.title} onClick={() => this.props.onListItemClicked(location.title)} onKeyPress={() => this.props.onListItemClicked(location.title)} tabIndex="0" role="menuitem">
                                {location.title}
                            </li>
                        )}
                    </ul>
                </div>
            </main>
        )
    }
}

export default LocationList


