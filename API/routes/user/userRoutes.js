const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User, Role } = require('../../models');
const db = require('../../models');
const {authenticateJWT} = require('../../middlewares/authMiddleware');
const validateNumber = require('../../middlewares/validateNumber');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Account management
 */

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Get user details by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       '200':
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 FirstName:
 *                   type: string
 *                 LastName:
 *                   type: string
 *                 Email:
 *                   type: string
 *                   format: email
 *                 Username:
 *                   type: string
 *                 RoleName:
 *                   type: string
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal Server Error
 */
router.get('/:id', authenticateJWT, validateNumber('id'), async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['Password'] }
        });

        if (!user) return res.status(404).json({ error: 'User not found' });

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /api/user/{id}:
 *   patch:
 *     summary: Update user details by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               FirstName:
 *                 type: string
 *               LastName:
 *                 type: string
 *               Email:
 *                 type: string
 *                 format: email
 *               Username:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User updated successfully
 *       '404':
 *         description: User not found
 *       '400':
 *         description: Invalid input data
 *       '500':
 *         description: Internal Server Error
 */
router.patch('/:id', authenticateJWT, validateNumber('id'), async (req, res) => {
    const updateData = req.body;

    if (!updateData.FirstName && !updateData.LastName && !updateData.Email && !updateData.Username) {
        return res.status(400).json({ error: 'No fields to update provided' });
    }

    try {
        const user = await User.findByPk(req.params.id);

        if (!user) return res.status(404).json({ error: 'User not found' });

        await user.update(updateData);

        const updatedUser = await User.findByPk(req.params.id, { attributes: { exclude: ['Password'] } });
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get all users except the authenticated user
 *     tags: [User]
 *     responses:
 *       '200':
 *         description: A list of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   FirstName:
 *                     type: string
 *                   LastName:
 *                     type: string
 *                   Email:
 *                     type: string
 *                     format: email
 *                   Username:
 *                     type: string
 *                   RoleName:
 *                     type: string
 *       '500':
 *         description: Internal Server Error
 */
router.get("", authenticateJWT, async (req, res) => {
    try {
        const users = await User.findAll({
            include: [{
                model: Role,
                attributes: []
            }],
            attributes: {
                include: [
                    [db.sequelize.col('Role.RoleName'), 'RoleName']
                ]
            },
            where: { id: { [db.Sequelize.Op.ne]: req.user.id } }
        });

        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: "An error occurred while fetching users." });
    }
});

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal Server Error
 */
router.delete('/:id', authenticateJWT, validateNumber('id'), async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) return res.status(404).json({ error: 'User not found' });

        await user.destroy();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               FirstName:
 *                 type: string
 *               LastName:
 *                 type: string
 *               Email:
 *                 type: string
 *                 format: email
 *               Password:
 *                 type: string
 *               Username:
 *                 type: string
 *             required:
 *               - FirstName
 *               - LastName
 *               - Email
 *               - Password
 *               - Username
 *     responses:
 *       '201':
 *         description: User created successfully
 *       '400':
 *         description: Error in user registration
 *       '500':
 *         description: Internal Server Error
 */
router.post("", async (req, res) => {
    const { FirstName, LastName, Email, Password, Username } = req.body;

    try {
        const RoleUser = await Role.findOne({ where: { RoleName: "User" } });
        if (!RoleUser) return res.status(400).json({ error: "Failed to attach role." });

        const existingEmail = await User.findOne({ where: { Email } });
        if (existingEmail) return res.status(400).json({ error: "Email already exists." });

        const existingUsername = await User.findOne({ where: { Username } });
        if (existingUsername) return res.status(400).json({ error: "Username already exists." });

        const newUser = await User.create({
            FirstName,
            LastName,
            Email,
            Password: Password,
            Username,
            RoleID: RoleUser.id
        });

        res.status(201).json({ message: "User created", user: newUser });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

/**
 * @swagger
 * /api/user/{userId}/threads:
 *   get:
 *     summary: Get all threads created by the user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       '200':
 *         description: A list of threads retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal Server Error
 */
router.get('/:userId/threads', authenticateJWT, validateNumber('id'), async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // Check if user exists
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Fetch threads created by the user
        const threads = await Thread.findAll({
            where: { UserId: userId },  // Assumes Thread has a UserId field
            attributes: ['id', 'title', 'content', 'createdAt', 'updatedAt']
        });

        res.status(200).json(threads);
    } catch (error) {
        console.error('Error fetching user threads:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
