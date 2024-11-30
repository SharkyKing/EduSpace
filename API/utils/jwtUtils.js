// utils/jwtUtils.js

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const ACCESS_TOKEN_EXPIRY = '15m'; // Access token expires in 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // Refresh token expires in 7 days

// Generate Access Token
function generateAccessToken(userId, RoleID) {
    return jwt.sign({ userId, RoleID }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

// Generate Refresh Token
function generateRefreshToken(userId) {
    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
}

// Verify Access Token
function verifyAccessToken(token) {
    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
        return null;
    }
}

// Verify Refresh Token
function verifyRefreshToken(token) {
    try {
        return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        return null;
    }
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
};
