/**
 * Food.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    name : {
      type : 'string',
      required : true
    },
    category : {
      model : 'Category'
    },
    price : {
      type : 'float'
    },
    isDeleted : {
      type : 'boolean',
      defaultsTo : false
    },
    updatedAt : {
      type : 'ref'
    },
    category : {
      model :'category'
    }

  },

  validate : async (req)=> {
    req.check('name').exists().withMessage('food name required')
    req.check('category').exists().withMessage('category is required')
    req.check('price').exists().withMessage('price field is required')
    req.check('price').exists().isFloat().withMessage('enter number only')
  }

};
