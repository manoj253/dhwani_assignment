const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');

const path = require('path');
const config = require('./config/database');
mongoose.connect(config.database);
mongoose.connection.on('connected',()=>{
	console.log('connnected to database')
});

mongoose.connection.on('error',()=>{
	console.log('failed to connnected to database',error)
});

var users = require('./routes/users');


var app = express();

// cors middleware
app.use(cors());

//Body parser middle ware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//passport miiddleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users',users);

// set static files
app.use(express.static(__dirname+'/public'));

app.get('/',(req,res)=>{
	res.send('Hiiiiii')
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(5000,()=>{
	console.log('server is runnng on port 5000');
});

