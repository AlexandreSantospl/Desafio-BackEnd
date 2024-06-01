module.exports = {
    auth: function(req, res, next){
        if(req.isAuthenticated() && req.user.tipo != 6){
            return next();
        }
        req.flash("error_msg", "Você deve estar logado para entrar aqui!")
        res.redirect("/");
    }
}