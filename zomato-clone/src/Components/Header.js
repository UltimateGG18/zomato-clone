import React from 'react';
import '../Styles/header.css';
import Modal from 'react-modal';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';



const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'skyblue',
        width: '400px',
        border: 'solid 1px'
    }
};

class Header extends React.Component {
    constructor() {
        super();
        this.state = {
            loginModalIsOpen: false,
            userName: '',
            isLoggedIn: false,
            loginFormModalIsOpen: false,
            email: '',
            password: '',
            signupModalIsOpen: false,
            name: '',
            mobile: '',
            activeUser: [],
            users: {},
            userDetailsModalIsOpen: false
        }
        this.handleLoginClick = this.handleLoginClick.bind(this);
    }

    handleNavigate = () => {
        this.props.history.push('/');
    }

    handleLogin = () => {
        this.setState({ loginModalIsOpen: true });
    }
    handleRemove = () => {
        this.setState({ loginModalIsOpen: false, loginFormModalIsOpen: false, signupModalIsOpen: false, userDetailsModalIsOpen: false });
    }
    responseGoogle = (response) => {
        this.setState({ userName: response.profileObj.name, isLoggedIn: true, loginModalIsOpen: false });
    }
    responseFacebook = (response) => {
        console.log(response);
        this.setState({ userName: response.name, isLoggedIn: true, loginModalIsOpen: false })
    }
    handleLogout = () => {
        this.setState({ userName: '', isLoggedIn: false, activeUser: [] });
    }
    handleCreateCredentials = () => {
        this.setState({
            loginFormModalIsOpen: true,
            loginModalIsOpen: false
        })
    }

    handleChange = (event, state) => {
        this.setState({ [state]: event.target.value });
    }

    /*async handleLoginClick() {
        const { email, password  } = this.state;

        let user = { email, password };
        let result = await fetch("http://localhost:1998/signin", {
                method : 'POST' ,
                headers : {
                    "Content-Type" : "Application/json",
                    "Accept" : "application/json"
                },
                body : JSON.stringify(user)
        });
        result = await result.json();
        localStorage.setItem('user-info',JSON.stringify(result))

         if(localStorage.getItem === 'user-info'){
            this.setState({isLoggedIn:true , userName : email})
         } 

    }*/


    handleLoginClick = () => {
        const { email, password } = this.state;
        var re = /\S+@\S+\.\S+/;

        if (!(re.test(email))) {
            ToastsStore.error('email is not valid.');
            return
        }
        if (password.length < 6) {
            ToastsStore.error('Incorrect Password');
            return
        }
        if (re.test(email) && password.length >= 6) {
            const inputObj = {
                email: email,
                password: password
            }
            axios({
                method: 'POST',
                url: 'http://localhost:1998/signin',
                headers: { 'Content-Type': 'application/json' },
                data: inputObj
            })
                .then(response => {
                    if (response.data.isAuthenticated === false) {
                        ToastsStore.error(response.data.message);
                    } else {
                        this.setState({ activeUser: response.data.Activeuser[0], isLoggedIn: true, userName: response.data.Activeuser[0].name, loginFormModalIsOpen: false })
                        ToastsStore.success(response.data.message);
                    }
                })
                .catch()
        }

    }

    handleSignupClick = () => {
        const { name, email, password, mobile } = this.state;
        var re = /\S+@\S+\.\S+/;
        var phoneno = /^\d{10}$/;

        if (name === null || name === '') {
            ToastsStore.warning("Name can't be blank");
            return
        }
        if (!(re.test(email))) {
            ToastsStore.error("email is not valid.");
            return
        }
        if (password.length < 6) {
            ToastsStore.warning("Password must be at least 6 characters long.");
            return
        }
        if (!(mobile.match(phoneno))) {
            ToastsStore.warning("Phone number must be numbers only and have 10 digits.");
            return
        }
        if (!(name === null || name === '') && re.test(email) && password.length >= 6 && mobile.match(phoneno)) {
            const inputObj = {
                name: name,
                email: email,
                password: password,
                mobile: mobile
            }
            axios({
                method: 'POST',
                url: 'http://localhost:1998/signup',
                headers: { 'Content-Type': 'application/json' },
                data: inputObj
            })
                .then(response => {
                    this.setState({ users: response.data.users, userDetailsModalIsOpen: true })
                })
                .catch()
        }


    }

    handleSignup = () => {
        this.setState({ signupModalIsOpen: true, loginFormModalIsOpen: false })
    }
    handleLoginLink = () => {
        this.setState({ signupModalIsOpen: false, loginFormModalIsOpen: true })
    }


    render() {
        const { loginModalIsOpen, userName, isLoggedIn, loginFormModalIsOpen, signupModalIsOpen, users, userDetailsModalIsOpen } = this.state;
        return (
            <div className="header1">
                <div className="header-logo" onClick={this.handleNavigate}>
                    <p>e!</p>
                </div>
                {isLoggedIn ? <div className="outer-login-signup">
                    <div className="login" >{userName}</div>
                    <div className="Create-An-Account" onClick={this.handleLogout}>Logout</div>
                </div> :
                    <div className="outer-login-signup">
                        <div className="login" onClick={this.handleLogin}>Login</div>
                        <div className="Create-An-Account" onClick={this.handleSignup}>Create An Account</div>
                    </div>
                }
                <Modal
                    isOpen={loginModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        <div className='glyphicon glyphicon-remove' onClick={this.handleRemove} style={{ float: 'right', margin: '5px', color: 'black' }}></div>
                        <div>
                            <GoogleLogin
                                clientId="592754983080-1k3qlvgl3q5tae0crc8opd2fj2lticpl.apps.googleusercontent.com"
                                buttonText="Continue with Google"
                                onSuccess={this.responseGoogle}
                                onFailure={this.responseGoogle}
                                cookiePolicy={'single_host_origin'}
                                className="google-login"
                            />
                            <FacebookLogin
                                appId="771202966867922"
                                fields="name,email,picture"
                                textButton=" Continue with Facebook"
                                callback={this.responseFacebook}
                                icon="fa-facebook"
                                cssClass='facebook-login'
                            />
                            <div className="continue-with-credentials" onClick={this.handleCreateCredentials}>Continue with Credentials</div>
                        </div>
                    </div>
                </Modal>
                <Modal
                    isOpen={loginFormModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        <div className='glyphicon glyphicon-remove' onClick={this.handleRemove} style={{ float: 'right', margin: '5px', color: 'black' }}></div>
                        <div className='login-form-heading'>Login</div>
                        <div className='login-form-labels'>Email</div>
                        <input className='form-control' type='text' style={{ border: 'solid 1px' }} placeholder='Enter Your Email' name='email' onChange={(event) => this.handleChange(event, 'email')} />
                        <div className='login-form-labels'>password</div>
                        <input className='form-control' type='password' style={{ border: 'solid 1px' }} placeholder='Enter Your Password' onChange={(event) => this.handleChange(event, 'password')} />
                        <button className='login-form-button' onClick={this.handleLoginClick}>Login</button>
                        <div style={{ marginTop: '10px', fontFamily: 'poppins', color: '#192f60' }}>if you don't have an Account <span onClick={this.handleSignup} style={{ color: '#0000EE', textDecoration: 'underline' }}>  Create An Account</span></div>
                    </div>
                </Modal>
                <Modal
                    isOpen={signupModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        <div className='glyphicon glyphicon-remove' onClick={this.handleRemove} style={{ float: 'right', margin: '5px', color: 'black' }}></div>
                        <div className='login-form-heading'>Signup</div>
                        <div className='login-form-labels'>Name</div>
                        <input className='form-control' type='text' style={{ border: 'solid 1px' }} placeholder='Enter Your Name' onChange={(event) => this.handleChange(event, 'name')} />
                        <div className='login-form-labels'>Email</div>
                        <input className='form-control' type='text' style={{ border: 'solid 1px' }} name='email' placeholder='Enter Your Email' onChange={(event) => this.handleChange(event, 'email')} />
                        <div className='login-form-labels'>Password</div>
                        <input className='form-control' type='password' style={{ border: 'solid 1px' }} placeholder='Enter Your Password' onChange={(event) => this.handleChange(event, 'password')} />
                        <div className='login-form-labels'>Mobile</div>
                        <input className='form-control' type='text' style={{ border: 'solid 1px' }} placeholder='Enter Your Mobile' onChange={(event) => this.handleChange(event, 'mobile')} />
                        <button className='login-form-button' onClick={this.handleSignupClick}>Signup</button>
                        <div style={{ marginTop: '10px', fontFamily: 'poppins', color: '#192f60' }}>if you have an Account <span onClick={this.handleLoginLink} style={{ color: '#0000EE', textDecoration: 'underline' }}> Login here</span></div>
                    </div>
                </Modal>
                <Modal
                    isOpen={userDetailsModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        <div className='glyphicon glyphicon-remove' onClick={this.handleRemove} style={{ float: 'right', margin: '5px', color: 'black' }}></div>
                        <div className='login-form-heading'>User Details</div>
                        <div className='login-form-labels'>Name : {users.name}</div>

                        <div className='login-form-labels'>Email : {users.email}</div>

                        <div className='login-form-labels'>Mobile : {users.mobile}</div>

                        <div className='login-form-labels'>User Added Successfully...</div>
                    </div>
                </Modal>
                <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} />
            </div>
        )
    }
}
export default withRouter(Header);