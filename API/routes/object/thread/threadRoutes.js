const express = require('express');
const router = express.Router();
const { Thread, Category, Grade, User, ThreadVote, Comment } = require('../../../models');
const { Op } = require('sequelize');
const {authenticateJWT} = require('../../../middlewares/authMiddleware');
const validateNumber = require('../../../middlewares/validateNumber');

/**
 * @swagger
 * tags:
 *   name: Threads
 *   description: Thread management
 */

/**
 * @swagger
 * /api/threads:
 *   get:
 *     summary: Get all threads
 *     tags: [Threads]
 *     parameters:
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter threads by category ID
 *       - in: query
 *         name: grade
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter threads by grade ID
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Search for threads by title or content
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
 *                   ThreadName:
 *                     type: string
 *                   ThreadText:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       '500':
 *         description: Internal Server Error
 */
router.get('', async (req, res) => {
    try {
        const { category, grade, search } = req.query;

        const filters = {};

        if (category && category > 0) filters.CategoryId = category;
        if (grade && grade > 0) filters.GradeId = grade;
        if (search) {
            filters[Op.or] = [
                { ThreadName: { [Op.like]: `%${search}%` } },
                { ThreadText: { [Op.like]: `%${search}%` } }
            ];
        }

        const threads = await Thread.findAll({
            where: filters,
            include: [
                { model: Category, attributes: ['CategoryName'] },
                { model: Grade, attributes: ['GradeName'] },
                { 
                    model: Comment,
                    attributes: ['id', 'CommentText', 'RelevancyCount', 'createdAt'],
                    include: [
                        { model: User, attributes: ['id', 'FirstName', 'LastName'] },
                    ]
                },
                {
                    model: User, // User who created the thread
                    attributes: ['id', 'FirstName', 'LastName'], // Adjust attributes as needed
                }
            ]
        });

        res.status(200).json(threads);
    } catch (error) {
        console.error('Error fetching threads:', error);
        res.status(500).json({ error: "An error occurred while fetching threads." });
    }
});

/**
 * @swagger
 * /api/thread:
 *   post:
 *     summary: Create a new thread
 *     tags: [Threads]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ThreadName:
 *                 type: string
 *               ThreadText:
 *                 type: string
 *               CategoryID:
 *                 type: integer
 *               GradeID:
 *                 type: integer
 *             required:
 *               - ThreadName
 *               - ThreadText
 *               - CategoryID
 *               - GradeID
 *     responses:
 *       '201':
 *         description: Thread created successfully
 *       '400':
 *         description: Missing required fields
 *       '500':
 *         description: Internal Server Error
 */
router.post('', authenticateJWT, async (req, res) => {
    const { ThreadName, ThreadText, CategoryID, GradeID } = req.body;
    const UserID = req.user.userId;
    console.log(req)
    try {
        if (!ThreadName || !ThreadText || !CategoryID || !GradeID) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        const [category, grade, user] = await Promise.all([
            Category.findByPk(CategoryID),
            Grade.findByPk(GradeID),
            User.findByPk(UserID)
        ]);

        if (!category || !grade || !user) {
            return res.status(404).json({ error: "Category, Grade, or User not found." });
        }

        const newThread = await Thread.create({
            ThreadName: ThreadName.trim(),
            ThreadText: ThreadText.trim(),
            CategoryID,
            GradeID,
            UserID,
            RelevancyCount: 0
        });

        res.status(201).json({ message: "Thread created successfully!", thread: newThread });
    } catch (error) {
        console.error('Error creating thread:', error);
        res.status(500).json({ error: "An error occurred while creating the thread." });
    }
});

/**
 * @swagger
 * /api/thread/{threadId}/vote:
 *   post:
 *     summary: Vote on a thread
 *     tags: [Threads]
 *     parameters:
 *       - in: path
 *         name: threadId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The thread ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vote:
 *                 type: integer
 *                 enum: [1, -1]
 *     responses:
 *       '200':
 *         description: Vote recorded successfully
 *       '404':
 *         description: Thread not found
 *       '500':
 *         description: Internal Server Error
 */
router.post('/:threadId/vote', authenticateJWT, async (req, res) => {
    const { threadId } = req.params;
    const { vote } = req.body;
    const userId = req.user.id;

    try {
        const thread = await Thread.findByPk(threadId);
        if (!thread) return res.status(404).json({ error: "Thread not found." });

        const [threadVote, created] = await ThreadVote.findOrCreate({
            where: { ThreadID: threadId, UserID: userId },
            defaults: { Vote: vote }
        });

        if (!created) {
            if (threadVote.Vote !== vote) {
                thread.RelevancyCount += vote === 1 ? 2 : -2;
                threadVote.Vote = vote;
                await threadVote.save();
            }
        } else {
            thread.RelevancyCount += vote === 1 ? 1 : -1;
        }

        await thread.save();
        res.status(200).json({ message: 'Vote recorded successfully!', threadVote });
    } catch (error) {
        console.error('Error voting on thread:', error);
        res.status(500).json({ error: 'An error occurred while voting on the thread.' });
    }
});

/**
 * @swagger
 * /api/thread/{id}:
 *   delete:
 *     summary: Delete a thread by ID
 *     tags: [Threads]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The thread ID
 *     responses:
 *       '200':
 *         description: Thread deleted successfully
 *       '404':
 *         description: Thread not found or user not authorized
 *       '500':
 *         description: Internal Server Error
 */
router.delete('/:id', authenticateJWT, validateNumber('id'), async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const thread = await Thread.findOne({ where: { id, UserID: userId } });
        if (!thread) return res.status(404).json({ error: "Thread not found or you are not authorized." });

        await thread.destroy();
        res.status(200).json({ message: "Thread deleted successfully." });
    } catch (error) {
        console.error("Error deleting thread:", error);
        res.status(500).json({ error: "An error occurred while deleting the thread." });
    }
});

/**
 * @swagger
 * /api/thread/{id}:
 *   patch:
 *     summary: Update a thread by ID
 *     tags: [Threads]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The thread ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ThreadName:
 *                 type: string
 *               ThreadText:
 *                 type: string
 *               CategoryID:
 *                 type: integer
 *               GradeID:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Thread updated successfully
 *       '400':
 *         description: Invalid input or missing required fields
 *       '404':
 *         description: Thread not found or user not authorized
 *       '500':
 *         description: Internal Server Error
 */
router.patch('/:id', authenticateJWT, validateNumber('id'), async (req, res) => {
    const { id } = req.params;
    const { ThreadName, ThreadText, CategoryID, GradeID } = req.body;
    const userId = req.user.id;

    try {
        const thread = await Thread.findOne({ where: { id, UserID: userId } });
        if (!thread) return res.status(404).json({ error: "Thread not found or you are not authorized." });

        if (!ThreadName || !ThreadText || !CategoryID || !GradeID) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        const [category, grade] = await Promise.all([
            Category.findByPk(CategoryID),
            Grade.findByPk(GradeID)
        ]);

        if (!category || !grade) {
            return res.status(404).json({ error: "Category or Grade not found." });
        }

        thread.ThreadName = ThreadName.trim();
        thread.ThreadText = ThreadText.trim();
        thread.CategoryID = CategoryID;
        thread.GradeID = GradeID;

        await thread.save();
        res.status(200).json({ message: "Thread updated successfully!" });
    } catch (error) {
        console.error("Error updating thread:", error);
        res.status(500).json({ error: "An error occurred while updating the thread." });
    }
});
/**
 * @swagger
 * /api/thread/{id}:
 *   get:
 *     summary: Get a specific thread by ID
 *     tags: [Threads]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The thread ID
 *     responses:
 *       '200':
 *         description: The requested thread retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 ThreadName:
 *                   type: string
 *                 ThreadText:
 *                   type: string
 *                 CategoryID:
 *                   type: integer
 *                 GradeID:
 *                   type: integer
 *                 UserID:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       '404':
 *         description: Thread not found
 *       '500':
 *         description: Internal Server Error
 */
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find the thread by its ID
        const thread = await Thread.findByPk(id, {
            include: [
                { model: Category, attributes: ['CategoryName'] },
                { model: Grade, attributes: ['GradeName'] },
                { model: User, attributes: ['username'] } // Include the User for the thread author
            ]
        });

        // If thread not found, return 404
        if (!thread) {
            return res.status(404).json({ error: "Thread not found." });
        }

        // Return the thread data
        res.status(200).json(thread);
    } catch (error) {
        console.error('Error fetching thread:', error);
        res.status(500).json({ error: 'An error occurred while fetching the thread.' });
    }
});

module.exports = router;
