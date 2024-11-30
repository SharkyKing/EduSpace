const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Role } = require('../../models');
const {authenticateJWT} = require('../../middlewares/authMiddleware');
const { body, validationResult } = require('express-validator');
const { generateAccessToken, verifyRefreshToken } = require('../../utils/jwtUtils');
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Auth management
 */

/**
 * @swagger
 * /api/auth:
 *   get:
 *     summary: Check if the user is authenticated
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User is authenticated
 *       '401':
 *         description: Unauthorized
 */
router.get("", authenticateJWT, async (req, res) => {
    res.json({ message: 'User is authenticated', user: req.user });
});


/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh the access token using a refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *             required:
 *               - refreshToken
 *     responses:
 *       '200':
 *         description: Access token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       '401':
 *         description: Refresh token required
 *       '403':
 *         description: Invalid or expired refresh token
 *       '500':
 *         description: Internal Server Error
 */

router.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token required' });
    }

    try {
        const decoded = verifyRefreshToken(refreshToken);

        if (!decoded) {
            return res.status(403).json({ error: 'Invalid or expired refresh token' });
        }

        // Generate new access token
        const newAccessToken = generateAccessToken(decoded.userId);

        res.json({ accessToken: newAccessToken });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Error refreshing token' });
    }
});

module.exports = router;
