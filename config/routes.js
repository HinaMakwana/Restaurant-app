/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

    //routes for bookTable
    'POST /table/book' : 'BookTableController.book',
    'DELETE /table/cancel' : 'BookTableController.cancel',
    'GET /table/list' : 'BookTableController.list',
    'POST /table/listOne' : 'BookTableController.listOne',
    'POST /table/confirm' : 'BookTableController.confirm',

    //routes for favourite
    'POST /fav/add' : 'FavouriteController.add',
    'DELETE /fav/delete' : 'FavouriteController.delete',
    'GET /fav/list' : 'FavouriteController.list',
    'GET /fav/:name' : 'FavouriteController.search',

//routes for cartA
    'POST /cart/add' : 'CartController.add',
    'GET /cart/list' : 'CartController.list',
    'DELETE /cart/delete' : 'CartController.delete',
    'PATCH /cart/update' : 'CartController.update',

    //routes for order
    'POST /order/add' : 'OrderController.add',
    'GET /order/list' : 'OrderController.list',
    'DELETE /order/delete' : 'OrderController.delete',

    //routes for food
    'POST /food/add' : 'FoodController.add',
    'DELETE /food/delete' : 'FoodController.delete',
    'PATCH /food/update' : 'FoodController.update',
    'GET /' : 'FoodController.listAll',
    'POST /listFood' : 'FoodController.listOneFood',

    //routes for category
    'POST /category/add' : 'CategoryController.add',
    'DELETE /category/delete' : 'CategoryController.delete',
    'GET /listAll' : 'CategoryController.listAll',
    'PATCH /update/:id' : 'CategoryController.update',
    'GET /:id' : 'CategoryController.getOneCategory',

    //routes for user
    'POST /user/signup' : 'UserController.signUp',
    'POST /user/login' : 'UserController.login',
    'POST /user/logout' : 'UserController.logout',
    'GET /user/list' : 'UserController.list',
    'GET /listOne' : 'UserController.profile',
};
