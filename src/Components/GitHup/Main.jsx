import React, { Component } from 'react';
class Main extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            Data:'',
            checked: false
         };
    }

    handleChange = (e) => {
        this.setState(()=> ({
            checked: !this.state.checked
        }))
      console.log(this.state.checked, 'check')
    }

    Search = (e) => {
        console.log(this.state.Data)
        if(this.state.Data === '') return alert ('miss type search faild can not  be empty')
    // localhost:3000/Specific/Ahmed
    // localhost:3000/Data/Ahmed
       if(this.state.checked) {
           this.props.history.push({
             pathname:`/Specific/${this.state.Data}`,
           })
       } else {
           this.props.history.push({
               pathname:`/Data/${this.state.Data}`,
           })
       }
    }

    render() {
        return (
            <React.Fragment>
                            
            <section className="mainPage">
                <center>
                <div className="main" id="main">
                <div className="container">
                <div className="row">
                    <div className="col-lg-12 col-md-12">
                    <div className="main__text-container">
                    <img src="https://github.githubassets.com/images/modules/logos_page/Octocat.png" className="GitLogo"  alt=''/>
                    <h1 className="main__title">
                    GitFetch - Profile Finder for GitHub
                    </h1>
                    <p className="main__subtitle">
                    Check out the repos, followers and more, just by entering a username!
                    </p>
                    </div>
                    <div className="container">
                    <div className="check">
                    <input className=""
                    type="checkbox" 
                    name="checked"
                    onChange={this.handleChange}
                    value={this.state.checked}
                    />
                    Go Direct to The user Profile
                    </div>
                    <input type="text" id="search" 
                    name="Data" className="btn btn-outline-primary"
                    placeholder={this.state.checked ? 'Go directely to user profile':
                     'enter  the user name ...'}
                     value={this.state.Data} 
                     onChange={ (e) => {this.setState({ [e.target.name] : e.target.value  }) } }
                    />
                    <span>
                    <button 
                    onClick={ this.Search }
                    className="btn btn-outline-primary">Search</button>
                    </span>
                    </div>
                    </div>
                </div>
                </div>
                </div>
                </center>
            </section>
            </React.Fragment>
        );
    }
}

export default Main;