const express = require('express');
const router = express.Router();
const { Comment, User, Thread } = require('../../../models');
const {authenticateJWT} = require('../../../middlewares/authMiddleware');
const validateNumber = require('../../../middlewares/validateNumber');

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment management
 */

/**
 * @swagger
 * /api/threads/{threadId}/comment:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: threadId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the thread where the comment will be posted
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CommentText:
 *                 type: string
 *             required:
 *               - CommentText
 *     responses:
 *       '201':
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 comment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     CommentText:
 *                       type: string
 *                     ThreadID:
 *                       type: integer
 *                     UserID:
 *                       type: integer
 *                     RelevancyCount:
 *                       type: integer
 *       '400':
 *         description: CommentText is required and must be a non-empty string.
 *       '500':
 *         description: An error occurred while creating the comment
 */
router.post('/:threadId/comment', authenticateJWT, async (req, res) => {
    const { CommentText } = req.body;
    const ThreadID = req.params.threadId;
    const UserID = req.user.id;

    try {
        if (!CommentText || typeof CommentText !== 'string' || CommentText.trim() === '') {
            return res.status(400).json({ error: "CommentText is required and must be a non-empty string." });
        }

        if (CommentText.length > 500) {
            return res.status(400).json({ error: "CommentText is too long, maximum length is 500 characters." });
        }

        const thread = await Thread.findByPk(ThreadID);
        if (!thread) {
            return res.status(404).json({ error: "Thread not found." });
        }

        // Create new comment
        const newComment = await Comment.create({
            CommentText: CommentText.trim(),
            ThreadID,
            UserID, // Link the comment to the user
            RelevancyCount: 0 // Initial relevancy count
        });

        res.status(201).json({
            message: "Comment created successfully!",
            comment: newComment
        });
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: "An error occurred while creating the comment." });
    }
});

/**
 * @swagger
 * /api/threads/{threadId}/comment/{commentId}:
 *   patch:
 *     summary: Update an existing comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: threadId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The thread ID that the comment belongs to
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CommentText:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 comment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     CommentText:
 *                       type: string
 *                     ThreadID:
 *                       type: integer
 *                     UserID:
 *                       type: integer
 *                     RelevancyCount:
 *                       type: integer
 *       '404':
 *         description: Comment not found or does not belong to the specified thread
 *       '403':
 *         description: You do not have permission to modify this comment.
 *       '500':
 *         description: An error occurred while updating the comment
 */
router.patch('/:threadId/comment/:commentId', authenticateJWT, validateNumber('commentId'), async (req, res) => {
    const { threadId, commentId } = req.params;
    const { CommentText } = req.body;

    try {
        const comment = await Comment.findOne({ where: { id: commentId, ThreadID: threadId } });
        if (!comment) {
            return res.status(404).json({ error: "Comment not found or does not belong to the specified thread." });
        }

        // Check if the user is the owner of the comment
        if (comment.UserID !== req.user.id) {
            return res.status(403).json({ error: "You do not have permission to modify this comment." });
        }

        if (CommentText && (typeof CommentText !== 'string' || CommentText.trim() === '')) {
            return res.status(400).json({ error: "CommentText must be a non-empty string." });
        }

        if (CommentText) {
            comment.CommentText = CommentText.trim();
            await comment.save();
        }

        res.status(200).json({ message: "Comment updated successfully!", comment });
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ error: "An error occurred while updating the comment." });
    }
});

/**
 * @swagger
 * /api/threads/{threadId}/comment/{commentId}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: threadId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The thread ID that the comment belongs to
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The comment ID
 *     responses:
 *       '200':
 *         description: Comment deleted successfully
 *       '404':
 *         description: Comment not found or does not belong to the specified thread
 *       '403':
 *         description: You do not have permission to delete this comment.
 *       '500':
 *         description: An error occurred while deleting the comment
 */
router.delete('/:threadId/comment/:commentId', authenticateJWT, validateNumber('commentId'), async (req, res) => {
    const { commentId, threadId } = req.params;

    try {
        const comment = await Comment.findOne({ where: { id: commentId, ThreadID: threadId } });
        if (!comment) {
            return res.status(404).json({ error: "Comment not found or does not belong to the specified thread." });
        }

        // Check if the user is the owner of the comment
        if (comment.UserID !== req.user.id) {
            return res.status(403).json({ error: "You do not have permission to delete this comment." });
        }

        await comment.destroy();
        res.status(200).json({ message: "Comment deleted successfully!" });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: "An error occurred while deleting the comment." });
    }
});

/**
 * @swagger
 * /api/threads/{threadId}/comment:
 *   get:
 *     summary: Get all comments for a specific thread
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: threadId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the thread to fetch comments for
 *     responses:
 *       '200':
 *         description: A list of comments for the specified thread
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   CommentText:
 *                     type: string
 *                   ThreadID:
 *                     type: integer
 *                   UserID:
 *                     type: integer
 *                   RelevancyCount:
 *                     type: integer
 *       '400':
 *         description: Invalid threadId
 *       '500':
 *         description: An error occurred while fetching comments
 */
router.get('/:threadId/comment', async (req, res) => {
    const { threadId } = req.params;

    try {
        const comments = await Comment.findAll({
            where: { ThreadID: threadId },
            include: [{ model: User, attributes: ['id', 'name'] }]
        });

        if (comments.length === 0) {
            return res.status(200).json({ message: "No comments found for the specified thread." });
        }

        res.status(200).json({ message: "Comments fetched successfully", comments });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: "An error occurred while fetching comments." });
    }
});
/**
 * @swagger
 * /api/threads/comment/{commentId}:
 *   get:
 *     summary: Get a specific comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the comment to fetch
 *     responses:
 *       '200':
 *         description: The specific comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 CommentText:
 *                   type: string
 *                 ThreadID:
 *                   type: integer
 *                 UserID:
 *                   type: integer
 *                 RelevancyCount:
 *                   type: integer
 *       '404':
 *         description: Comment not found
 *       '500':
 *         description: An error occurred while fetching the comment
 */
router.get('/comment/:commentId', async (req, res) => {
    const { commentId } = req.params;

    try {
        const comment = await Comment.findOne({
            where: { id: commentId },
            include: [{ model: User, attributes: ['id', 'name'] }]
        });

        if (!comment) {
            return res.status(404).json({ error: "Comment not found." });
        }

        res.status(200).json(comment);
    } catch (error) {
        console.error('Error fetching comment:', error);
        res.status(500).json({ error: "An error occurred while fetching the comment." });
    }
});

module.exports = router;
