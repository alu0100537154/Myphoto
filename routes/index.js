var express = require('express');
var router = express.Router();

var isAuthenticated = function(req, res, next){
	// Si el usuario ya esta autenticado en el servidor, llamamos con next() al siguiente midleware,
	// que sera el 'request handler'. Passport.js provee de este metodo para el objeto de la peticion.
	if (req.isAuthenticated())
		return next();

	//En cambio, si el usuario no esta autenticado en el servidor, lo redirijimos a '/'
	res.redirect('/');
}

module.exports = function(passport){
	
	/* GET login page. */
	router.get('/', function(req, res) {
  		res.render('index', { message: req.flash('message') });
	});

	// POST Pagina de login
	router.post('/login', passport.authenticate('login',{
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash: true
	}));

	// GET, Pagina de registro
	router.get('/signup', function(req, res){
		res.render('registro', {message: req.flash('message')});
	})
	
	// POST, Pagina de registro
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	//GET, pagina de inicio
	router.get('/home', isAuthenticated, function(req, res){
		res.render('home', {user: req.user});
	});

	// LOGOUT
	router.get('/signout', function(req, res){
		req.logout();
		res.redirect('/');
	});

	return router;
}

