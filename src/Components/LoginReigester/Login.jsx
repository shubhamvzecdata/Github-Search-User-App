import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ReUserState } from '../../Store/Actions';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { email:'', password:'', errors:'' };
    }

    onChange = (e) => { this.setState({ [e.target.name]:e.target.value }) }

    Login = (e) => {
        e.preventDefault();
    this.setState({ [e.target.name]:e.target.value });
    const Data = { password:this.state.password, email:this.state.email };
    axios.post(`${this.props.URL_backend}/Login`, { Data })
    .then((res) => {
        console.log(res)

        if(res['data']){
            // successfully op
            console.log(res['data'])
            localStorage.setItem('token', res.data.token);
            this.props.ReUserState(true);
            this.props.props.history.push('/Profile')
        }
        if(!res){
            // mean faild
            const err = res.data;
            this.setState({ errors:err })
        }
    })
    .catch(err => this.setState({ errors:'user name or password is un correct !' }) );
    }

    render() {
        return (
            <>
            { this.state.errors ? <i className='alert alert-danger'>
                {this.state.errors}
            </i>: '' }
            <hr></hr>
            <form className="form-signin">
            <h4 className="h3 mb-3 font-weight-normal grey">Please sign in</h4>
            <input value={this.state.email} onChange={this.onChange} name="email" type="email"  className="form-control" placeholder="Email address" />
            <input value={this.state.password} onChange={this.onChange} name="password" type="password"  className="form-control" placeholder="Password" />
            <button onClick={this.Login} className="btn btn-md btn-primary btn-block" type="submit">Sign in</button>
            </form>

            </>
        );
    }
}

Login.propTypes = {
    ReUserState:PropTypes.func.isRequired,
    Users:PropTypes.object.isRequired
}

const mapToProps = (state) => ({
    Users:state.Users
})

export default connect (mapToProps, {ReUserState})(Login);