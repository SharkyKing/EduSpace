const jwt = require('jsonwebtoken');
const { User } = require('../models/');
const { verifyAccessToken, verifyRefreshToken } = require('../utils/jwtUtils');

const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; 
    console.log('Authorization header:', req.headers['authorization']);
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
        return res.status(403).json({ error: 'Invalid or expired access token' });
    }

    req.user = decoded; // Attach user data to request
    next();
};

const authenticateRefreshToken = (req, res, next) => {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token required' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
        return res.status(403).json({ error: 'Invalid or expired refresh token' });
    }

    req.user = decoded; // Attach user data to request
    next();
};

module.exports = { authenticateJWT, authenticateRefreshToken };
