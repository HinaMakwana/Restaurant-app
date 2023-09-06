/**
 * Favourite.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

   user : {
    model : 'User'
   },
   foodName : {
    model : 'Food'
   },
   date : {
    type : 'ref',
    defaultsTo : new Date().toLocaleDateString(),
    columnType : 'date'
   },
   price : {
    type : 'number',
    columnType : 'float'
   },
   isDeleted : {
    type : 'boolean',
    defaultsTo : false,
    columnType : 'boolean'
   }

  },

};
