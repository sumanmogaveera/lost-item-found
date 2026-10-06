const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('match', 'appeal', 'system'),
        defaultValue: 'match'
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    related_item_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'items',
            key: 'id'
        }
    }
}, {
    tableName: 'notifications',
    underscored: true,
    timestamps: true
});

module.exports = Notification;
