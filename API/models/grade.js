// models/Grade.js
module.exports = (sequelize, DataTypes) => {
    const Grade = sequelize.define("Grade", {
        GradeName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
    });

    return Grade;
};
