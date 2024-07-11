module.exports = {
    autenticadoWeb: function(req, res, next) {
        if (req.isAuthenticated() && req.user.level < 6) {
            return next();
        }
        req.flash("error_msg", "Você não tem permissão para entrar aqui!");
        res.redirect("/");
    }
};
