// middleware/validateRoleName.js

const MAX_ROLE_NAME_LENGTH = 100; // Set a max length for role names

/**
 * Middleware to validate the role name.
 * Ensures that the role name is a string, not empty, and within length limits.
 */
function validateRoleName(req, res, next) {
    const { RoleName } = req.body;

    if (!RoleName || typeof RoleName !== 'string') {
        return res.status(400).json({ error: "Role name is required and must be a string." });
    }

    if (RoleName.trim() === '') {
        return res.status(400).json({ error: "Role name cannot be an empty string." });
    }

    if (RoleName.length > MAX_ROLE_NAME_LENGTH) {
        return res.status(400).json({ error: `Role name cannot be longer than ${MAX_ROLE_NAME_LENGTH} characters.` });
    }

    // Trim the role name before proceeding
    req.body.RoleName = RoleName.trim();
    next();
}

module.exports = validateRoleName;
