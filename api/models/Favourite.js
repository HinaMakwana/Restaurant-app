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
    defaultsTo : new Date().toLocaleDateString()
   },
   price : {
    type : 'float'
   },
   isDeleted : {
    type : 'boolean',
    defaultsTo : false
   }

  },

};
