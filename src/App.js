import React, { Component } from 'react';
import './App.css';
import Nav from './Components/Nav/Nav';
import Main from './Components/GitHup/Main';
import Data from './Components/GitHup/Data';
import Specific from './Components/GitHup/Specific';
import Favorite from './Components/Favorite/Favorite';
import LoginReigester from './Components/LoginReigester/MainPage';
// Private Route
import PrivateRoute from './PrivateRoute';
import {BrowserRouter as Router , Route} from 'react-router-dom';
import { Provider } from 'react-redux';
// Action
import { ReUserState } from './Store/Actions'; 
// Store
import { createStore } from 'redux';
import rootReducer from './Store/Reduecers'
import Profile from './Components/Profile/Profile';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      isAuthentication: false
     };

    // Creat Stor 
    this.store = createStore(
      rootReducer,
      window.__REDUX_DEVTOOLS_EXTENSION__ && 
      window.__REDUX_DEVTOOLS_EXTENSION__()
  
    );

  }

  // check if user is auth
  async componentDidMount(){
    if(localStorage.getItem('token')){
      this.store.dispatch(ReUserState(true));
      this.setState({ isAuthentication:true })
    } else {
      this.store.dispatch(ReUserState(false));;
      this.setState({ isAuthentication: false })
    }
   await this.store.subscribe(( )=> {
     this.setState({ isAuthentication:this.store.getState()['Users']['isAuthenticated']})
   })

  }

  Logout = () => {
     localStorage.removeItem('Token');
     this.store.dispatch(ReUserState(false));
     this.setState({ isAuthentication:false })
  }

  render() {
    return (
      <React.Fragment>
        <Provider store= {this.store}>

        <Router>
          <Nav Logout={this.Logout} store={this.store} />
          <Route exact path='/' component={Main} />
          <Route exact path='/Data/:id' component={ Data } />
          <Route exact path='/Specific/:login' component={Specific} />
          <Route exact path='/Favorite' component={ Favorite } />
          <Route exact path='/LoginReigester' component={ LoginReigester } />
          <PrivateRoute exact path='/Profile' Logout={this.Logout} Auth={this.state.isAuthentication} component={Profile} />
        </Router>

        </Provider>
      </React.Fragment>       
      ); 
  }
}

export default App;