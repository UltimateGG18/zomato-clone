import React from 'react';
import '../Styles/filter.css';
import queryString from 'query-string';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class Filter extends React.Component {
  constructor() {
    super();
    this.state = {
      restaurant: [],
      locations: [],
      location: undefined,
      mealtype: undefined,
      cuisine: [],
      lcost: undefined,
      hcost: undefined,
      sort: undefined,
      page: undefined
    }
  }
  componentDidMount() {
    //capturing values from query-string
    const qs = queryString.parse(this.props.location.search);
    const location_id = qs.location;
    const mealtype_id = qs.mealtype;

    const inputObj = {
      locationId: location_id,
      mealtypeId: mealtype_id
    };

    axios({
      method: 'POST',
      url: 'http://localhost:1998/filteredrestaurants',
      headers: { 'Content-Type': 'application/json' },
      data: inputObj
    })
      .then(response => this.setState({ restaurant: response.data.restaurants, location: location_id, mealtype: mealtype_id }))
      .catch()

    axios({
      method: 'GET',
      url: 'http://localhost:1998/locations',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => this.setState({ locations: response.data.location }))
      .catch()
  }

  handleSortChange = (sort) => {
    const { location, mealtype, lcost, hcost, cuisine, page } = this.state;
    const inputObj = {
      sort: sort,
      locationId: location,
      mealtypeId: mealtype,
      lcost: lcost,
      hcost: hcost,
      cuisine: cuisine.length === 0 ? undefined : cuisine,
      page: page
    };

    axios({
      method: 'POST',
      url: 'http://localhost:1998/filteredrestaurants',
      headers: { 'Content-Type': 'application/json' },
      data: inputObj
    })
      .then(response => this.setState({ restaurant: response.data.restaurants, sort: sort }))
      .catch()
  }

  handleCostChange = (lcost, hcost) => {
    const { sort, location, mealtype, cuisine, page } = this.state;
    const inputObj = {
      lcost: lcost,
      hcost: hcost,
      sort: sort,
      locationId: location,
      mealtypeId: mealtype,
      cuisine: cuisine.length === 0 ? undefined : cuisine,
      page: page
    };

    axios({
      method: 'POST',
      url: 'http://localhost:1998/filteredrestaurants',
      headers: { 'Content-Type': 'application/json' },
      data: inputObj
    })
      .then(response => this.setState({ restaurant: response.data.restaurants, lcost: lcost, hcost: hcost }))
      .catch()
  }

  handleCuisineChange = (cuisineId) => {

    const { sort, location, mealtype, lcost, hcost, page, cuisine } = this.state;

    if (cuisine.indexOf(cuisineId) === -1) {
      cuisine.push(cuisineId);
    } else {
      const index = cuisine.indexOf(cuisineId);
      cuisine.splice(index, 1);
    }

    const inputObj = {
      cuisineId: cuisine.length === 0 ? undefined : cuisine,
      lcost: lcost,
      hcost: hcost,
      sort: sort,
      locationId: location,
      mealtypeId: mealtype,
      page: page
    };

    axios({
      method: 'POST',
      url: 'http://localhost:1998/filteredrestaurants',
      headers: { 'Content-Type': 'application/json' },
      data: inputObj
    })
      .then(response => this.setState({ restaurant: response.data.restaurants, cuisine: cuisine }))
      .catch()
  }

  handleLocationChange = (event) => {
    const locationId = event.target.value;
    const { sort, mealtype, lcost, hcost, cuisine, page } = this.state;
    const inputObj = {
      locationId: locationId,
      lcost: lcost,
      hcost: hcost,
      sort: sort,
      mealtypeId: mealtype,
      cuisine: cuisine.length === 0 ? undefined : cuisine,
      page: page
    };

    axios({
      method: 'POST',
      url: 'http://localhost:1998/filteredrestaurants',
      headers: { 'Content-Type': 'application/json' },
      data: inputObj
    })
      .then(response => this.setState({ restaurant: response.data.restaurants, location: locationId }))
      .catch()
  }

  handlePageChange = (page) => {

    const { sort, mealtype, lcost, hcost, cuisine, locationId } = this.state;
    const inputObj = {
      locationId: locationId,
      lcost: lcost,
      hcost: hcost,
      sort: sort,
      mealtypeId: mealtype,
      cuisine: cuisine.length === 0 ? undefined : cuisine,
      page: page
    };

    axios({
      method: 'POST',
      url: 'http://localhost:1998/filteredrestaurants',
      headers: { 'Content-Type': 'application/json' },
      data: inputObj
    })
      .then(response => this.setState({ restaurant: response.data.restaurants, page: page }))
      .catch()
  }

  handleClickRestaurants = (resId) => {
    this.props.history.push(`/details?restaurant=${resId}`);
  }

  render() {
    const { restaurant, locations } = this.state;
    return (
      <div>
        <div>
          <div className="heading1">Restaurants</div>
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-4 col-md-4 col-lg-4 ">
                <div className="filters-heading">
                  <span>Filters/sort</span>
                  <span className="glyphicon glyphicon-chevron-down toggle-span" data-toggle="collapse" data-target="#demo"></span></div>
                <div id="demo" className="collapse show">
                  <div className="Select-Location">Select Location</div>
                  <select className="Rectangle2236" onChange={this.handleLocationChange}>
                    <option value='0'>Select Location</option>
                    {locations.map((item) => {
                      return <option value={item.location_id}>{`${item.name},${item.city}`}</option>
                    })}
                  </select>
                  <div className="Cuisine">Cuisine</div>
                  <div>
                    <input type="checkbox" className="Rectangle2226" onChange={() => this.handleCuisineChange(1)} />
                    <span className="L2000">North Indian</span>
                  </div>
                  <div>
                    <input type="checkbox" className="Rectangle2226" onChange={() => this.handleCuisineChange(2)} />
                    <span className="L2000">South Indian</span>
                  </div>
                  <div>
                    <input type="checkbox" className="Rectangle2226" onChange={() => this.handleCuisineChange(3)} />
                    <span className="L2000">Chinese</span>
                  </div>
                  <div>
                    <input type="checkbox" className="Rectangle2226" onChange={() => this.handleCuisineChange(4)} />
                    <span className="L2000">Fast Food</span>
                  </div>
                  <div>
                    <input type="checkbox" className="Rectangle2226" onChange={() => this.handleCuisineChange(5)} />
                    <span className="L2000">Street Food</span>
                  </div>
                  <div className="Cost-For-Two">Cost For Two</div>
                  <div>
                    <input type="radio" className="Rectangle-2231" name="cost" onChange={() => this.handleCostChange(0, 500)} />
                    <span className="L2000">Less than ₹ 500 </span>
                  </div>
                  <div>
                    <input type="radio" className="Rectangle-2231" name="cost" onChange={() => this.handleCostChange(500, 1000)} />
                    <span className="L2000">₹ 500 to ₹ 1000 </span>
                  </div>
                  <div>
                    <input type="radio" className="Rectangle-2231" name="cost" onChange={() => this.handleCostChange(1000, 1500)} />
                    <span className="L2000">₹ 1000 to ₹ 1500</span>
                  </div>
                  <div>
                    <input type="radio" className="Rectangle-2231" name="cost" onChange={() => this.handleCostChange(1500, 2000)} />
                    <span className="L2000">₹ 1500 to ₹ 2000 </span>
                  </div>
                  <div>
                    <input type="radio" className="Rectangle-2231" name="cost" onChange={() => this.handleCostChange(2000, 10000)} />
                    <span className="L2000">₹ 2000 +</span>
                  </div>
                  <div className="Sort">Sort</div>
                  <div>
                    <input type="radio" className="Rectangle-2231" name="sort" onChange={() => this.handleSortChange(1)} />
                    <span className="L2000">Price low to high</span>
                  </div>
                  <div>
                    <input type="radio" className="Rectangle-2231" name="sort" onChange={() => this.handleSortChange(-1)} />
                    <span className="L2000">Price high to low</span>
                  </div>

                </div>

              </div>
              <div className="col-sm-8 col-md-8 col-lg-8 ">
                <div style={{ display: "inline-block;", verticalAlign: "top;" }}>
                  {restaurant && restaurant.length > 0 ? restaurant.map((item) => {
                    return <div className="rightblock" onClick={() => this.handleClickRestaurants(item._id)}>
                      <div >
                        <div style={{ display: "inline-block;", width: "30%" }} >
                          <img src="./images/1st.png" alt="Breakfast" width="130px" height="100px" className="shutterstock " />
                        </div>
                        <div style={{ display: "inline-block;", width: "66%;", verticalAlign: "top;" }} >
                          <div className="The-Big-Chill-Cakery">{item.name}</div>
                          <div className="FORT">{item.locality}</div>
                          <div className="Shop-1">{item.address}</div>
                        </div>
                        <hr />
                        <div>
                          <div style={{ display: "inline-block;", width: "30%;", }} className="CUISINES-COST-FOR-TWO">CUISINES:<br />
                 COST FOR TWO:</div>
                          <div style={{ display: "inline-block;", width: "55% ;" }} className="Bakery-700">{item.cuisineName.map(cuis => {
                            return `${cuis}, `
                          })}<br />
                &#8377;{item.cost}</div>
                        </div>
                      </div>
                    </div>
                  }) : <div className="no-record">NO RECORD FOUND...</div>}

                  {restaurant && restaurant.length > 0 ? <div>
                    <button className="buttons1" name='page' onClick={() => this.handlePageChange()}>
                      <label>{'<'}</label>
                    </button>
                    <button className="buttons" name='page' onClick={() => this.handlePageChange(1)}>
                      <label>1</label>
                    </button>
                    <button className="buttons" name='page' onClick={() => this.handlePageChange(2)}>
                      <label>2</label>
                    </button>
                    <button className="buttons" name='page' onClick={() => this.handlePageChange(3)}>
                      <label>3</label>
                    </button>
                    <button className="buttons" name='page' onClick={() => this.handlePageChange(4)}>
                      <label>4</label>
                    </button>
                    <button className="buttons" name='page' onClick={() => this.handlePageChange()}>
                      <label>{'>'}</label>
                    </button>
                  </div> : null}
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default withRouter(Filter);