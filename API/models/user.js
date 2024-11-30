// models/User.js
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        Username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
            }
        },
        FirstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        LastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        Email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // Ensure emails are unique
            validate: {
                notEmpty: true,
                isEmail: true, // Validate email format
            }
        },
        Password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        }
    });

    User.associate = (models) => {
        User.belongsTo(models.Role, {
            foreignKey: 'RoleID',
            onDelete: 'SET NULL', 
        });
    };

    return User;
};
