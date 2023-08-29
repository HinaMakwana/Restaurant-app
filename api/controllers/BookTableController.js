/**
 * BookTableController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  book: async (req, res) => {
    try {
      const id = sails.config.custom.uuid;
      const {userId,email} = req.userData;
      let { date, guestNo, timeSlot } = req.body;
      let result = await BookTable.validate({ userId , guestNo})
      if(result.hasError) {
        return res.status(400).json({
          message: 'validation error',
          error: result.error
        })
      }
      const newDate = await BookTable.checkDate(date);
      const newTimeSlot = await BookTable.checkTime(timeSlot, date);
      if (newDate.msg == "done") {
        if (newTimeSlot == true) {
            console.log("ok");
        } else {
            return res.status(402).json({
                error: newTimeSlot,
            });
        }
      } else {
        return res.status(403).json({
          message: "check your Date",
          error: newDate.msg,
        });
      }
      if (isNaN(guestNo) == false && guestNo > 0) {
        guestNo = parseInt(guestNo);
      } else {
        return res.status(400).json({
          message: "enter positive number only",
        });
      }
      const data = {
        id: id(),
        user: userId,
        date: date,
        guestNo: guestNo,
        timeSlot: timeSlot,
        email: email,
      };
      const bookTable = await BookTable.create(data).fetch();
      res.status(200).json({
        message: " book table successfully",
        Table: bookTable,
      });
    } catch (error) {
      return res.status(500).json({
        message: "server error " + error,
      });
    }
  },
  cancel: async (req, res) => {
    try {
      const user = req.userData.userId;
      const { id } = req.body;
      const findUser = await BookTable.findOne({
        user: user,
        id: id,
        orderStatus: "pending",
        isDeleted: false
      });
      if (!findUser) {
        return res.status(404).json({
          message: "table booking details not found",
        });
      }
      const cancelTable = await BookTable.updateOne(
        { id: id },
        { orderStatus: "cancel" }
      );
      res.status(200).json({
        message: "table cancel",
        Table: cancelTable,
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
      const listTable = await BookTable.find({
        user: user,
        isDeleted: false
      }).omit([
        "email",
        "user",
      ]);
      if (!listTable) {
        return res.status(404).json({
          message: "user not found",
        });
      }
      res.status(200).json({
        count: listTable.length,
        BookedTable: listTable,
      });
    } catch (error) {
      return res.status(500).json({
        message: "server error " + error,
      });
    }
  },
  listOne: async (req, res) => {
    try {
      const user = req.userData.userId;
      const { id } = req.body;
      const listTable = await BookTable.find({
        user: user,
        id: id,
        isDeleted: false
      }).omit(["email", "user"]);
      if (!listTable) {
        return res.status(404).json({
          message: "user not found",
        });
      }
      res.status(200).json({
        BookedTable: listTable,
      });
    } catch (error) {
      return res.status(500).json({
        message: "server error " + error,
      });
    }
  },
  confirm: async (req, res) => {
    try {
      const { id, status } = req.body;
      const findTable = await BookTable.findOne({ id: id, isDeleted: false });
      if (findTable.orderStatus == "confirm") {
        return res.json({
          message: "table is already confirmed",
        });
      }
      const updateTable = await BookTable.updateOne(
        { id: id },
        { orderStatus: status }
      );
      return res.status(200).json({
        message: "table confirmed",
        Table: updateTable,
      });
    } catch (error) {
      return res.status(500).json({
        message: "server error " + error,
      });
    }
  },
};
