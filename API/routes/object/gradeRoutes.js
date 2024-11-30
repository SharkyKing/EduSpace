const express = require('express');
const router = express.Router();
const { Grade } = require('../../models'); 
const {authenticateJWT} = require('../../middlewares/authMiddleware'); 
const validateNumber = require('../../middlewares/validateNumber');

/**
 * @swagger
 * tags:
 *   name: Grades
 *   description: Grade management
 */

/**
 * @swagger
 * /api/grades:
 *   post:
 *     summary: Create a new grade
 *     tags: [Grades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               GradeName:
 *                 type: string
 *             required:
 *               - GradeName
 *     responses:
 *       '201':
 *         description: Grade created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 GradeName:
 *                   type: string
 *       '400':
 *         description: Grade name is required
 *       '500':
 *         description: Internal Server Error
 */
router.post('', authenticateJWT, async (req, res) => {
    try {
        const { GradeName } = req.body;

        if (!GradeName || typeof GradeName !== 'string' || GradeName.trim() === '') {
            return res.status(400).json({ error: 'Grade name is required and must be a non-empty string.' });
        }

        const newGrade = await Grade.create({ GradeName: GradeName.trim() });
        res.status(201).json(newGrade);
    } catch (error) {
        console.error('Error creating grade:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /api/grades/{id}:
 *   patch:
 *     summary: Update a grade by ID
 *     tags: [Grades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The grade ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               GradeName:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Grade updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 GradeName:
 *                   type: string
 *       '400':
 *         description: GradeName is required for the update
 *       '404':
 *         description: Grade not found
 *       '500':
 *         description: Internal Server Error
 */
router.patch('/:id', authenticateJWT, validateNumber('id'), async (req, res) => {
    try {
        const { id } = req.params;
        const { GradeName } = req.body;

        const grade = await Grade.findByPk(id);
        if (!grade) {
            return res.status(404).json({ error: 'Grade not found' });
        }

        if (GradeName && typeof GradeName === 'string' && GradeName.trim() !== '') {
            grade.GradeName = GradeName.trim();
        } else {
            return res.status(400).json({ error: 'GradeName is required and must be a non-empty string.' });
        }

        await grade.save();
        res.status(200).json(grade);
    } catch (error) {
        console.error('Error updating grade:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /api/grades/{id}:
 *   delete:
 *     summary: Delete a grade by ID
 *     tags: [Grades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The grade ID
 *     responses:
 *       '200':
 *         description: Grade deleted successfully
 *       '404':
 *         description: Grade not found
 *       '500':
 *         description: Internal Server Error
 */
router.delete('/:id', authenticateJWT, validateNumber('id'), async (req, res) => {
    try {
        const { id } = req.params;

        const grade = await Grade.findByPk(id);
        if (!grade) {
            return res.status(404).json({ error: 'Grade not found' });
        }

        await grade.destroy();
        res.status(200).json({ message: 'Grade deleted successfully' });
    } catch (error) {
        console.error('Error deleting grade:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /api/grades:
 *   get:
 *     summary: Get all grades
 *     tags: [Grades]
 *     responses:
 *       '200':
 *         description: A list of grades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   GradeName:
 *                     type: string
 *       '500':
 *         description: Internal Server Error
 */
router.get('', async (req, res) => {
    try {
        const grades = await Grade.findAll();
        res.status(200).json(grades); 
    } catch (error) {
        console.error('Error fetching grades:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
/**
 * @swagger
 * /api/grades/{id}:
 *   get:
 *     summary: Get a specific grade by ID
 *     tags: [Grades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The grade ID
 *     responses:
 *       '200':
 *         description: Grade retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 GradeName:
 *                   type: string
 *       '404':
 *         description: Grade not found
 *       '500':
 *         description: Internal Server Error
 */
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const grade = await Grade.findByPk(id);

        if (!grade) {
            return res.status(404).json({ error: 'Grade not found' });
        }

        res.status(200).json(grade);
    } catch (error) {
        console.error('Error fetching grade:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
