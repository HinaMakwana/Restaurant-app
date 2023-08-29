/**
 * Cart.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
let validateUser = sails.config.common.validation.Cart;
let Validator = require('validatorjs');

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
      type : 'number'
    },
    isDeleted : {
      type : 'boolean',
      defaultsTo : false
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
