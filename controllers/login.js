const express = require('express')
const router = express.Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')

async function Login(req, res){
    var response = {
        success: false
    }
    try {
        if(req.body.email){
            const result = await User.findOne({email: req.body.email}).select('password')
            const password = jwt.verify(result.password, '25032002')
            if(password === req.body.password){
                const token = jwt.sign(req.body.email, '25032002')
                response.success = true
                response.token = token
            } else {
                response.message = 'Sai tài khoản'
            }
        }
    } catch(err){
        console.log(err)
    }
    res.json(response)
}

async function authLogin(req, res){
    var response = {
        success: false
    }
    try {
        if(req.params.token){
            const email = jwt.verify(req.params.token, '25032002')
            const result = await User.findOne({email: email}).select('-_id name email avata.url time_join')
            if(result){
                response.success = true
                response.data = result
            }
        }
    } catch(err){
        console.log(err)
    }
    res.json(response)
}

router.post('/login', Login)
router.get('/login/:token', authLogin)

module.exports = router
