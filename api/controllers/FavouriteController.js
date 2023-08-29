/**
 * FavouriteController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @description add food to favourite list by user only
   * @route (POST /fav/add)
   */
  add: async (req, res) => {
    try {
        let id = sails.config.custom.uuid;
        const user = req.userData.userId;
        const { food } = req.body;
        console.log(food);
        const findFood = await Food.findOne({
          id: food,
          isDeleted: false
        });
        if (!findFood) {
          return res.status(404).json({
            message: "food not found",
          });
        }
        const data = {
          id: id(),
          user: user,
          foodName: food,
          price: findFood.price,
        };
        let findFavourite = await Favourite.findOne({
          foodName: food,
          isDeleted: false,
          user: user
        })
        if(findFavourite) {
            return res.status(409).json({
                message: 'food already added in favourite'
            })
        }
        const addFavourite = await Favourite.create(data).fetch();
        return res.status(200).json({
          message: "added food successfully",
          Food: addFavourite,
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
   * @description remove food to favourite list by user only
   * @route (DELETE /fav/delete)
   */
  delete: async (req, res) => {
    try {
        const user = req.userData.userId;
        const { food } = req.body;
        const findFood = await Favourite.findOne({
          foodName: food,
          isDeleted: false,
          user: user,
        });
        if (!findFood) {
          return res.status(404).json({
            message: "food not found",
          });
        }
        const deleteFavourite = await Favourite.updateOne(
          { foodName: food, user: user },
          { isDeleted: true }
        );
        return res.status(200).json({
          message: "deleted successfully",
          Food: deleteFavourite,
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
   * @description list all food which are added in favourite list
   * @route (GET /fav/list)
   */
  list: async (req, res) => {
    try {
        const user = req.userData.userId;
        const findFav = await Favourite.find({
          user: user,
          isDeleted: false,
        })
        .populate('user')
        .populate('foodName')

        return res.status(200).json({
          user: user,
          count: findFav.length,
          food: findFav,
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
   * @description search food by name in favourite list
   * @route (GET /fav/:name)
   */
  search: async (req, res) => {
    try {
        const user = req.userData.userId;
        let query =  `
          SELECT "f"."id",
          "f"."name",
          "f"."price",
          "fav"."id"
          FROM "favourite" AS "fav"
          LEFT JOIN "food" AS "f"
          ON "fav"."foodName" = "f"."id"
          WHERE lower("f"."name") LIKE '%' || lower('${req.param("name")}') || '%'
          AND "f"."isDeleted" = false
          AND "fav"."user" = '${user}'
        `
        const search = await sails.sendNativeQuery(query, [])
        // const findFood = await Favourite.find({
        //   foodName: {
        //     contains: req.param("name"),
        //   },
        //   isDeleted: false,
        //   user: user,
        // });
        // if (!findFood[0]) {
        //   return res.status(404).json({
        //     message: "not found",
        //   });
        // }
        return res.status(200).json({
          data: search,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'server error ' + error
        })
    }
  },
};
