var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo =  sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate:{
			//notEmpty: true
			len:[1,250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull:false,
		defaultValue: false
	}
});

sequelize.sync({

}).then(function (){
	console.log('Everything is synced');

	Todo.findById(2).then(function (todo){
		if (todo){
			console.log(todo.toJSON());
		} else{
			console.log('Todo not found');
		}
	});

//force:true auto recreate tables, insert, default false
// sequelize.sync({force: true}).then(function (){
// 	console.log('Everything is synced');

// 	Todo.create({
// 		description: "Hit the gym"
// 		//completed: false
// 	}).then(function (todo){
// 		return Todo.create({
// 			description: 'Clean office'
// 		});
// 	}).then (function () {
// 		//return Todo.findById(1) //find by id
// 		return Todo.findAll({ //find all, by where
// 			where:{
// 				description: {
// 					$like: '%gym%'
// 				//completed: false
// 				}
// 			}

// 		});
// 	}).then (function(todos) {
// 		if (todos) {
// 			todos.forEach(function (todo){
// 				console.log(todo.toJSON());
// 			});
// 		} else  console.log('no todo found');

// 		// console.log('Finished!');
// 		// console.log(todo);
// 	}).catch(function (e){
// 		console.log(e);

// 	});
});