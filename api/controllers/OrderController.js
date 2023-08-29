/**
 * OrderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  add: async (req, res) => {
    try {
      const id = sails.config.custom.uuid;
      const user = req.userData.userId;
      let { address } = req.body;
      const findUser = await User.findOne({
        id: user,
        isDeleted: false
      });
      const finalTotalAmount = await Cart.sum("totalAmount", {
        where: {
          user: user,
          isDeleted: false,
        },
      });
      const findCartUser = await Cart.find({
        user: user,
        isDeleted: false,
      }).omit(["isDeleted", "user"]);
      if (!findCartUser || findCartUser[0] == null) {
        return res.status(404).json({
          message: "you cannot order, first add food in cart",
        });
      }
      if (address == null) {
        address = findUser.address;
      }
      const data = {
        id: id(),
        user: user,
        totalAmount: finalTotalAmount,
        address: address,
      };
      const createOrder = await Order.create(data).fetch();
      await Cart.update({ user: user, isDeleted: false }, { isDeleted: true });
      return res.status(200).json({
        message: "Your order",
        Order: createOrder,
        Food: findCartUser,
      });
    } catch (error) {
      return res.status(500).json({
        message: "server error " + error,
      });
    }
  },
  delete: async (req, res) => {
    try {
      const user = req.userData.userId;
      const findOrder = await Order.find({
        user: user,
        isDeleted: false
      });
      const { id } = req.body;
      if (!findOrder) {
        return res.status(404).json({
          message: "invalid user",
        });
      }
      const deleteOrder = await Order.updateOne(
        { id: id },
        { isDeleted: true }
      );
      return res.status(200).json({
        message: "order cancel",
        order: deleteOrder,
      });
    } catch (error) {
      return res.status(500).json({
        message: "server error " + error,
      });
    }
  },
  list: async (req, res) => {
    try {
      const user = req.userData.userId;
      const findRecord = await Order.find({
        user: user,
        isDeleted: false,
      });
      if (!findRecord) {
        return res.status(404).json({
          message: "user not found",
        });
      }
      res.status(200).json({
        count: findRecord.length,
        user: user,
        Order: findRecord,
      });
    } catch (error) {
      return res.status(500).json({
        message: "server error " + error,
      });
    }
  },
};
