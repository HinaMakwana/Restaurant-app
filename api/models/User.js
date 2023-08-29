/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

let validateUser = sails.config.common.validation.User;
let Validator = require('validatorjs');
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
      type : 'string',
      allowNull: true
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
    },
    isDeleted: {
      type: 'boolean',
      defaultsTo: false
    }

  },

  validate : async (data)=> {
    let requiredRules = Object.keys(validateUser).filter((key)=> {
      if(Object.keys(data).indexOf(key)>= 0) {
        return key
      }
    })
    let rules = {};
    requiredRules.forEach((val)=> {
      rules[val] = validateUser[val]
    })
    let validate = new Validator(data,rules);
    let result = {}
    if(validate.passes()){
      console.log('validate success');
      result['hasError'] = false
      return data
    }
    if(validate.fails()) {
      console.log(1);
      result['hasError'] = true
      result['error'] = validate.errors.all()
    }
    return result

  }

};
