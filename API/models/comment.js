// models/Comment.js
module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define("Comment", {
        CommentText: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        RelevancyCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0, 
        },
    });

    Comment.associate = (models) => {
        Comment.belongsTo(models.Thread, {
            foreignKey: 'ThreadID',
            onDelete: 'CASCADE',
        });
        Comment.belongsTo(models.User, { 
            foreignKey: 'UserID',
            onDelete: 'NO ACTION',
        });
    };

    return Comment;
};
