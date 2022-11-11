const connectToMongo = require('./db.js');
const express = require('express');
connectToMongo();

const app = express()
const port = 1212

app.use(express.json())

app.use('/api/auth',require('./routes/auth.js'));

app.get('/',(req,res)=>{
    res.send('Hello world');
});
app.get('/about',(req,res)=>{
    res.send('This is about section');
});

app.listen(port,()=>{
    console.log('Listening at port '+port);
});