const express = require('express');
const router = express.Router();
const User = require("../models/User.js");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'harryisagoodboy';

// Route 1: To create a new user POST '/api/auth/createuser' Login not required.
router.post('/createuser',[
    body('email').isEmail(),
    body('name').isLength({min:3,max:50}),
    body('password').isLength({min:5,max:50}),
],async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try{

    let user = await User.findOne({email:req.body.email});
    if(user){
        return res.status(400).json({msg:"Duplicate email entered"});
    }
    console.log(req.body);
    // const user = User(req.body);
    // user.save();
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password,salt);
    user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
    });
    const data = {
        user:{
            id:user.id
        }
    };
    const authToken = jwt.sign(data,JWT_SECRET);
    console.log(authToken);
    res.send({authToken});

    }
    catch(error){
        console.error(error);
        res.status(500).send("Some error occcured");
    }
    
});

// Route 2: To log in a user POST '/api/auth/login' Login not required.
router.post('/login',[
    body('email').isEmail(),
    body('password').exists()
],async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {email,password} = req.body;

    try{
        const user = await User.find({email:email});
        if(!user[0]){
            res.status(400).json({msg:"Invalid Credentials"});
        }
        else{
            const isCorrectPassword = await bcrypt.compare(password,user[0].password);
            if(!isCorrectPassword){
                res.status(400).json({msg:"Invalid Credentials"});
            }else{
                const data = {
                    user:{
                        id:user.id
                    }
                };
                const authToken = jwt.sign(data,JWT_SECRET);
                console.log(authToken);
                res.send({authToken});

            }
        }
    }catch(error){
        console.error(error);
        res.status(500).send("Some error occcured");
    }
});

// Route 3: Get user detail. POST '/api/auth/getuser' Login required.
router.post('/getuser', fetchuser, async (req,res)=>{
    try{
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
        // console.log(await User.findById(userId));
        // console.log(User.findById(userId));
    }catch(error){
        console.error(error);
        res.status(500).send("Some error occcured");
    }
});

module.exports = router;