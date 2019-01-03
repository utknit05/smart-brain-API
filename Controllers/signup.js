const handleSignup = (req, res, db, bcrypt) => {
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
}

module.exports={
  handleSignup
}