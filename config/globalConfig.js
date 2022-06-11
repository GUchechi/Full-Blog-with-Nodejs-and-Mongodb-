 module.exports = {
     globalVariables: ( req, res, next) => {
        res.locals.error_message = req.flash("error-message");
        res.locals.success_message = req.flash("success-message");
        res.locals.messages = require('express-messages')(req, res);
        res.locals.session = req.session;
        res.locals.isAuthenticated = req.user ? true : false;
        res.locals.user = req.user || null;  

        next();
     }
 }  