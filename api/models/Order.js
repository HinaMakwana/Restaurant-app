/**
 * Order.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    user : {
      model : 'User'
    },
    totalAmount : {
      type : 'number',
      columnType : 'float'
    },
    address : {
      type : 'string',
      maxLength : 140,
      columnType : 'varchar'
    },
    orderDate : {
      type : 'ref',
      defaultsTo : new Date().toLocaleDateString(),
      columnType : 'date'
    },
    isDeliver : {
      type : 'boolean',
      defaultsTo : false
    },
    isDeleted : {
      type : 'boolean',
      defaultsTo : false
    }

  },

};
