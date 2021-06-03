import React from 'react';
import '../Styles/quicksearch.css'
import { withRouter } from 'react-router-dom';

class QuickSearch extends React.Component {

    handleClick = (mealtype_id) => {
        const locationId = sessionStorage.getItem('locationId');
        if (locationId) {
            this.props.history.push(`/filter?mealtype=${mealtype_id}&location=${locationId}`);
        }
        else {
            this.props.history.push(`/filter?mealtype=${mealtype_id}`);
        }
    }

    render() {
        const { quicksearch } = this.props;
        return (
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-6 col-md-6 col-lg-6" >
                            <div className="Quick-Searches">Quick Searches</div>
                            <div className="Discover-restaurants-by-type-of-meal">Discover restaurants by type of meal</div>
                        </div>
                        <div className="col-sm-6 col-md-6 col-lg-6" ></div>
                    </div>
                </div>
                <div className="container">
                    <div className="row" >
                        {quicksearch.map((item) => {
                            return <div className="col-sm-12 col-md-6 col-lg-4" onClick={() => this.handleClick(item.meal_type)} >
                                <div style={{ width: "320px", height: "150px", margin: "7px", boxShadow: "0 3px 6px 0 rgb(0 ,0 ,0 ,0.16)" }}>
                                    <div style={{ display: "inline-block", width: "45%" }}>
                                        <img src={item.image} alt="breakfast" style={{ imageRendering: "pixelated", borderRadius: '10px' }} width="150px" height="150px" />
                                    </div>
                                    <div style={{ display: "inline-block", width: "50%", verticalAlign: "top" }}>
                                        <div className="titleItem">{item.name}</div>
                                        <div className="subtitleItem">{item.content}</div>
                                    </div>
                                </div>
                            </div>
                        })}


                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(QuickSearch);