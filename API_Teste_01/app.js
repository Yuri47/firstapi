var express = require('express');
 
var app = express();
 

var bodyParser = require('body-parser');


var allowCors = function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '127.0.0.1');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');

	next();
}










var mongoose = require('mongoose');

var validator = require('validator');

var User;

mongoose.connect('mongodb://localhost/api01');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error...'));
db.once('open', function () {
    	var userSchema = mongoose.Schema({
		fullname: String,
		email: String,
		password: String,
		created_at: Date
	});
	User = mongoose.model('User', userSchema);
});

 

app.listen(5000);

app.use(allowCors);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded ({
	extended: true
}));
 
app.get ('/', function(req, res){
   res.end('Server ON');
});

app.get ('/users', function(req, res){
   
	User.find({}, function(error, users) {
		if(error) {
			res.json({error: 'Nao foi possivel listar'});

		}else {
			res.json(users);
		}
	});


}); 
app.get ('/users/:id', function(req, res){

	var id = validator.trim(validator.escape(req.param('id')));

   User.findById(id, function(error, user) {
		if(error) {
			res.json({error: 'Nao foi possivel listar'});

		}else {
			res.json(user);
		}
	});
}); 
app.post ('/users', function(req, res){

	var fullname = req.param('fullname');
	var email = req.param('email');
	var password = req.param('password');


    new User({
    	'fullname': fullname,
    	'email': email,
    	'password': password,
    	'created_at': new Date()
    }).save(function(error, user) {
    	if(error) {
    		res.json({error: 'Não foi possível salvar o usuário'});
    	} else {
    		res.json(user);
    	}
    });
}); 
app.put ('/users/:id', function(req, res){
   
	var fullname = req.param('fullname');
	var email = req.param('email');
	var password = req.param('password');
	var id = req.param('id');



	User.findById(id, function(error, user) {

		if(fullname) {
			user.fullname = fullname;
		}
		if(email) {
			user.email = email;
		}
		if(password) {
			user.password = password;
		}

		user.save(function(error, user) {
    	if(error) {
    		res.json({error: 'Não foi possível salvar o usuário'});
    	} else {
    		res.json(user);
    	}
    });
	});







}); 
app.delete ('/users/:id', function(req, res){
   var id = req.param('id');

   User.findById(id, function(error, user) {
		if(error) {
			res.json({error: 'Nao foi possivel listar'});

		}else {
			user.remove(function(error){
				if(!error) {
					res.json({response: 'Usuario excluido'});
				}
			});
		}
	});
}); 
