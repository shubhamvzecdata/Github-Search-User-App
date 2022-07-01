import React, { Component } from 'react';
import Login from './Login';
import Reigester from './Reigester';

// const port = process.env.PORT || 4000;
// const URL_backend = `http://localhost:${port}/api/users`;
const URL_backend = `https://newreact-express-app.herokuapp.com/api/users`;


class LoginReigester extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
        return (
           <React.Fragment>
          <center>
            <section className="Specific">
             <div className="main" id="main">
              <div className="container">
               <div className="row">
                <div className="col-lg-12 col-md-12">
                 
                 <Login props={this.props} URL_backend={URL_backend} />

                 <Reigester props={this.props} URL_backend={URL_backend} />
    

                </div>
                </div>
              </div>
             </div>
             </section>
            </center>
      
           </React.Fragment> 
        );
    }
}

export default LoginReigester;