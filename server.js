var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('Todo API Root');
});

// GET /todos?completed=true
app.get('/todos', function (req, res) {
	var queryParams = req.query;
	var filteredTodos = todos;

	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		filteredTodos = _.where(filteredTodos, {completed: true});
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredTodos = _.where(filteredTodos, {completed: false});
	}

	if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0){
		filteredTodos = _.filter(filteredTodos, function(todo){
			return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
		});
	}

	res.json(filteredTodos);
});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
});

// POST /todos
app.post('/todos', function (req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	//call create on db.todo
	//	respond with 200 and todo
	//	e res.status(400).json(e)
	db.todo.create(body).then(function (todo){
		res.json(todo.toJSON());
	}, function(e){
		res.status(400).json(e);
	});

	// if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
	// 	return res.status(400).send();
	// }

	// body.description = body.description.trim();	
	// body.id = todoNextId++;

	// todos.push(body);
	
	// res.json(body);
});

// DELETE /todos/:id
app.delete('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (!matchedTodo) {
		res.status(404).json({"error": "no todo found with that id"});
	} else {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}
});


// PUT /todos/:id
app.put('/todos/:id', function(req, res){
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes ={};

	if (!matchedTodo){
		return res.status(404).send();
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')){
		return res.status(400).send();
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')){
		return res.status(400).send();
	}

	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);
});

db.sequelize.sync().then(function (){
	app.listen(PORT, function () {
		console.log('Express listening on port ' + PORT + '!');
	});
});

// var express = require('express');
// var app = express();
// var PORT = 3000; //constant variable

// var middleware = require('./middleware.js'); //import/require middelware
// // app.get('/', function(req, res){
// // 	res.send('Hello Express!');
// // });
// // route and app level middleware



// app.use(middleware.logger);

// //app level
// //app.use(middleware.requireAuthentication); //always up before routes

// // app.get('/about', function(req, res){
// // 	res.send('About Us');
// // });

// //route level middleware
// app.get('/about', middleware.requireAuthentication, function(req, res){
// 	res.send('About Us!');
// });

// //expose folder in app
// app.use(express.static(__dirname + '/public'));

// //port
// app.listen(PORT, function (){
// 	console.log('Express server started on port::' + PORT);
// });

