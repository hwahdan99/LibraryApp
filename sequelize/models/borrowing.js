'use strict';
const {
  Model, BulkRecordError
} = require('sequelize');
const book = require('./book');
module.exports = (sequelize, DataTypes) => {
  class Borrowing extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Borrowing.belongsTo(sequelize.models.Book, {foreignKey: 'isbn', onDelete: 'CASCADE'});
      Borrowing.belongsTo(sequelize.models.Borrower, {foreignKey: 'borrowerId', onDelete: 'CASCADE'})
    }
  }
  Borrowing.init({
    checkoutDate: DataTypes.DATE,
    dueDate: DataTypes.DATE,
    returnDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Borrowing',
  });
  return Borrowing;
};