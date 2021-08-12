const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const passport = require('passport')
const bcrypt = require('bcryptjs')

router.get('/login', (req, res) => {
  res.render('login')
})
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))
router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, ConfirmPassword } = req.body
  const errors = []
  if (!name || !email || !password || !ConfirmPassword) {
    errors.push({ message: '所有欄位都是必填的。' })
  }
  if (password !== ConfirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符。' })
  }
  if (errors.length) {
    return res.render('register', {
      errors, name, email, password, ConfirmPassword
    })
  }
  User.findOne({ email }).then(user => {
    if (user) {
      errors.push({ message: '這個 Email 已經註冊過了。' })
      return res.render('register', { errors, name, email, password, ConfirmPassword })
    }
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        name, email, password: hash
      }))
      .then(() => res.redirect('/'))
      .catch(err => next(err))
  })
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})
module.exports = router