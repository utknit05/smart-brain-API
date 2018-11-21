const express = require ('express');
const bodyParser = require ('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

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

app.post('/signin', (req,res) => {
  db.select('email','hash').from('login')
    .where('email', '=' , req.body.email)
    .then(data => {
      if(bcrypt.compareSync(req.body.password, data[0].hash)){
       return db.select('*').from('users')
          .where('email','=',req.body.email)
          .then(user =>
            res.json(user[0]))
          .catch(err => res.status(404).json('unable to get user'))
      } else res.status(400).json('wrong credentials')
    })
    .catch(err => res.status(404).json('wrong credentials'))

})

app.get('/profile/:id', (req,res) => {
	const {id} = req.params;
  db.select('*').from('users').where({id})
    .then(user => {
     if(user.length)
      res.json(user[0]);
     else 
      res.status(400).json('Not Found');
    })
    .catch(err => res.status(400).json('Error getting user'));
})

app.post('/signup', (req,res) => {
  const {email, name, password} = req.body;
  if(email.length && password.length && name.length){ 
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
      trx.insert({
        email: email,
        hash: hash
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
            })
          .then(user => {
            res.json(user[0]);
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err => res.status(404).json('unable to register'));
  } 
  else {
    res.json('Invalid Input');
  }
})

app.put('/image', (req,res) => {
  const {id} = req.body;
  db('users').where('id','=',id)
  .increment('entries',1)
  .returning('entries')
  .then(entries => res.json(entries[0]))
  .catch(err => res.status(400).json('uanble to get entries'))
})

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



/*
response = this is working
signin --> POST = success/fail
signup --> POST = user
image --> PUT = user
/profile/:userid --> GET = user
*/