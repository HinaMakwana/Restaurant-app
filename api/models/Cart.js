/**
 * Cart.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    user : {
      model : 'User'
    },
    food : {
      model : 'Food'
    },
    price : {
      type : 'number'
    },
    quantity : {
      type : 'number',
      defaultsTo : 1
    },
    totalAmount : {
      type : 'float'
    },
    isDeleted : {
      type : 'boolean',
      defaultsTo : false
    }

  },
  validate : async (req)=> {
    req.check('food').exists().withMessage('food id is required')
  }

};
