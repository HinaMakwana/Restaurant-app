/**
 * CartController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @description Add Food to cart
   * @route (POST /cart/add)
   */
  add: async (req, res) => {
    try {
      const id = sails.config.custom.uuid;
      const user = req.userData.userId;
      let { food, quantity } = req.body;
      let result = await Cart.validate({ food, user, quantity })
      if(result.hasError) {
        return res.status(400).json({
          message: 'validation error',
          error: result.error
        })
      }
      const findUser = await User.findOne({
        id: user,
        isDeleted: false
      });
      if (!findUser) {
        return res.status(404).json({
          message: "user not found",
        });
      }
      const findFood = await Food.findOne({
        id: food,
        isDeleted: false
      });
      if (!findFood) {
        return res.status(400).json({
          message: "food not found",
        });
      }

      if (isNaN(quantity) === false && quantity > 0) {
        quantity = parseInt(quantity);
      } else {
        if(!quantity) {
          quantity = 1;
        } else {
            return res.status(400).json({
              message: "enter positive number only",
            });
        }
      }
      let data = {
        id: id(),
        user: user,
        food: food,
        price: findFood.price,
        totalAmount: (findFood.price) * quantity,
        quantity: quantity
      };
      const findCart = await Cart.findOne({
        user: user,
        food: food,
        isDeleted: false,
      });
      if (findCart) {
        return res.status(409).json({
          message: "already added in cart",
        });
      }
      const addtoCart = await Cart.create(data).fetch();
      res.status(200).json({
        message: "food is added in cart",
        Cart: addtoCart,
      });
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
   * @description list all food which is added in cart
   * @route (GET /cart/list)
   */
  list: async (req, res) => {
    try {
      const user = req.userData.userId;
      const findCart = await Cart.find({
        user: user,
        isDeleted: false
      })
      .populate('food');
      const total = await Cart.sum("totalAmount", {
        where: {
          user: user,
          isDeleted: false
        },
      });
      return res.status(200).json({
        total: total,
        count: findCart.length,
        cart: findCart,
      });
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
   * @description update cart only by user which is added food in cart
   * @route (PATCH /cart/update)
   */
  update: async (req, res) => {
    try {
      const {userId} = req.userData;
      const { food, quantity } = req.body;
      const findCart = await Cart.findOne({
        food: food,
        user: userId,
        isDeleted: false,
      });
      if (!findCart) {
        return res.status(404).json({
          message: "food is not found",
        });
      }
      let quantity1;
      if (isNaN(quantity) === false && quantity > 0) {
        quantity1 = parseInt(quantity);
      } else {
        return res.status(400).json({
          message: "enter positive number only",
        });
      }
      const totalAmount = quantity1 * (findCart.price);
      const updateCart = await Cart.update(
        { food: food, user: userId },
        { quantity: quantity1, totalAmount: totalAmount }
      ).fetch();
      return res.status(200).json({
        message: "Cart updated",
        Cart: updateCart,
      });
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
   * @description delete cart only by user which is added food in cart
   * @route (DELETE /cart/delete)
   */
  delete: async (req, res) => {
    try {
      const user = req.userData.userId;
      const { food } = req.body;
      const findCart = await Cart.findOne({
        food: food,
        isDeleted: false,
        user: user,
      });
      if (!findCart) {
        return res.status(404).json({
          message: "food is not found",
        });
      }
      const deleteCart = await Cart.updateOne(
        { food: food, user: user.userId },
        { isDeleted: true }
      );
      return res.status(200).json({
        message: "Cart deleted",
        Cart: deleteCart,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'server error ' + error
      })
    }
  },
};
