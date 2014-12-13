var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	passport.use('login', new LocalStrategy({
            passReqToCallback : true  // Permite pasar la peticion al callback
        },
        function(req, username, password, done) { 
            // Comprueba en la base de datos (MongoDB) si existe el usuario o no
            User.findOne({ 'username' :  username }, 
                function(err, user) {
                    // En caso de error, retornamos con el metodo done
                    if (err)
                        return done(err);
                    // Si el nombre de usuario no existe, lanzamos un mensaje y retornamos al inicio
                    if (!user){
                        console.log('Usuario no encontrado con este nombre '+username);
                        return done(null, false, req.flash('message', 'Usuario no encontrado'));                 
                    }
                    // Si por el contrario el usuario existe, pero no coincide la contraseña
                    if (!isValidPassword(user, password)){
                        console.log('Contraseña Incorrecta');
                        return done(null, false, req.flash('message', 'Contraseña Incorrecta')); // redirect back to login page
                    }
                    // Si tanto el usuario como la contraseña coinciden, retornamos con el metodo done,
                    
                    return done(null, user);
                }
            );

        })
    );

    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }
    
}