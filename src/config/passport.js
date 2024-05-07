// src/config/passport.js
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

module.exports = function(passport) {
    // Ensure the JWT secret is defined
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT secret is undefined. Check your .env file and environment variables.");
    }

    // Local strategy for handling email and password login
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            // Attempt to find the user by their email
            const user = await User.findOne({ where: { email } });
            if (!user) {
                // No user found with that email
                return done(null, false, { message: 'That email is not registered' });
            }

            // Compare password with the hashed password stored in the database
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                // Passwords do not match
                return done(null, false, { message: 'Password incorrect' });
            }

            // If everything passes, return the user object
            return done(null, user);
        } catch (error) {
            // Handle errors and pass to done
            console.error('Error during local strategy authentication:', error);
            return done(error);
        }
    }));

    // JWT strategy for handling access with a JSON Web Token
    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwtSecret,
        algorithms: ['HS256']  // Specify the algorithm used for token signing
    }, async (jwt_payload, done) => {
        try {
            // Attempt to find the user by their ID from the JWT payload
            const user = await User.findByPk(jwt_payload.id);
            if (user) {
                // If user is found, return the user object
                return done(null, user);
            } else {
                // No user found with this ID
                return done(null, false, { message: 'Token does not match any user' });
            }
        } catch (error) {
            // Handle errors
            console.error('Error during JWT strategy authentication:', error);
            return done(error);
        }
    }));
};
