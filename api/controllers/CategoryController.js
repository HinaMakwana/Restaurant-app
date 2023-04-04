/**
 * CategoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    add : async (req,res)=> {
        const validate = sails.config.custom.validate
        validate(req)
        const errors = await req.getValidationResult();
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }
        const admin = req.userData
        const id = sails.config.custom.uuid
        const { name } = req.body
            const addCategory = await Category.findOrCreate({name : name, isDeleted : false},{ id : id(), name : name})
            return res.status(200).json({
                message : 'category created',
                category : addCategory
            })
    },
    delete : async (req,res)=> {
        const admin = req.userData
        const { name } = req.body
            const findCategory = await Category.findOne({ name : name , isDeleted: false})
            if(!findCategory) {
                return res.status(404).json({
                    message : 'Category not found'
                })
            }
            const findFoodCategory = await Food.find({category : findCategory.id})
            if(findFoodCategory[0]){
                return res.status(500).json({
                    message : 'you can not delete category'
                })
            }
            const deleteCategory = await Category.updateOne({ name : name }, { isDeleted : true })
            res.status(200).json({
                message : 'category deleted successfully',
                category : deleteCategory
            })
    }

};
