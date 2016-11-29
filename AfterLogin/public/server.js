var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var datetime = require('node-datetime');

mongoose.Promise = global.Promise;
var Todo = mongoose.createConnection('localhost:27017/todoList');
var BlogCon = mongoose.createConnection('localhost:27017/blogData');

var Schema = mongoose.Schema;
var dt = datetime.create();

var todoSchema = new mongoose.Schema({
    userID: {type: String, 
              unique: true,
              index: true},
    Tasks: [String]
}, {collection: 'todoList'});

var Task = Todo.model('task', todoSchema);


var blogSchema = new mongoose.Schema({
    user: {type: String,
              unique:false,
              index: false},
    blogEntry: String,
    entryDate: String,
}, {collection: 'blogData'});

var Blog = BlogCon.model('blog',blogSchema);


app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/../views');  
app.set('view engine', 'pug');




//Replace with UserID from Session after Login
var user = '10000'


app.get(['/', '/dashboard'], function(request, response) {
	loadDashboard(request,response);
});

app.post('/deleteTask', function(request, response) {
    var index = request.body.task;
    Task.update(
        {userID: user}, 
        {$pull: {Tasks: index}}, 
                                    function (error) {
                                            if(error) {
                                                loadDashboard('/', response, 'Unable to remove task');
                                            } else {
                                                loadDashboard('/', response, 'Task Removed');
                                            }
     
        
    });
});

app.post('/addTask', function(request,response) {
    var newTask = request.body.addToList
    Task.update(
        {userID: user},
        {$push: {Tasks: newTask}},
                           function (error) {
                                if (error) {
                                    loadDashboard('/', response, 'Unable to add task');
                                } else {
                                    loadDashboard('/', response, 'Task Added');
                                }
    });
});


app.post('/addBlog', function(request,response) {
    var newEntry = request.body.addToBlog;
    var timeNow = dt.format('d/n/y H:M');
    
    var EntryObj = new Blog({user: user, blogEntry: newEntry, entryDate: timeNow});
    EntryObj.save(  function (error) {
                                if (error) {
                                    loadDashboard('/', response, 'Unable to add Entry');
                                } else {
                                    loadDashboard('/', response, 'Entry Added');
                                }
    });
});

app.listen(app.get('port'), function() {
	console.log('Server listening on port ' + app.get('port'));
    
});


function loadDashboard(request, response, log) {
	console.log('loadDashboard::funcLog:', log);
	Task.find({userID: user}).then(function(taskResults) {
            Blog.find({user: user}).then(function(blogResults) {
                response.render('layout', {title: 'Daily-Dashboard',
                                   entryData: blogResults,
                                   tasks: taskResults[0].Tasks
           
        });
    });
});
    
}
