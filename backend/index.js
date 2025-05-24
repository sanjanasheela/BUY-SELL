const express = require ('express');
const app = express();

const cors = require('cors');

const bodyParser = require('body-parser');
const AuthRouter = require('./routes/AuthRouter')
require('dotenv').config();
require('./models/db');
const PORT = process.env.PORT || 8080;

app.get('/ping',(req,res)=>{
    res.send('PONG');
})


app.use(bodyParser.json());
app.use(cors())
app.use('/auth',AuthRouter)

app.listen(PORT,()=>{
    console.log('server is running on', PORT);

})