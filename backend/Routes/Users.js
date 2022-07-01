const mysql = require('mysql');
const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const router = express.Router();

// config data 
const DB_NAME = require('../config/data').DB_NAME;
const HOST = require('../config/data').HOST;
const DB_SECRET = require('../config/data').DB_SECRET;
const USER_NAME = require('../config/data').USER_NAME;

//end of


// Connect To DB
const con = mysql.createConnection({
    host:HOST,
    user:USER_NAME,
    password:DB_SECRET,
   // database:'app_react_node'
    database:DB_NAME,
    connectionLimit:50,
    queueLImit:50,
    waitForConnection:true
})

con.connect(function(err){
    if(err) throw err;
    console.log('connected!', err)
  })
  
  con.on('error', ()=> console.log('err'))
    
  var del = con._protocol._delegateError;
  con._protocol._delegateError = function(err, sequence){
    if (err.fatal) {
      console.trace('fatal error: ' + err.message);
    }
    return del.call(this, err, sequence);
  };
  

// conde for imge uploaded / some settings..


const MIME_TYPE_MAP = {
    "image/png":"png",
    "image/jpeg": "jpg",
    "image/jpg":'jpg'
};

const storage = multer.diskStorage({
    destination:(req,file, cb) =>{
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if(isValid) { error = null;}
        cb(error, "images");
    }, filename: (req, file, cb) =>{
        const name = file.originalname
        .toLowerCase()
        .split(" ")
        .join("-");
        
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name+"-"+ Date.now() + "." + ext )
    }
})


// Select or Create the Users table

function SelectOrCreateTable() {
    con.query('SELECT * FROM users', function(err, result, fields){
        if(err){
            const sql = 'CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(255), password  VARCHAR(255), pic  VARCHAR(255), email  VARCHAR(255) Not Null UNIQUE , adress  VARCHAR(255) ) ';
            con.query(sql, function(err, result){
               if(err) throw err;
            });
        }
    })
}

SelectOrCreateTable();

// end

// Create new user
router.post('/Register' , async (req, res) => {
  const email = req.body.Data.email;
  const pass = req.body.Data.password;
  const name = req.body.Data.name;

  con.query(`SELECT * FROM users WHERE email = '${email}'`, function(err, result){
    if(err){
        res.send({ err:'err' })
    }  
   if(result.length === 0){
       var sql = `INSERT INTO users (name, email, password) VALUES ('${name}', '${email}', '${pass}')`;
       con.query(sql,  function(err, result){
           if(err) { throw err; }
           res.status(200).send({ result })
           console.log(result)
       })
   } else {
       return res.status(201).send({ message:'this email is already taken before' })
   } 
  })
})
// end

const JwtPrivateSecrt = 'Ahemed#ReactNodeCourse';

// login in 
router.post('/Login', async (req, res)=> {

    const email = req.body.Data.email;
    const pass = req.body.Data.password;
    
    // const email = req.body.email;
    // const pass = req.body.password;
    console.log(email,pass)
    con.query(`SELECT * FROM users WHERE email = '${email}' AND  password = '${pass}' `,
    async function (err, result) {
        if(result.length  !== 0 ){
          jwt.sign({ UserEmail: email }, JwtPrivateSecrt ,
          (err, token) => {         
              res.status(200).send({token:token});
          });
        } 
        if(result.length  === 0){
          res.status(400).send({message:'error not found'});
        }
       });  
  
     });
  

 
// get user data

router.get('/GetUserData', async (req,res)=>{
    const Token = req.headers['authorization'];
    var decoded = jwt.decode(Token, { complete:true });
    const UserE = decoded.payload.UserEmail;
   
    const theSQL = `Select * FROM users  WHERE email = '${UserE}'`;


     con.query(theSQL, function(err, result){
        if(err) throw err;
        res.status(200).send({ result });
    })

})




// Updataa user data name pic address

const upload = multer({ 
    storage:storage, limits:{ fieldSize:12*1024*1024 }
}).single("image");


router.put('/edit/:id', upload, (req, res, next )=>{
    if(req.file && req.file !== ''){
        const Id = req.params.id;
        const URL = req.protocol+"://" + req.get("host");
        const pic = URL + "/images/" + req.file.filename;

        const name = req.body.name;
        const adress = req.body.address;
        // updata with mysql
        const sqql = `UPDATE users SET name = '${name}', adress = '${adress}', pic = '${pic}' WHERE id = '${Id}'`;
        con.query(sqql, function(err, result){
            if(err) throw err;
            res.status(200).send({ message:"sucsessfuly", result })
        })
    } else {
        const Id = req.params.id;
        const name = req.body.name;
        const adress = req.body.address;
        // updata with mysql 
        const sqql = `UPDATE users SET name = '${name}', adress = '${adress}' WHERE id = '${Id}'`;
        con.query(sqql, function(err, result){
            if(err) throw err;
            res.status(200).send({ message:'updataed', result })
        })
    }
 })

 
// delete one user 
 
router.delete('/delete/:id/:password', (req, res, next) =>{
    const Id = req.params.id;
    const Pass = req.params.password;
    
    con.query(`SELECT * FROM users WHERE id='${Id}' AND Password = '${Pass}'`,
     async function(err, result){
         if(result.length !== 0){
             // the password is correct
             con.query(`DELETE FROM users WHERE id = '${Id}'`,
             async function(err, result){
                 if(err) throw (err);
                 res.status(200).send({ message: result })
             })
         }
         if(result.length === 0) {
             res.status(400).send({ message:'error the password is not correct'});
         }
     })
})



module.exports = router;
