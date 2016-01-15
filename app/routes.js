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

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
};

module.exports = function(app, passport) {

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
            //var transporter = nodemailer.createTransport('smtps://smitaborse518@gmail.com:sminishlokh@smtp.gmail.com');
var smtpTransport = nodemailer.createTransport("SMTP", {
  service: "Gmail",
  auth: {
    XOAuth2: {
      user: "smitaborse518@gmail.com", // Your gmail address.
                                            // Not @developer.gserviceaccount.com
      clientId: "110591764818-mp60ovi2b6bm5haiajbrdicn7k5gmasl.apps.googleusercontent.com",
      clientSecret: "DS1TXaw_vugKs6iKQw1s0uVy",
      refreshToken: "1/ou-hU2fd9S1zMw6BbAU7t8ltxA54zfSB2vvJZDLI5Hw"
    }
  }
});
// setup e-mail data with unicode symbols
            var mailOptions = {
                from: 'MB 👥 <mangesh.b1710@yahoo.in>', // sender address
                to: 'mangueshb@smartek21.com, manguesh.borker@gmail.com,smitab@smartek21.com', // list of receivers
                subject: 'Hello ✔', // Subject line
                text: 'Hello world 🐴', // plaintext body
                html: '<b>Hello world 🐴</b>' // html body
            };


smtpTransport.sendMail(mailOptions, function(error, response) {
  if (error) {
   return console.log(error);
  } else {
    console.log('Message sent: ' + response);
  }

  smtpTransport.close();
  
});

// send mail with defined transport object


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
	/*app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});*/


    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        /*res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });*/
        res.sendfile('./public1/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
};