/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/
  UserController : {
    logout : 'isAuthorized',
    profile : 'isAuthorized',
    changePassword : 'isAuthorized'
  },
  CategoryController : {
    '*' : ['isAuthorized', 'isAdmin'], //AND condition
    listAll : 'isAuthorized',
    getOneCategory: 'isAuthorized',
  },
  FoodController : {
    '*' : ['isAuthorized', 'isAdmin'],
    listAll : 'isAuthorized',
    listOneFood : 'isAuthorized',
  },
  OrderController : {
    '*' :[ 'isAuthorized','isUser'],
  },
  CartController : {
    '*' : ['isAuthorized', 'isUser'],
  },
  FavouriteController : {
    '*' :['isAuthorized', 'isUser'],
  },
  BookTableController : {
    '*' : ['isAuthorized', 'isUser'],
    confirm : 'isAdmin'
  }


};
