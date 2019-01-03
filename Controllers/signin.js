const handleSignIn = (db, bcrypt) => (req, res) => {
  const {email, password} = req.body;
  if(!email || !password){
    return res.json('Invalid login');
  }
  db.select('email','hash').from('login')
    .where('email', '=' , email)
    .then(data => {
      if(bcrypt.compareSync(password, data[0].hash)){
       return db.select('*').from('users')
          .where('email','=',email)
          .then(user =>
            res.json(user[0]))
          .catch(err => res.status(404).json('unable to get user'))
      } else res.status(400).json('wrong credentials')
    })
    .catch(err => res.status(404).json('wrong credentials'))

}

module.exports = {
  handleSignIn,
}
