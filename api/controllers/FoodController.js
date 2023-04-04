/**
 * FoodController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    add: async (req,res)=> {
        const validate = sails.config.custom.validate
        const id = sails.config.custom.uuid
        validate(req)
        const errors = await req.getValidationResult();
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }
        const { name, category, price } = req.body
        let data = {
            id : id(),
            name : name,
            category : category,
            price : price
        }
            const findCategory = await Category.findOne({id : category, isDeleted : false})
            if(!findCategory) {
                return res.status(404).json({
                    message : 'category not found'
                })
            }
            const addFood = await Food.findOrCreate({name : name, isDeleted : false}, data)
            res.status(200).json({
                message : 'Food created',
                Food : addFood
            })

    },
    delete : async (req,res)=> {
        const { name } = req.body
        const admin = req.userData
            const findFood = await Food.findOne({ name : name , isDeleted : false})
            if(!findFood) {
                return res.status(404).json({
                    message : 'food not found'
                })
            }
            const deleteFood = await Food.updateOne({ name : name}, {isDeleted : true})
            const deleteCart = await Cart.updateOne({ food : name}, { isDeleted : true })
            const deleteMyfav = await Favourite.updateOne({ foodName : name }, { isDeleted : true })
            res.status(200).json({
                message : 'food deleted',
                food : deleteFood
            })
    },
    update : async (req,res)=> {
        const { name, price }  = req.body
            const findFood = await Food.findOne({ name : name, isDeleted : false })
            if(!findFood) {
                return res.status(404).json({
                    message : 'food name is incorrect'
                })
            }
            const updateFood = await Food.updateOne({name : name}, {price : price, updatedAt : new Date().getTime()})
            res.status(200).json({
                message : 'food updated',
                food : updateFood
            })
    },

};
