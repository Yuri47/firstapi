var express = require('express');
var app = express();
var cors = require('cors'); // npm install cors --save
var helmet = require('helmet'); // npm install helmet --save
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var validator = require('validator');

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded ({extended: true}));

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

app.get('/', function(req, res){
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
var fullname = req.body.fullname;
var email = req.body.email;
var password = req.body.password;

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
var fullname = req.body.fullname;
var email = req.body.email;
var password = req.body.password;
var id = req.body.id;

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
User.findByIdAndRemove(id, function(error){
if(!error) {
res.json({response: 'Usuario excluido'});
}
});
}
});
}); 
app.listen(5000, function () {
console.log('Web server listening on port 5000')
})