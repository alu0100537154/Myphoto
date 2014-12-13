var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){
	passport.use('signup', new LocalStrategy({
		passReqToCallback : true
	},
		function(req, username, password, done){
			findOrCreateUser = function(){
				// Buscamos al usuario en la base de datos
				User.findOne({'username' : username}, function(err, user){
					//En caso de error
					if (err){
						console.log('Error in SignUp: ' + err);
						return done(err);
					}

					//Si ya existe ese usuario
					if (user){
						console.log('El usuario: ' + username +' ya existe');
						return done(null, false, req.flash('message', 'El usuario ya existe'));
					} else{
						//Si por el contrario no existe, lo creamos.
						var newUser = new User();

						newUser.username = username;
						newUser.password = createHash(password);
						newUser.nombre = req.param('nombre');
						newUser.apellido = req.param('apellido');

						//Guardamos los nuevos datos en la base de datos
						newUser.save(function(err){
							// Si hay algun error durante la operacion
							if (err){
								console.log('Error mientras guardabamos los datos del nuevo usuario');
								console.log(err);
								throw err;							
							}
							console.log('Usuario creado con exito');
							return done(null, newUser);
						});
					}
				});
			};

			process.nextTick(findOrCreateUser);

		})
	);

	var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
   }
   
}