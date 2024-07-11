const jwt = require('jsonwebtoken');
const jwtConfig = require("../config/jwt");

module.exports = {
    pdfAuthenticateToken: function (req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.sendStatus(401);
        }

        jwt.verify(token, jwtConfig.secret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            if (user.level <= 4) {
                return res.status(403).json({ error: "Permissão negada. Nível 4 requirido." });
            }

            req.user = user;
            next();
        });
    }
}

