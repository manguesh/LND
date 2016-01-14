var Todo = require('./models/todo');

function getTodos(res){
	Todo.find(function(err, todos) {

        console.log("##################################" + todos);
			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(todos); // return all todos in JSON format
		});
};

module.exports = function(app) {

	// api ---------------------------------------------------------------------
	// get all todos
	app.get('/api/todos', function(req, res) {

		// use mongoose to get all todos in the database
		getTodos(res);
	});

	// create todo and send back all todos after creation
	app.post('/api/todos', function(req, res) {

		// create a todo, information comes from AJAX request from Angular
		Todo.create({
			title : req.body.title,
            desc : req.body.desc,
            dates : req.body.dates,
            timing : req.body.timing,
            nominee : req.body.nominee,
			done : false
		}, function(err, todo) {
			if (err)
				res.send(err);

            var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
            var transporter = nodemailer.createTransport('smtps://manguesh.borker@gmail.com:navajes123*#@smtp.gmail.com');

// setup e-mail data with unicode symbols
            var mailOptions = {
                from: 'MB 👥 <mangesh.b1710@yahoo.in>', // sender address
                to: 'mangueshb@smartek21.com, manguesh.borker@gmail.com', // list of receivers
                subject: 'Hello ✔', // Subject line
                text: 'Hello world 🐴', // plaintext body
                html: '<b>Hello world 🐴</b>' // html body
            };

// send mail with defined transport object
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    return console.log(error);
                }
                console.log('Message sent: ' + info.response);
            });

			// get and return all the todos after you create another
			getTodos(res);
		});

	});

	// delete a todo
	app.delete('/api/todos/:todo_id', function(req, res) {
		Todo.remove({
			_id : req.params.todo_id
		}, function(err, todo) {
			if (err)
				res.send(err);

			getTodos(res);
		});
	});

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};