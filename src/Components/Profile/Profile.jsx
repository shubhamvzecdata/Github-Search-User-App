import React, { Component } from 'react';
import axios from 'axios';
import { confirm as confirmComplex } from "./confirm";

// const PORT = process.env.PORT || 4000;
// const URL_backend = `http://localhost:${PORT}/api/users`;

const URL_backend = `https://newreact-express-app.herokuapp.com/api/users`;

class Profile extends Component {
    mounted = false;
    constructor(props) {
        super(props);
        this.state = { 
            id:'',
            name:'',
            address:'',
            email:'',
            pic:'',
            IsEdit:false,
            file:'',
            password:'',
            errors:'',
         };
    }

    componentWillUnmount() { this.mounted = false ;}
    
    componentWillMount() {
      this.mounted = true;
      const Token = localStorage.getItem('token');
      if(Token) {
          axios.get(`${URL_backend}/GetUserData`, {
              headers:{Authorization:Token}
          }).then((res)=>{
            console.log('res', res);
            console.log('res data', res.data.result[0]);
            if(this.mounted) {
                const data = res.data.result[0];
                this.setState({
                    id:data.id,
                    name:data.name,
                    address:data.adress,
                    email:data.email,
                    pic:data.pic,
                })
              }
          })
      }
    }

    Pic = () =>  {
        if(this.state.pic === 'undefined' || this.state.pic === undefined ||
        this.state.pic ===null || this.state.pic === '') {
            return false
        } else {
            return true
        }
    }

    EditUserData =()=> {
        this.setState({
            IsEdit:true
        })
    }

 
// edit start here
  
   onChange = (e) => {this.setState({[e.target.name]: e.target.value})}
   
   __handleimageChange = (e) => {
       e.preventDefault();

       let reader = new FileReader();
       let file = e.target.files[0];

       reader.onload = () =>{
           this.setState({
               file:file,
               pic:reader.result
           });
       }
       reader.readAsDataURL(file)
   }


   SaveUserData = (e) => {
    this.setState({[e.target.name]: e.target.value});
    this.setState({
        IsEdit:false
    })

    const file = this.state.file;
    const PostData = new FormData();

    PostData.append("name", this.state.name);
    PostData.append("address", this.state.address);
    PostData.append("pic", this.state.pic);
    PostData.append("image", file);

    // http request
    axios.put(`${URL_backend}/edit/${this.state.id}`, PostData)
    .then(res=> {
        console.log(res);
    })
    .catch(err => console.log(err))

   }
// edit end here

// delete user 

handleOnclickRemove = () => {
    confirmComplex({ password:'Enter Your Password Please' }).then(({input})=>{
        this.setState({password:input});
        this.RequstToRemove();

    }, ()=> { this.setState({password:'canceled'}) });
}

RequstToRemove =()=>{
const Pass = this.state.password;
// http request
axios.delete(`${URL_backend}/delete/${this.state.id}/${Pass}`)
.then(res=> {
    console.log(res.data.message);
    this.props.Logout();
})
.catch((err) => {this.setWorngpassword(err)} )
}

setWorngpassword =(err) => {
  console.log(err); 
  this.setState({erros:'incorrect password please try again'})
}

// endof delete user

    render() {
        return (
           <>
           <center>

     <section className="Specific">
       <div className="main" id="main">
        <div className="container">
         <div className="row">
          <div className="col-lg-12 col-md-12">
              <i className='aleart aleart-danger'>
                  {this.state.errors}
              </i>
              { this.state.IsEdit ? 
              // edit user data
            <div className="SUsersData">

            <h4><i className="bl">Your Profile Data</i></h4>
            { this.Pic() ? 
              <img src={this.state.pic} alt='' /> :
              <img src="https://university.cpanel.net/assets/img/user-profile-picture-default.png" alt="" />
            }            
            <div className='clear'></div>
            <div>
               <label htmlFor="file-upload" className='custom-file-upload'> Upload </label> 
               <input id='file-upload' type='file' 
               onChange={this.__handleimageChange} />
            </div>

            <input type='text' name='name' placeholder='name'
            className='form-control m-2' 
            value={this.state.name ? this.state.name :''}
            onChange={this.onChange}
            />

           <input type='text' name='email' placeholder='email'
            className='form-control m-2' 
            value={ this.state.email }
            onChange={this.onChange}
            disabled
            />

            <input type='text' name='address' placeholder='address'
            className='form-control m-2' 
            value={this.state.address ? this.state.address :''}
            onChange={this.onChange}
            />

            <button onClick={this.SaveUserData} className="edit btn btn-primary">
            <i className="fas fa-edit"></i> Save </button>
            
            </div> 
            :
              // show user data
              <div className="SUsersData">
              <button onClick={this.EditUserData} className="edit btn btn-danger">
              <i className="fas fa-edit"></i> Edit</button>
              <h4><i className="bl">Your Profile Data</i></h4>
              { this.Pic() ? 
              <img src={this.state.pic} alt='' /> :
              <img src="https://university.cpanel.net/assets/img/user-profile-picture-default.png" alt="" />
              }
              <h4>Name  :<i className="bl"> {this.state.name ? this.state.name:''} </i>  </h4> 
            <h4>Email  :<i className="bl">{ this.state.email }</i> </h4>
              <h4>Address  :<i className="bl"> {this.state.address ? this.state.address:''}  </i> </h4>
              </div>
              // end of shwo user data
             }
     
        <div className='REMOVEU' >
            <button className='btn btn-danger m-2'
            onClick={this.handleOnclickRemove}>
                Delete Your Account
            </button>
        </div>

        </div>
       </div>
      </div>
     </div>
    </section>
  </center>

           </> 
        );
    }
}

export default Profile;