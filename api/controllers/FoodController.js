/**
 * FoodController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {

    add: async (req,res)=> {
        try {
            const id = sails.config.custom.uuid;
            let {userId} = req.userData;
            const { name, category, price } = req.body;
            let result = await Food.validate({
                name,
                category,
                price
            })
            if(result.hasError) {
                return res.status(400).json({
                    message: 'validation error',
                    error: result.error
                })
            }

            const findCategory = await Category.findOne({
                id : category,
                isDeleted : false
            })
            if(!findCategory) {
                return res.status(404).json({
                    message : 'category not found'
                })
            }
            const checkFood = await Food.findOne({
                name: name,
                isDeleted: false
            })
            if(checkFood) {
                return res.status(409).json({
                    message: 'food already added'
                })
            }
            let data = {
                id : id(),
                name : name,
                category : category,
                price : price,
                addedBy: userId
            }
            const addFood = await Food.create(data)
            .fetch()
            return res.status(200).json({
                message : 'Food created',
                Food : addFood
            })
        } catch (error) {
            return res.status(500).json({
                message: 'server error ' + error
            })
        }
    },
    delete : async (req,res)=> {
        try {
            const { id } = req.body;
            const {userId} = req.userData;
            const findFood = await Food.findOne({
                id : id ,
                isDeleted : false
            })
            if(!findFood) {
                return res.status(404).json({
                    message : 'food not found'
                })
            }
            const deleteFood = await Food.updateOne(
                { id : id, addedBy: userId},
                {isDeleted : true}
            )
            await Cart.updateOne(
                { food : id },
                { isDeleted : true }
            )
            await Favourite.updateOne(
                { foodName : id },
                { isDeleted : true }
            )
            return res.status(200).json({
                message : 'food deleted',
                food : deleteFood
            })
        } catch (error) {
            return res.status(500).json({
                message: 'server error ' + error
            })
        }
    },
    update : async (req,res)=> {
        try {
            let {userId} = req.userData;
            const { id, price }  = req.body;
            const findFood = await Food.findOne({
                id : id,
                isDeleted : false
            })
            if(!findFood) {
                return res.status(404).json({
                    message : 'food name is incorrect'
                })
            }
            const updateFood = await Food.updateOne(
                {id : id, addedBy: userId},
                {price : price, updatedAt : new Date().getTime()}
            )
            res.status(200).json({
                message : 'food updated',
                food : updateFood
            })
        } catch (error) {
            return res.status(500).json({
                message: 'server error ' + error
            })
        }
    },
    listAll : async (req,res) => {
        try {
            let listFood = await Food.find({
                isDeleted : false
            })
            .populate('category')
            if(!listFood[0]) {
                return res.status(404).json({
                    message: 'food is not added by admin'
                })
            }
            return res.status(200).json({
                data: listFood
            })
        } catch (error) {
            return res.status(500).json({
                message: 'server error ' + error
            })
        }
    },
    listOneFood: async (req,res) => {
        try {
            let {foodId} = req.body;
            console.log(foodId);
            let findFood = await Food.findOne({
                id: foodId,
                isDeleted: false
            })
            .populate('category')
            if(!findFood) {
                return res.status(404).json({
                    message: 'Food not found'
                })
            }
            return res.status(200).json({
                data : findFood
            })
        } catch (error) {
            return res.status(500).json({
                message: 'server error ' + error
            })
        }
    }

};
