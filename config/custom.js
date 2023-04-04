/**
 * Custom configuration
 * (sails.config.custom)
 *
 * One-off settings specific to your application.
 *
 * For more information on custom configuration, visit:
 * https://sailsjs.com/config/custom
 */
const uuid = require('uuid-random');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var validate = require('sails-hook-validation-ev/lib/validate');
module.exports.custom = {
  
  uuid,
  bcrypt,
  jwt,
  validate
  /***************************************************************************
  *                                                                          *
  * Any other custom config this Sails app should use during development.    *
  *                                                                          *
  ***************************************************************************/
  // sendgridSecret: 'SG.fake.3e0Bn0qSQVnwb1E4qNPz9JZP5vLZYqjh7sn8S93oSHU',
  // stripeSecret: 'sk_test_Zzd814nldl91104qor5911gjald',
  // …

};
