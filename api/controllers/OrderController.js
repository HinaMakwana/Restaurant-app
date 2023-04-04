/**
 * OrderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    add : async (req,res)=> {
        const validate = sails.config.custom.validate
        const id = sails.config.custom.uuid
        validate(req)
        const errors = await req.getValidationResult();
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }
        const user = req.userData
        console.log(user);
        let { address } = req.body
            const findUser = await User.findOne({ id : user.userId })
            const finalTotalAmount = await Cart.sum('totalAmount',{ where : {user : user.userId, isDeleted : false}})
            const findCartUser = await Cart.find({ user : user.userId , isDeleted : false }).omit(['isDeleted','user'])
            if(!findCartUser || findCartUser[0] == null){
                return res.status(404).json({
                    message : 'you cannot order, first add food in cart'
                })
            }
            if(address == null){
                address = findUser.address
            }
            const data = {
                id : id(),
                user : user.userId,
                totalAmount : finalTotalAmount,
                address : address
            }
            const createOrder = await Order.create(data).fetch()
            const updateCart = await Cart.update({ user : user.userId , isDeleted : false },{ isDeleted : true })
            return res.status(200).json({
                message : 'Your order',
                Order : createOrder,
                Food : findCartUser
            })
    },
    delete : async (req,res)=> {
        const user = req.userData
            const findOrder = await Order.find({ user : user.userId})
            const { id } = req.body
            if(!findOrder){
                return res.status(404).json({
                    message : 'invalid user'
                })
            }
            const deleteOrder = await Order.updateOne({id : id}, { isDeleted : true})
            return res.status(200).json({
                message : 'order cancel',
                order : deleteOrder
            })
    },
    list : async (req,res)=> {
        const user = req.userData
            const findRecord = await Order.find({user : user.userId, isDeleted : false})
            if(!findRecord) {
                return res.status(404).json({
                    message : 'user not found'
                })
            }
            res.status(200).json({
                count : findRecord.length,
                user : user.userId,
                Order : findRecord
            })
    }


};
