/**
 * BookTable.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const date1 = require('date-and-time');
let validateUser = sails.config.common.validation.BookTable;
let Validator = require('validatorjs');


module.exports = {

  attributes: {

    user : {
      model : 'User'
    },
    date : {
      type : 'ref',
      defaultsTo  : new Date().toLocaleDateString(),
    },
    guestNo : {
      type : 'number',
      columnType : 'integer'
    },
    timeSlot : {
      type : 'ref',
    },
    email : {
      type : 'string',
      columnType : 'varchar(255)'
    },
    orderStatus : {
      type : 'string',
      isIn : ['pending', 'confirm', 'cancel'],
      defaultsTo : 'pending'
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

  },
  checkDate : async function(attr1) {
    let newDate = date1.transform(attr1,'D/M/YYYY','M/D/YYYY')
    newDate = Date.parse(newDate)
    let todayDate = new Date().toLocaleDateString()
    todayDate = Date.parse(todayDate)
    const newData = date1.isValid(attr1,'D/M/YYYY')
    let msg;
    if(newData == false) {
        msg = 'Date is invalid'
    } else if( newDate < todayDate) {
        msg = 'Date is not accepted'
    } else {
        msg = 'done'
    }
    let data = {
      date : attr1,
      msg : msg
    }
    return data;
  },
  checkTime : async function(attr1,attr2) {
    let msg, time;
    let newDate = Date.parse(attr2.concat(" " + attr1))
    let todayDate = new Date().toLocaleString()
    todayDate = date1.transform(todayDate, 'M/D/YYYY, h:m:s A','D/M/YYYY, h:m:s A')
    todayDate = Date.parse(todayDate)
    if(newDate < todayDate) {
      return {msg : 'could not book table'}
    }
    /* const match = attr.match('^(1[0-2]|0?[1-9]):([0-5]?[0-9] ([AaPp][Mm]))$')
    const match1 = attr.match('^(1[1]?[0-2]):([0-5]?[0-9] ([Pp][Mm]))$')
    const match2 = attr.match('^(0?[0-7]):([0-5]?[0-9] ([Aa][Mm]))$')
    if(match1 != null || match2 != null){
      msg = 'Restaurant closed'
    } else if(match[0]){
      msg = 'Restaurant open'
    } */
    let day = date1.transform(attr2,'D/M/YYYY','M/D/YYYY')
    let newDay = new Date(day).getDay()
    if(newDay == 0 || newDay == 3) {
      return {msg : 'Restaurant closed'}
    }
    const newData = date1.isValid(attr1,'h:m A')
    if(newData == false){
      return {msg : 'time is invalid'}
    }
    const data = date1.preparse(attr1, 'h:m A')
    switch(newDay){
      case 1 : {
        time = (data.h >= 9 && data.A == 0) || (data.h < 9 && data.A == 1)
        console.log('monday');
        break;
      }
      case 2 : {
        time = (data.h >= 9 && data.A == 0) || (data.h < 6 && data.A == 1)
        console.log('tuesday');

        break;
      }
      case 4 : {
        time = (data.h >= 9 && data.A == 0) || (data.h <= 8 && data.A == 1)
        console.log('thursday');
        break;
      }
      case 5 : {
        time = (data.h >= 10 && data.A == 0) || (data.h <= 10 && data.A == 1)
        console.log('friday');
        break;
      }
      case 6 : {
        time = (data.h >= 10 && data.A == 0) || (data.h <= 11 && data.A == 1)
        console.log('saturday');
        break;
      }
    }
    if(time) {
      return time
    } else {
      return {msg : 'Restaurant closed'}
    }
  }

};