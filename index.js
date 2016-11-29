// Import Libraries/Packages
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var uuid = require('node-uuid');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


//Connect to Database of Login Details
mongoose.connect('mongodb://localhost/userDB');

// To represent a user in database
var User = mongoose.model('User', new Schema({
    id: ObjectId,
    firstName: String,
    lastName: String,
    userName: {type: String, unique: true },
    password: String,
}));




// Middleware

// body parser (parses URL-encoded body content)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

// session (parses session IDs and loads data)

app.use(session({
  genid: function(request) { return uuid.v4(); },
  resave: false, /* save only when changes */
  saveUninitialized: false /* save only when data */,
  /*cookie: { secure: true; },*/
  secret: 'gentlemen incredible eh insurance'
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


app.get('/about', function(request, response){
    
    response.render('about', {title: 'About'
    });
    
});

app.get('/dashboard', function(request, response){
    if (request.session && request.session.user) {
        User.findOne({username: request.session.user.userName }, function(error, user) {
           if (!user) {
               request.session.destroy();
               response.redirect('login');
           } 
            else {
                response.locals.user = user;
                response.render('dashboard');
            }
        });
    }else{
        response.redirect('login');   
    }
});



app.get('/logout', function(request, response){
    
    request.session.destroy();
    response.redirect('/');
});

app.post('/processLogin', function(request, response){
    //console.log('form submitted: ' + request.body);
    
    User.findOne({username: request.body.username}, function(err, user){
        if (!user) {
            response.render('login', {error: 'Invalid username or password'});
        }
        else if (request.body.password === user.password) {
                request.session.user = user; 
                response.redirect('/dashboard');
            }
        else {
            response.render('login', {error: 'Invalid username or password.'});
        }
    });
        
});
    

app.post('/processRegistration', function(request, response){
    var user = new User({
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        userName: request.body.userName,
        password: request.body.password
    });
    
    user.save(function(err){
        if (err) {
            var err = 'Oops! Something went wrong! Try Again!';
            if (err.code === 11000) {
                error = 'That username is already taken.';
            }
            response.render('/register', {error: error});
            
        }
        else {
            response.redirect('/dashboard');
        }
            response.redirect('/dashboard');
    });
});





// express setup
app.set('port', process.env.PORT || 3000);

// setup the HTTP listener
app.listen(app.get('port'), function () {
    console.log('Listening on port ' + app.get('port'));
});
