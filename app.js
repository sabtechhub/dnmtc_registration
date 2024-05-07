const express   = require('express');
const app       = express();
const bodyParser = require('body-parser');
const userRoute  = require('./routes/userRoute');
const path = require('path');

// Configure Express to serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));


app.set('view engine','ejs');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.listen(3000,()=>{

console.log("Listening to port 3000");

})


app.use('/',userRoute);



