module.exports = {
    auth: function(req, res, next) {
        if (req.isAuthenticated() && req.user.level > 3) {
            return next();
        }
        req.flash("error_msg", "Você não tem permissão para baixar este relatorio!");
        res.redirect("/");
    }
};
