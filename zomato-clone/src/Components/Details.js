import React from 'react';
import '../Styles/details.css';
import queryString from 'query-string';
import axios from 'axios';
import Modal from 'react-modal';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';


const customStylesforCarousel = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'brown'
    }
};
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white'
    }
};


class Details extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurant: {},
            resId: undefined,
            menuItems: [],
            gallaryModalIsOpen: false,
            menuItemModalIsOpen: false,
            subtotal: 0,
            formModalIsOpen: false,
            name: undefined,
            email: undefined,
            mobile: undefined,
            address: undefined,
        }
    }

    componentDidMount() {

        const qs = queryString.parse(this.props.location.search);
        const resId = qs.restaurant;

        axios({
            method: 'GET',
            url: `http://localhost:1998/restaurantbyid/${resId}`,
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.setState({ restaurant: response.data.restaurantdetails, resId: resId })
            })
            .catch()
    }

    handleModal = (state, value) => {
        const { resId } = this.state;

        this.setState({ [state]: value });
        if (state === 'menuItemModalIsOpen' && value === true) {
            axios({
                method: 'GET',
                url: `http://localhost:1998/menuitemsbyrestaurants/${resId}`,
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => {
                    this.setState({ menuItems: response.data.menuitems })
                })
                .catch()
        }
    }

    addItems = (index, operationValue) => {
        let total = 0;
        const items = [...this.state.menuItems];
        const item = items[index];
        if (operationValue === 'add') {
            item.qty++;
        } else {
            item.qty--;
        }
        items[index] = item;
        items.map((item) =>
            total = total + item.qty * item.price
        )
        this.setState({ menuItems: items, subtotal: total });
    }

    handleChange = (event, state) => {
        this.setState({ [state]: event.target.value });
    }

    isDate(val) {
        // Cross realm comptatible
        return Object.prototype.toString.call(val) === '[object Date]'
    }

    isObj = (val) => {
        return typeof val === 'object'
    }

    stringifyValue = (val) => {
        if (this.isObj(val) && !this.isDate(val)) {
            return JSON.stringify(val)
        } else {
            return val
        }
    }

    buildForm = ({ action, params }) => {
        const form = document.createElement('form')
        form.setAttribute('method', 'post')
        form.setAttribute('action', action)

        Object.keys(params).forEach(key => {
            const input = document.createElement('input')
            input.setAttribute('type', 'hidden')
            input.setAttribute('name', key)
            input.setAttribute('value', this.stringifyValue(params[key]))
            form.appendChild(input)
        })

        return form
    }

    post = (details) => {
        const form = this.buildForm(details);
        document.body.appendChild(form);
        form.submit()
        form.remove()
    }


    getData = (data) => {
        return fetch(`http://localhost:1998/payment`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(response => response.json()).catch(err => console.log(err))
    }

    payment = () => {
        const { subtotal, email } = this.state;

        var re = /\S+@\S+\.\S+/;
        if (re.test(email)) {
            this.getData({ amount: subtotal, email: email }).then(response => {
                var information = {
                    action: "https://securegw-stage.paytm.in/order/process",
                    params: response
                }
                this.post(information)
            })
        } else {
            ToastsStore.error("email is not valid...");
        }
    }




    render() {
        const { restaurant, gallaryModalIsOpen, menuItemModalIsOpen, menuItems, subtotal, formModalIsOpen } = this.state;

        return (
            <div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-1 col-md-1 col-lg-1"></div>
                        <div className="col-sm-10 col-md-10 col-lg-10">
                            <img src="./images/1st.png" alt='detailsimage' className="img-responsive" width="100%" />
                            <button className="img_button" onClick={() => this.handleModal('gallaryModalIsOpen', true)}>Click to see Image Gallery </button>
                        </div>
                        <div className="col-sm-1 col-md-1 col-lg-1"></div>
                    </div>
                    <div className="row">
                        <div className="col-sm-1 col-md-1 col-lg-1"></div>
                        <div className="col-sm-10 col-md-10 col-lg-10">
                            <div className="The-Big-Chill-Cakery1">{restaurant.name}</div>
                        </div>
                        <div className="col-sm-1 col-md-1 col-lg-1"></div>
                    </div>
                    <div className="row">
                        <div className="col-sm-1 col-md-1 col-lg-1"></div>
                        <div className="col-sm-10 col-md-10 col-lg-10">
                            <div>
                                <button className="Place-Online-Order" onClick={() => this.handleModal('menuItemModalIsOpen', true)}>Place Online Order</button>
                            </div>

                            <div className="tabs">
                                <div className="tab">
                                    <input type="radio" id="tab-1" name="tab-group-1" checked />
                                    <label for="tab-1">Overview</label>

                                    <div className="content">
                                        <div className="row">
                                            <div className="About-this-place">About this place</div>
                                        </div>
                                        <div className="row">
                                            <div className="upper" style={{ marginTop: "-20px;" }}>Cuisine</div>
                                            <div className="lower">{restaurant && restaurant.cuisineName ? restaurant.cuisineName.map((item) => `${item}, `) : null}</div>
                                        </div>
                                        <div className="row">
                                            <div className="upper" style={{ marginTop: "10px;" }}>Average Cost</div>
                                            <div className="lower">{restaurant.cost} for two people (approx.)</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="tab">
                                    <input type="radio" id="tab-2" name="tab-group-1" />
                                    <label for="tab-2">Contact</label>

                                    <div className="content">
                                        <div className="row">
                                            <div className="About-this-place">{restaurant.name}</div>
                                        </div>
                                        <div className="row">
                                            <div className="upper" style={{ marginTop: "-20px;" }}>Contact</div>
                                            <div className="lower">{restaurant.Contact}</div>
                                        </div>
                                        <div className="row">
                                            <div className="upper" style={{ marginTop: "10px;" }}>Address</div>
                                            <div className="lower">{restaurant.address} </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="col-sm-1 col-md-1 col-lg-1"></div>
                    </div>

                </div>

                <Modal
                    isOpen={gallaryModalIsOpen}
                    style={customStylesforCarousel}
                >
                    <div style={{ width: "800px" }}>
                        <div className='glyphicon glyphicon-remove' onClick={() => this.handleModal('gallaryModalIsOpen', false)} style={{ float: 'right', margin: '5px' }}>
                        </div>
                        <Carousel showThumbs={false} >
                            {restaurant && restaurant.thumb ? restaurant.thumb.map((item) => {
                                return (<div>
                                    <img src={item} alt="breakfast" width="400px" height="400px" />
                                </div>)
                            }) : null}
                        </Carousel>
                    </div>
                </Modal>


                <Modal
                    isOpen={menuItemModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        <div className="glyphicon glyphicon-remove" style={{ float: 'right', marginTop: '-15px', marginRight: '5px' }} onClick={() => this.handleModal('menuItemModalIsOpen', false)}></div>
                        <div >
                            <h3 className="restaurant-name">{restaurant.name}</h3>
                            <h3 className="item-total">Subtotal : &#8377;{subtotal}</h3>
                            <button className="btn btn-danger pay" onClick={() => { this.handleModal('formModalIsOpen', true); this.handleModal('menuItemModalIsOpen', false) }}> Pay Now</button>
                            {menuItems && menuItems.length > 0 ? menuItems.map((item, index) => {
                                return <div style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', borderBottom: '2px solid rgba(0, 0, 0,1.2)' }}>
                                    <div className="card" style={{ width: '43rem', margin: 'auto' }}>
                                        <div className="row" style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                            <div className="col-xs-9 col-sm-9 col-md-9 col-lg-9 " style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                                <span className="card-body">
                                                    <div className='greenbox'><div className='greencircle'></div></div>
                                                    <h5 className="item-name">{item.name}</h5>
                                                    <h5 className="item-price">&#8377;{item.price}</h5>
                                                    <p className="item-descp">{item.description}</p>
                                                </span>
                                            </div>
                                            <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3"> <img className="card-img-center title-img" src={`../${item.image}`} alt="imgformenus" style={{ height: '75px', width: '75px', 'border-radius': '20px' }} />
                                                {item.qty === 0 ? <div><button className="add-button" onClick={() => this.addItems(index, 'add')}>Add</button></div> :
                                                    <div className="add-number"><button onClick={() => this.addItems(index, 'subtract')}>-</button><span style={{ backgroundColor: 'white' }}>{item.qty}</span><button onClick={() => this.addItems(index, 'add')}>+</button></div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }) : null}
                            <div className="card" style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', margin: 'auto' }}>

                            </div>
                        </div>
                    </div>
                </Modal>

                <Modal
                    isOpen={formModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        <div className='glyphicon glyphicon-remove' onClick={() => this.handleModal('formModalIsOpen', false)} style={{ float: 'right', marginTop: '-15px', marginRight: '5px' }}></div>
                        <div className='payment-form-head'>{restaurant.name}</div>
                        <div className='payment-form-total'>Amount To Pay : &#8377;{subtotal} </div>
                        <div className='payment-form-labels'>Name </div>
                        <input className='form-control text-field' type="text" placeholder='Enter Your Name' onChange={(event) => this.handleChange(event, 'name')} />
                        <div className='payment-form-labels'>Email </div>
                        <input className='form-control text-field' type="text" placeholder='Enter Your Email' onChange={(event) => this.handleChange(event, 'email')} />
                        <div className='payment-form-labels'>Mobile Number </div>
                        <input className='form-control text-field' type="text" placeholder='Enter Mobile Number' onChange={(event) => this.handleChange(event, 'mobile')} />
                        <div className='payment-form-labels'>Address </div>
                        <textarea className='form-control' type="text" placeholder='Enter Your Address' onChange={(event) => this.handleChange(event, 'address')} />
                        <button className='payment-form-proceed' onClick={this.payment}>PROCEED</button>

                    </div>
                </Modal>


                <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />

            </div>
        )
    }
}
export default Details;