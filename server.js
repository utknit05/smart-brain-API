const express = require ('express');
const bodyParser = require ('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const signup = require('./Controllers/signup');
const signin = require('./Controllers/signin');
const getProfile = require('./Controllers/getProfile');
const image = require('./Controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'mac',
    password : '',
    database : 'smart-brain'
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/',(req, res) => {
	res.send(database.users);
})

app.post('/signin', signin.handleSignIn(db, bcrypt))

app.get('/profile/:id', (req, res) => { getProfile.handleGetProfile(req, res, db) })

app.post('/signup', (req, res) => { signup.handleSignup(req, res, db, bcrypt) })

app.put('/image', (req,res) => { image.handleImage(req, res, db) })

app.post('/imageurl', (req, res) => { image.handleAPICall(req, res) } )

app.delete('/deleteAccount',(req,res) => {
  const {email} = req.body;
  db('users').where({email}).del()
//  db('login').where('email',email).del()
  // db.transaction(trx => {
  //   trx('users').where('email','=',email).del()
  //   .returning('email')
  //   .then(Email => {
  //     return 
  //       trx('login')
  //         .where('email','=',Email).del()
  //         .then(() => {res.json('Deleted')})
  //   })
  //     .then(trx.commit)
  //     .catch(trx.rollback)
  // })
})

 
// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

app.listen(3000, () => {
	console.log('app is running');
})
