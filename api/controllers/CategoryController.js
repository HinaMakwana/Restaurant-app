/**
 * CategoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {

    /**
     *
     * @param {Request} req
     * @param {Response} res
     * @returns Category
     * @description Create category only by admin
     * @route (POST /category/add)
     */
    add : async (req,res)=> {
        try {
            const {userId} = req.userData;
            const id = sails.config.custom.uuid;
            const { name } = req.body;
            let result = await Category.validate({name,userId});
            if(result.hasError) {
                return res.status(400).json({
                    message: 'validation error',
                    error: result.error
                })
            }
            let findCategory = await Category.findOne({name:name, isDeleted: false})
            if(findCategory) {
                return res.status(409).status({
                    message: 'category name already exist'
                })
            }
            let createCategory = await Category.create({
                id: id(),
                name: name,
                addedBy: userId
            }).fetch();
            return res.status(200).json({
                message : 'category created',
                category : createCategory
            })
        } catch (error) {
            return res.status(500).json({
                message: 'server error ' + error
            })
        }
    },
    /**
     *
     * @param {Request} req
     * @param {Response} res
     * @returns String that isDeleted or not
     * @description Delete category only by admin
     * @route (DELETE /category/delete)
     */
    delete : async (req,res)=> {
        try {
            const {userId} = req.userData;
            const { name } = req.body;
            const findCategory = await Category.findOne({
                name : name ,
                isDeleted: false
            });
            if(!findCategory) {
                return res.status(404).json({
                    message : 'Category not found'
                })
            }
            const findFoodCategory = await Food.find({category : findCategory.id});
            if(findFoodCategory[0]){
                return res.status(500).json({
                    message : 'you can not delete category'
                })
            }
            const deleteCategory = await Category.updateOne(
                { name : name, addedBy: userId },
                { isDeleted : true }
            )
            if(!deleteCategory) {
                return res.status(401).json({
                    message: 'you cannot delete category'
                })
            }
            return res.status(200).json({
                message : 'category deleted successfully',
                category : deleteCategory
            })
        } catch (error) {
            return res.status(500).json({
                message: 'server error ' + error
            })
        }
    },
    /**
     *
     * @param {Request} req
     * @param {Response} res
     * @returns All categories
     * @description List all categories
     * @route (GET /listAll)
     */
    listAll : async (req,res) => {
        try {
            let categories = await Category.find({isDeleted: false})
            .populate('food')
            if(!categories[0]) {
                return res.status(404).json({
                    message: 'category not added by admin'
                })
            }
            return res.status(200).json({
                categories: categories
            })
        } catch (error) {
            return res.status(500).json({
                message: 'server error ' + error
            })
        }
    },
    /**
     *
     * @param {Request} req
     * @param {Response} res
     * @returns Update category
     * @description update category by admin only
     * @route (PATCH /update/:id)
     */
    update : async (req,res) => {
        try {
            let { userId } = req.userData;
            let categoryId = req.params.id;
            let { newName } = req.body;
            let findCategory = await Category.findOne({
                id: categoryId,
                isDeleted: false
            })
            if(!findCategory) {
                return res.status(404).json({
                    message: 'Category not found'
                })
            }
            let findName = await Category.findOne({
                name: newName
            })
            if(findName) {
                return res.status(409).json({
                    message: 'category already exist'
                })
            }
            let updateCategory = await Category.updateOne({
                id: categoryId,
                isDeleted: false,
                addedBy: userId
            },{
                name: newName
            })
            return res.status(200).json({
                category: updateCategory
            })
        } catch (error) {
            return res.status(500).json({
                message: 'server error ' + error
            })
        }
    },
    /**
     *
     * @param {Request} req
     * @param {Response} res
     * @returns Data of signle category
     * @description get one category
     * @route (GET /:id)
     */
    getOneCategory : async (req,res) => {
        try {
            let categoryId = req.params.id;
            let findCategory = await Category.findOne({
                id: categoryId,
                isDeleted: false
            })
            .populate('food')
            .populate('addedBy')
            if(!findCategory) {
                return res.status(404).json({
                    message: 'category not found'
                })
            }
            findCategory.addedBy = _.omit(
                findCategory.addedBy,
                "token",
                "password",
                "isDeleted"
            )
            return res.status(200).json({
                category : findCategory
            })
        } catch (error) {
            return res.status(500).json({
                message: 'server error ' + error
            })
        }
    }

};
