// Import Libraries/Packages
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var uuid = require('node-uuid');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var User = mongoose.model('User', new Schema({
    id: ObjectId,
    username: String,
    password: String
}));


//Connect to Database of Login Details
mongoose.connect('mongodb://localhost/userDB');

// Middleware

// body parser (parses URL-encoded body content)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

// session (parses session IDs and loads data)
app.use(session({
  genid: function(request) { return uuid.v4(); },
  resave: false /* save only when changes */,
  saveUninitialized: false /* save only when data */,
  /*cookie: { secure: true; },*/
  secret: 'apollo slackware propositional expectations'
}));

// Setting up views engine for PUG Template
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

// Routes

app.get('/', function(request, response){
    var userName = request.session.username;  //Take the session's username
    response.render('index', {title: 'Home Page',
                              description: 'Some description',
                              username: userName});
});


app.get('/login', function(request, response){
        response.render('login');
});

app.get('/register', function(request, response){
   response.render('register');

});

app.post('/register', function(request, response){
    var user = new User({
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        userName: request.body.userName,
        password: request.body.password
    });
    
    user.save(function(error){
        if (error) {
            var errMessage = "Oops! Something went wrong! Try Again!";
            
        }
    });
});

app.get('/about', function(request, response){
    
    response.render('about', {title: 'About'
    });
    
});

app.post('/loggingIn', function(request, response){
    console.log('form submitted: ' + request.body);
    var username = request.body['username'];
    if (userExists(username)) {
        //Store the username in the session
        request.session.username = username;

        // redirect to homepage
        response.redirect('/');
    }
    else {
        // Show login page again /w Error Message
        response.render('login', {errorMessage: 'Login Incorrect'});
    }
});

app.get('/logout', function(request, response){
    request.session.username = '';
    response.redirect('/');
});

// express setup
app.set('port', process.env.PORT || 3000);

// setup the HTTP listener
app.listen(app.get('port'), function () {
    console.log('Listening on port ' + app.get('port'));
});
