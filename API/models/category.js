// models/Category.js
module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define("Category", {
        CategoryName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
    });

    return Category;
};
