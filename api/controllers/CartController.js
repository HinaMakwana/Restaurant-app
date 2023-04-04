/**
 * CartController
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
    const { food } = req.body
      const findUser = await User.findOne({ id : user.userId })
          if(!findUser){
              return res.status(404).json({
                  message : 'user not found'
              })
          }
          const findFood = await Food.findOne({ name : food, isDeleted : false})
          if(!findFood) {
              return res.status(400).json({
                  message : 'food not found'
              })
          }
          let data = {
            id : id(),
            user : user.userId,
            food : food,
            price : findFood.price,
            totalAmount : findFood.price
          }
        const findCart = await Cart.findOne({user : user.userId, food : food, isDeleted : false})
        if(findCart) {
            return res.status(409).json({
              message : 'already added in cart'
            })
        }
        const addtoCart = await Cart.create(data).fetch()
        res.status(200).json({
          message : 'food is added in cart',
          Cart : addtoCart
        })
  },
  list : async (req,res)=> {
    const user = req.userData
      const findCart = await Cart.find({user : user.userId, isDeleted : false})
      const total = await Cart.sum('totalAmount', { where : {user : user.userId, isDeleted : false}})
    return res.status(200).json({
      total : total,
      count : findCart.length,
      cart : findCart
    })
  },
  update : async (req,res)=> {
    const user = req.userData
    const { food, quantity } = req.body
      const findCart = await Cart.findOne({ food : food , user : user.userId , isDeleted : false})
      if(!findCart){
        return res.status(404).json({
          message : 'food in not found'
        })
      }
      let quantity1;
      if(isNaN(quantity) == false && quantity > 0){
          quantity1 = parseInt(quantity)
      } else {
          return res.status(400).json({
              message :'enter positive number only'
          })
      }
      const totalAmount = quantity1 * (findCart.price)
      const updateCart = await Cart.update({ food : food}, { quantity : quantity1, totalAmount : totalAmount}).fetch()
      return res.status(200).json({
        message : 'Cart updated',
        Cart : updateCart
      });
  },
  delete : async (req,res)=> {
    const user = req.userData
    const { food } = req.body
      const findCart = await Cart.findOne({ food : food, isDeleted : false, user : user.userId})
      if(!findCart){
        return res.status(404).json({
          message : 'food is not found'
        })
      }
      const deleteCart = await Cart.updateOne({ food : food, user : user.userId} , { isDeleted : true})
      return res.status(200).json({
        message : 'Cart deleted',
        Cart : deleteCart
      })
  }

};
