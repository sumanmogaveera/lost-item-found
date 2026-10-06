const sequelize = require('../config/database');
const User = require('./user');
const Item = require('./item');
const ItemImage = require('./itemImage');
const SearchInterest = require('./searchInterest');
const Notification = require('./notification');

// Associations
User.hasMany(Item, { foreignKey: 'user_id', as: 'foundItems' });
Item.belongsTo(User, { foreignKey: 'user_id', as: 'finder' });

Item.hasMany(ItemImage, { foreignKey: 'item_id', as: 'images' });
ItemImage.belongsTo(Item, { foreignKey: 'item_id', as: 'item' });

User.hasMany(SearchInterest, { foreignKey: 'user_id', as: 'searchInterests' });
SearchInterest.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Notification.belongsTo(Item, { foreignKey: 'related_item_id', as: 'relatedItem' });

module.exports = {
  sequelize,
  User,
  Item,
  ItemImage,
  SearchInterest,
  Notification
};
