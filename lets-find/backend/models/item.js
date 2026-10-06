const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Item = sequelize.define('Item', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    category: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'Found'
    },
    brand: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    color: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    found_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    latitude: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: true
    },
    longitude: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: true
    },
    area: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    verification_question: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    verification_answer_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    keywords: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'items'
});

module.exports = Item;
