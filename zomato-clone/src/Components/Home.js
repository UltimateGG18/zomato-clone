import React from 'react';
import QuickSearch from './QuickSearch';
import Wallpaper from './Wallpaper';
import axios from 'axios';

class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            locations: [],
            mealtypes: []
        }
    }

    componentDidMount() {
        sessionStorage.clear();
        //locations API call
        axios({
            method: 'GET',
            url: 'http://localhost:1998/locations',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => this.setState({ locations: response.data.location }))
            .catch()
        //mealtypes API call
        axios({
            method: 'GET',
            url: 'http://localhost:1998/mealtypes',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => this.setState({ mealtypes: response.data.mealtype }))
            .catch()
    }

    render() {
        const { locations, mealtypes } = this.state;
        return (
            <div>
                <Wallpaper ddlocations={locations} />
                <QuickSearch quicksearch={mealtypes} />
            </div>
        )
    }
}
export default Home;