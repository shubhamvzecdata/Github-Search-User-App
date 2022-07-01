import React, { Component } from 'react';
import axios from 'axios';
class Reigester extends Component {
    constructor(props) {
        super(props);
        this.state = { name:'', email:'', password:'', errors:'' };
        // console.log(props)
    }
    onChange = (e) => { this.setState({ [e.target.name]: e.target.value }) }
    
    Reigester = (e) => {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value });
        const Data = { name: this.state.name,
                       password: this.state.password, 
                       email: this.state.email 
                    };
        axios.post(`${this.props.URL_backend}/Register`, { Data })
        .then(res => {
            const err = res.data.message;
            this.setState({ errors: err })
            if(!err){
                alert('successfully registerd');
                const em = this.state.email;
                const pass = this.state.password;
                this.setState({ email:em , password: pass })
            }
        })
        .catch((err) => { console.log(err) });
    }
    
    render() {
        return (
            <>
            { this.state.errors ? <i className="alert alert-danger">
                {this.state.errors}
            </i>:'' }
            <hr></hr>
            <form className="form-Reigester">
            <h4 className="h3 mb-3 font-weight-normal grey">Reigester</h4>
            <input value={this.state.name} onChange={this.onChange} name="name" type="text" id="inputname" className="form-control" placeholder="Name" />
            <input  value={this.state.email} onChange={this.onChange} name="email" type="email"  className="form-control" placeholder="Email address" />
            <input  value={this.state.password} onChange={this.onChange} name="password" type="password"  className="form-control" placeholder="Password" />
           
            <button onClick={this.Reigester} className="btn btn-md btn-success btn-block" type="submit">Reigester</button>
            </form>
            </>
        );
    }
}

export default Reigester;