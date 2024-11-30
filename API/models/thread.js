// models/Thread.js
module.exports = (sequelize, DataTypes) => {
    const Thread = sequelize.define("Thread", {
        ThreadName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        ThreadText: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        RelevancyCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    });

    Thread.associate = (models) => {
        Thread.belongsTo(models.Category, {
            foreignKey: 'CategoryID',
            onDelete: 'CASCADE',
        });
        Thread.belongsTo(models.Grade, {
            foreignKey: 'GradeID',
            onDelete: 'CASCADE',
        });
        // New association with the User model
        Thread.belongsTo(models.User, {
            foreignKey: 'UserID', // Add UserID foreign key
            onDelete: 'CASCADE',
        });

        Thread.hasMany(models.Comment, {
            foreignKey: 'ThreadID', // This will reference the ThreadID in the Comment model
            onDelete: 'CASCADE', // Delete comments when a thread is deleted
        });
    };

    return Thread;
};
