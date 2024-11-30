
const validateNumber = (param) => (req, res, next) => {
    const value = req.params[param];

    if (isNaN(value) || !Number.isInteger(Number(value))) {
        return res.status(400).json({ error: `${param} must be a valid integer` });
    }

    next();
};

module.exports = validateNumber;
