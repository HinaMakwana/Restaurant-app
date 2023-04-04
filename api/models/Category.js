/**
 * Category.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    name : {
      type : 'string'
    },
    isDeleted : {
      type : 'boolean',
      defaultsTo : false
    },
    food : {
      collection : 'food',
      via : 'category'
    }

  },
  validate : async (req)=> {
    req.check('name').exists().withMessage('category name required')
  }

};
