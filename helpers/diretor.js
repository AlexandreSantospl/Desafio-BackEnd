module.exports = {
    diretor: function(req, res, next){
        if(req.isAuthenticated() && req.user.tipo == 3){
            return next();
        }
        req.flash("error_msg", "Você não tem permissão para entrar aqui!")
        res.redirect("/");
    }
}