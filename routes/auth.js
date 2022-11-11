const express = require('express');
const router = express.Router();
const User = require("../models/User.js");
const { body, validationResult } = require('express-validator');

// To create a new user '/api/auth' Auth not required.
router.post('/',[
    body('email').isEmail(),
    body('name').isLength({min:3,max:50}),
    body('password').isLength({min:5,max:50}),
],(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log(req.body);
    // const user = User(req.body);
    // user.save();
    User.create({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
    }).then(user => res.json(user));
});

module.exports = router;