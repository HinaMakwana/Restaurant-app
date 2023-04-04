/**
 * FavouriteController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    add : async (req,res)=> {
        const id = sails.config.custom.uuid
        const user = req.userData
        const { food } = req.body
            const findFood = await Food.findOne({ name  : food})
            if(!findFood) {
                return res.status(404).json({
                    message : 'food not found'
                })
            }
            const data = {
                id : id(),
                user : user.userId,
                foodName  : food,
                price : findFood.price
            }
            const addFavourite = await Favourite.findOrCreate({foodName : food, isDeleted : false, user : user.userId},data)
            return res.status(200).json({
                message : 'added food successfully',
                Food : addFavourite
            })
    },
    delete : async (req,res)=> {
        const user = req.userData
        const { food } = req.body
            const findFood = await Favourite.findOne({ foodName  : food , isDeleted : false, user : user.userId})
            if(!findFood) {
                return res.status(404).json({
                    message : 'food not found'
                })
            }
            const deleteFavourite = await Favourite.updateOne({foodName : food, user : user.userId}, { isDeleted : true })
            return res.status(200).json({
                message : 'deleted successfully',
                Food : deleteFavourite
            })
    },
    list : async (req,res)=> {
        const user = req.userData
            const findFav = await Favourite.find({ user : user.userId, isDeleted : false})
            return res.status(200).json({
                user : user.userId,
                count : findFav.length,
                food : findFav
            })
    },
    search : async (req,res)=> {
        const user = req.userData
            const findFood = await Favourite.find({
                foodName : {
                    'contains' : req.param('name')
                },
                isDeleted : false,
                user : user.userId
            })
            if(!findFood[0]){
                return res.status(404).json({
                    message : 'not found'
                })
            }
            return res.status(200).json({
                Name : findFood
            })
    }
};
