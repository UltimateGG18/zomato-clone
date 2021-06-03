import React from 'react';
import '../Styles/wallpaper.css';
import background from '../home_bg.png';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class Wallpaper extends React.Component {

    constructor() {
        super();
        this.state = {
            restaurants: [],
            suggestions: [],
            searchText: undefined
        }
    }

    handleLocationChange = (event) => {

        const locationId = event.target.value;
        sessionStorage.setItem('locationId', locationId);

        axios({
            method: 'GET',
            url: `http://localhost:1998/restaurantsbylocation/${locationId}`,
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.setState({ restaurants: response.data.restaurants });
            })
            .catch()
    }

    handleSearches = (event) => {
        const { restaurants } = this.state;
        const searchText = event.target.value
        let filteredRestaurants;

        if (searchText === "") {
            filteredRestaurants = [];
        } else {
            filteredRestaurants = restaurants.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));
        }
        this.setState({ suggestions: filteredRestaurants, searchText: searchText });
    }

    handleNavigate = (resId) => {
        this.props.history.push(`/details?restaurant=${resId}`);
    }

    renderSuggestions = () => {
        const { suggestions, searchText } = this.state;

        if (suggestions.length === 0 && searchText) {
            return (
                <ul className='suggestionsul' >
                    {
                        <li className='suggestionsli' ><div className='suggestion-name'>No match Found</div></li>
                    }
                </ul>
            )
        }
        return (
            <ul className='suggestionsul'>
                {
                    suggestions.map((item, index) => (<li className='suggestionsli' key={index} onClick={() => this.handleNavigate(item._id)}>
                        <div className='suggestion-name'>{item.name}</div>
                        <div className='suggestion-locality'>{item.locality}</div>
                    </li>))
                }
            </ul>
        )
    }

    render() {
        const { ddlocations } = this.props;
        return (
            <div>
                <div className="outer" style={{ backgroundImage: `url(${background})` }}>
                    <div className="container-fluid">
                        <div className="row" style={{ marginTop: "4%" }}>
                            <div className="col-sm-4 col-md-4 col-lg-4"></div>
                            <div className="col-sm-4 col-md-4 col-lg-4" >
                                <div className="logo">
                                    <p>e!</p>
                                </div>
                            </div>
                            <div className="col-sm-4 col-md-4 col-lg-4"></div>
                        </div>
                        <div className="row">
                            <div className="col-sm-3 col-md-3 col-lg-3"></div>
                            <div className="col-sm-6 col-md-6 col-lg-6">
                                <div className="heading">Find the best restaurants, cafés, and bars</div>
                            </div>
                            <div className="col-sm-3 col-md-3 col-lg-3"></div>
                        </div>
                        <div className="row">
                            <div className=" col-sm-6 col-md-6 col-lg-6">
                                <select className="location" onChange={this.handleLocationChange}>
                                    <option value='0' >select</option>
                                    {ddlocations.map((item) => {
                                        return <option value={item.location_id} >{`${item.name},${item.city}`}</option>
                                    })}
                                </select>
                            </div>
                            <div className=" col-sm-6 col-md-6 col-lg-6">
                                <div>
                                    <span className="glyphicon glyphicon-search Search"></span>
                                    <input type="text" className="restaurant " onChange={this.handleSearches} placeholder="Search for restaurants" />
                                    {this.renderSuggestions()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Wallpaper);