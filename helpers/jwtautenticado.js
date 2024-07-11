const jwt = require('jsonwebtoken');
const jwtConfig = require("../config/jwt");

module.exports = {
    authenticateToken: function (req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.sendStatus(401); 
        }

        jwt.verify(token, jwtConfig.secret, (err, user) => {
            if (err) {
                return res.sendStatus(403); 
            }
            req.user = user;
            next();
        });
    }
}

