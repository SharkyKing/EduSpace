const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Role } = require('../../models');
const {authenticateJWT} = require('../../middlewares/authMiddleware');
const { body, validationResult } = require('express-validator');
const { generateAccessToken, generateRefreshToken } = require('../../utils/jwtUtils');
/**
 * @swagger
 * tags:
 *   name: Account
 *   description: User management
 */

/**
 * @swagger
 * /api/account/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: User logged in successfully
 *       '404':
 *         description: User not found
 *       '401':
 *         description: Invalid password
 *       '500':
 *         description: Internal Server Error
 */
router.post("/login", 
    body('Email').isEmail().withMessage('Invalid email format'),
    body('Password').notEmpty().withMessage('Password is required'),
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { Email, Password } = req.body;

        try {
            const user = await User.findOne({ where: { Email: Email } });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            console.log(Password, user.Password)

            const isValidPassword = await bcrypt.compare(Password, user.Password);
            if (!isValidPassword) {
                return res.status(401).json({ error: "Invalid password" });
            }

            // Generate tokens
            const accessToken = generateAccessToken(user.id, user.RoleID);
            const refreshToken = generateRefreshToken(user.id);
            console.log(accessToken)
            // Store refresh token in the database or other secure store (optional, for persistence)
            // Optionally, store it in the user model or use a separate table

            // Send tokens back to the client
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',  // Ensure cookies are only sent over HTTPS in production
                sameSite: 'Strict', // Added SameSite attribute for security
                maxAge: 7 * 24 * 60 * 60 * 1000  // Refresh token expiration (7 days)
            });

            res.status(200).json({
                message: "User logged in successfully",
                accessToken,  // Send access token immediately
                user
            });
        } catch (error) {
            console.error("Error logging in user:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

/**
 * @swagger
 * /api/account/logout:
 *   post:
 *     summary: Log out the user
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Logged out successfully
 */
router.post("/logout", authenticateJWT, (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

/**
 * @swagger
 * /api/account/role:
 *   get:
 *     summary: Get the user's role ID from the decoded JWT token
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: The user's role ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 roleId:
 *                   type: integer
 *                   description: The role ID of the user extracted from the token
 *       '204':
 *         description: No content, if roleId is not available in the token
 *       '401':
 *         description: Unauthorized, if the user is not authenticated or no valid token is provided
 *       '500':
 *         description: Internal Server Error
 */
router.get('/role', authenticateJWT, async (req, res) => {
    try {
        
        const roleId = req.user.RoleID; 

        console.log("User's roleId from token:", roleId);

        if (!roleId) {
            return res.status(204).json(); 
        }

        res.status(200).json({ roleId }); 
    } catch (error) {
        console.error('Error fetching roleId:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
