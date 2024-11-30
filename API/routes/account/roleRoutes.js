const express = require('express');
const router = express.Router();
const { Role } = require('../../models');
const {authenticateJWT} = require('../../middlewares/authMiddleware');
const validateNumber = require('../../middlewares/validateNumber');
const validateRoleName = require('../../middlewares/validateRoleName'); // New middleware for validation

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Role management
 */

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     responses:
 *       '200':
 *         description: A list of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   RoleName:
 *                     type: string
 *       '204':
 *         description: No roles found
 *       '500':
 *         description: Internal Server Error
 */
router.get('', authenticateJWT, async (req, res) => {
    try {
        const roles = await Role.findAll();

        if (!roles || roles.length === 0) {
            return res.status(204).json(); // Return No Content if no roles are found
        }

        res.status(200).json(roles);
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               RoleName:
 *                 type: string
 *             required:
 *               - RoleName
 *     responses:
 *       '201':
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 RoleName:
 *                   type: string
 *       '400':
 *         description: Role name is required
 *       '500':
 *         description: Internal Server Error
 */
router.post('', authenticateJWT, validateRoleName, async (req, res) => {
    try {
        const { RoleName } = req.body;
        const newRole = await Role.create({ RoleName: RoleName.trim() });

        res.status(201).json(newRole);
    } catch (error) {
        console.error('Error creating role:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /api/roles/{id}:
 *   patch:
 *     summary: Update a role by ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The role ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               RoleName:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 RoleName:
 *                   type: string
 *       '400':
 *         description: Role name is required for the update
 *       '404':
 *         description: Role not found
 *       '500':
 *         description: Internal Server Error
 */
router.patch('/:id', authenticateJWT, validateNumber('id'), validateRoleName, async (req, res) => {
    try {
        const { id } = req.params;
        const { RoleName } = req.body;

        const role = await Role.findByPk(id);

        if (!role) {
            return res.status(404).json({ error: 'Role not found' });
        }

        role.RoleName = RoleName.trim();
        await role.save();

        res.status(200).json(role);
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Delete a role by ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The role ID
 *     responses:
 *       '200':
 *         description: Role deleted successfully
 *       '404':
 *         description: Role not found
 *       '500':
 *         description: Internal Server Error
 */
router.delete('/:id', authenticateJWT, validateNumber('id'), async (req, res) => {
    try {
        const { id } = req.params;

        const role = await Role.findByPk(id);

        if (!role) {
            return res.status(404).json({ error: 'Role not found' });
        }

        await role.destroy();
        res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
        console.error('Error deleting role:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
