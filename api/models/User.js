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
      required : true,
      columnType : 'varchar(120)'
    },
    email : {
      type : 'string',
      required : true,
      isEmail : true,
      columnType : 'varchar(255)'
    },
    password : {
      type : 'string',
      required : true,
      columnType : 'varchar(255)'
    },
    token : {
      type : 'string',
      allowNull: true,
      columnType: 'varchar'
    },
    role : {
      type : 'string',
      isIn : [ 'user', 'admin' ],
      defaultsTo : 'user',
    },
    mobileNo : {
      type : 'number',
      columnType: 'float'
    },
    address : {
      type : 'string',
      maxLength : 150,
      columnType : 'varchar'
    },
    isDeleted: {
      type: 'boolean',
      defaultsTo: false,
      columnType: 'boolean'
    },
    otp : {
      type: 'string',
      allowNull : true,
      columnName : 'forgetPasswordOtp'
    },
    expiryTime : {
      type: 'ref',
      columnName : 'otpExpireTime'
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
