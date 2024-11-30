module.exports = (sequelize, DataTypes) => {
    const ThreadVote = sequelize.define("ThreadVote", {
        ThreadID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true, // Ensure ThreadID is unique per UserID
        },
        UserID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true, // Ensure UserID is unique per ThreadID
        },
        Vote: {
            type: DataTypes.INTEGER,
            defaultValue: 0, // Default value for upvote
        },
    });

    ThreadVote.associate = (models) => {
        ThreadVote.belongsTo(models.Thread, {
            foreignKey: 'ThreadID',
            onDelete: 'CASCADE',
        });
        ThreadVote.belongsTo(models.User, {
            foreignKey: 'UserID',
            onDelete: 'NO ACTION',
        });
    };

    return ThreadVote;
};
