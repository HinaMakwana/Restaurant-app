/**
 * User.js
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
    email : {
      type : 'string',
      required : true,
      isEmail : true
    },
    password : {
      type : 'string',
      required : true
    },
    token : {
      type : 'string'
    },
    role : {
      type : 'string',
      isIn : [ 'user', 'admin' ],
      defaultsTo : 'user',
    },
    mobileNo : {
      type : 'number'
    },
    address : {
      type : 'string',
      maxLength : 150
    }

  },

  validate : async (req)=> {
    req.check('name').exists().withMessage('name is required')
    req.check('email').exists().withMessage('email is required')
    req.check('email').exists().isEmail().withMessage('enter valid email')
    req.check('password').exists().withMessage('password is required')
    req.check('address').exists().withMessage('address is required')
    req.check('address').exists().isLength({ max : 150 }).withMessage('Enter 40 character only in address')
  }

};
