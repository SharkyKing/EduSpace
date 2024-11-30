const express = require('express');
const router = express.Router();
const { Category } = require('../../models'); 
const {authenticateJWT} = require('../../middlewares/authMiddleware'); 
const validateNumber = require('../../middlewares/validateNumber');

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   patch:
 *     summary: Update a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CategoryName:
 *                 type: string
 *             required:
 *               - CategoryName
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 CategoryName:
 *                   type: string
 *       '404':
 *         description: Category not found
 *       '400':
 *         description: Invalid input - CategoryName must be a non-empty string
 *       '500':
 *         description: Internal Server Error
 */
router.patch('/:id', authenticateJWT, validateNumber('id'), async (req, res) => {
    const { id } = req.params;
    const { CategoryName } = req.body;

    if (!CategoryName || typeof CategoryName !== 'string' || CategoryName.trim() === '') {
        return res.status(400).json({ error: 'CategoryName is required and must be a non-empty string.' });
    }

    try {
        // Atomic update using a single query
        const [updatedCount, [updatedCategory]] = await Category.update(
            { CategoryName: CategoryName.trim() },
            { where: { id }, returning: true }
        );

        if (updatedCount === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The category ID
 *     responses:
 *       '200':
 *         description: Category deleted successfully
 *       '404':
 *         description: Category not found
 *       '500':
 *         description: Internal Server Error
 */
router.delete('/:id', authenticateJWT, validateNumber('id'), async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        await category.destroy();
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CategoryName:
 *                 type: string
 *             required:
 *               - CategoryName
 *     responses:
 *       '201':
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 CategoryName:
 *                   type: string
 *       '400':
 *         description: Category name is required and must be a non-empty string
 *       '500':
 *         description: Internal Server Error
 */
router.post('', authenticateJWT, async (req, res) => {
    try {
        const { CategoryName } = req.body;

        if (!CategoryName || typeof CategoryName !== 'string' || CategoryName.trim() === '') {
            return res.status(400).json({ error: 'CategoryName is required and must be a non-empty string.' });
        }

        const newCategory = await Category.create({ CategoryName: CategoryName.trim() });
        res.status(201).json(newCategory);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       '200':
 *         description: A list of categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   CategoryName:
 *                     type: string
 *       '500':
 *         description: Internal Server Error
 */
router.get('', async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json(categories); 
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get a specific category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The category ID
 *     responses:
 *       '200':
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 CategoryName:
 *                   type: string
 *       '404':
 *         description: Category not found
 *       '500':
 *         description: Internal Server Error
 */
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findByPk(id);
        
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.status(200).json(category);
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
