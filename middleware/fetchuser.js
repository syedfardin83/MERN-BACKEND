const jwt = require('jsonwebtoken');
const JWT_SECRET = 'harryisagoodboy';

const fetchuser = (req,res,next)=>{
    const token = req.header('auth-token');
    // console.log(token);
    if(!token){
        res.status(401).send({msg:'Invalid auth token.'});
    }
    try{
        // console.log('Entered');
        const data = jwt.verify(token,JWT_SECRET);
        // console.log(data);
        req.user = data.user;
        next();
    }catch(error){
        res.status(401).send({msg:'Invalid auth token.'});
    }
    
}

module.exports = fetchuser;