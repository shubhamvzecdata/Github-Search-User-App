import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { AddToFavorite, DelFromFavorite, GETFavoriteState } from '../../Store/Actions';

class Favorite extends Component {
    constructor(props) {
        super(props);
        this.state = { users:[] };
        this.props.GETFavoriteState();
        this.data();
    }
    
    async data(){
    console.log('Store2', this.props);
    let data = await this.props.Favorite.Favoritedata
    let BigDAtA = [];
    for( let index =0; index < data.length; index++ ) {
        const user = data[index];
        const fetchUsers = async (user) => {
        const api_call = await fetch(`https://api.github.com/users/${user}`)
        const data = await api_call.json();
        return{ data }   
     };
    fetchUsers(user).then((res)=> {
        if(!res.data.message){
            res.data.is_user_in_Favorite = true;
            BigDAtA.push(res.data)
            this.setState({ users: BigDAtA })
        }
    })
    }
}


RemoveFromFave(user){
    this.props.DelFromFavorite(user);

    let array = this.state.users;
    let newArr = [];

    for( let index=0; index<  array.length; index++ ){
        const el = array[index];
        if(el.login === user) {
            el.is_user_in_Favorite = false;
        }
        newArr.push(el);
    }
    this.setState({ users: newArr });
 }
  


 ReAddToFave(user) {
     this.props.AddToFavorite(user);
     let array = this.state.users;
     let newArr = [];
       
     for( let index =0; index < array.length; index++ ) {
         const el = array[index];
         if(el.login === user) {
             el.is_user_in_Favorite = true;
         }
         newArr.push(el);
     }
     this.setState({ users: newArr })
 }

 GoFetchOnewUser(data) {
    this.props.history.push({
        pathname:`/Specific/${data}`,
    })
}

    render() {
        return (
            <React.Fragment>
                            

            <main role="main">

            <div className="album py-5 bg-light">
            <div className="container">

                <div className="row">
            
                { this.state.users.map( user => (
                    <div key={user.id} className="col-md-4">
                    <div ket={ user.id } className="card mb-4 shadow-sm">
                    <img 
                    className="bd-placeholder-img card-img-top" 
                    width="100%" height="225" 
                    src={ user.avatar_url } alt=''  />
                    <div className="card-body">
                    <p className="card-text text-center">
                     Name : { user.login }
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                    <div className="btn-group">
                    <button type="button" 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={ ()=> {
                        this.GoFetchOnewUser(user.login)
                    } }
                    key={ user.id }
                    >View</button>
                    </div>
                   { user.is_user_in_Favorite ? 
                    <button type="button" 
                    onClick={()=> {
                        this.RemoveFromFave(user.login)
                    }}
                    className="btn btn-sm ">
                    <i className="fas fa-heart Fave"></i>
                    </button> :
                    <button type="button"
                    onClick={()=> {
                        this.ReAddToFave(user.login);
                    }} 
                    className="btn btn-sm ">
                    <i className="fas fa-heart NotFave"></i>
                    </button>
                   }
                   </div>
                    </div>
                    </div>
                </div>
                ))}

                
                
                </div>
            </div>
            </div>

            </main>




            </React.Fragment>
        );
    }
}

Favorite.propTypes = {
    AddToFavorite: PropTypes.func.isRequired,
    DelFromFavorite: PropTypes.func.isRequired,
    GETFavoriteState:PropTypes.func.isRequired,
    Favorite: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    Favorite: state.Favorite
})

export default connect (mapStateToProps, {AddToFavorite,
DelFromFavorite, GETFavoriteState}) (Favorite);