module.exports = {
    isLoggedIn:(req, res, next) => {
        if(req.isAuthenticated()){
            next()           
        }else{
            req.flash('error-message', 'please login to continue')
            res.redirect('/login')
        }
        }}
