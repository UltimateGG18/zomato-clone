
const { response } = require('express');
const users = require('../models/Users');

exports.addNewUser = (req,res) => {
    const reqBody = req.body;

    const name = reqBody.name;
    const email = reqBody.email;
    const mobile = reqBody.mobile;
    const password = reqBody.password;

    const usersData = new users({name, email, mobile, password});
    usersData.save()
    .then(response => {
        res.status(200).json({message : "User Added Successfully..." , users : response});
    })
    .catch(err => {
        res.status(500).json({message : "User Not Added Successfully..." , error : err});
    })

}

exports.signinUser = (req,res) => {
    const reqBody = req.body;

    const email = reqBody.email;
    const password = reqBody.password;

    var payload = {};

    if(email && password){
        payload = {
            email : email,
            password : password
        }
    }

    users.find(payload)
    .then(response => {
        if(response.length>0){
            res.status(200).json({message : "User SignIn Successful..." ,isAuthenticated : true ,  Activeuser:response});   
        }else{
            res.status(200).json({message : "User SignIn Failed..." , isAuthenticated : false }); 
        }
    })
    .catch(err => {
        res.status(500).json({message : "User SignIn Failed...", error : err  });
    })  
}