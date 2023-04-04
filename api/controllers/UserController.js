/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    signUp : async (req,res)=> {
        const validate = sails.config.custom.validate
        const bcrypt = sails.config.custom.bcrypt
        const role = sails.config.common
        validate(req)
        const errors = await req.getValidationResult();
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }
        let { name, email, password, mobileNo, address } = req.body
        const id = sails.config.custom.uuid
        const pass = await bcrypt.hash(password, 10)

        if(mobileNo != null) {
            if(mobileNo.length == 10){
                console.log(isNaN(mobileNo));
                if(isNaN(mobileNo) == false){
                    console.log(mobileNo);
                } else {
                    return res.status(400).json({
                        message :'mobile no is invalid'
                    })
                }
            } else {
                return res.status(400).json({
                    message :'mobile no is invalid'
                })
            }
        }

        const data = {
            id : id(),
            name : name,
            email : email,
            password : pass,
            role : role.user,
            mobileNo : mobileNo,
            address : address
        }
        const findUser = await User.findOne({name : name, email : email})
        if(findUser){
            return res.status(409).json({
                msg : 'user already exist'
            })
        } else {
            const createUser = await User.create(data).fetch()
            return res.status(200).json({
                msg : 'user created',
                User : createUser
            })
        }
    },
    login : async (req,res)=> {
        const bcrypt = sails.config.custom.bcrypt
        const jwt = sails.config.custom.jwt
        const { email, password } = req.body
        const user = await User.findOne({ email : email })
        if(!user){
            return res.status(404).json({msg : 'email invalid'})
        }
        const pass = await  bcrypt.compare( password, user.password )
        if(!pass){
            return res.status(400).json({msg : 'password invalid'})
        }
        const token = jwt.sign(
            {
                email : user.email,
                userId : user.id,
                role : user.role
            },
            process.env.JWT_KEY,
            {
                expiresIn : "8h"
            }
        );
        const updateUser = await User.update({email : user.email}, { token : token })
        return res.status(200).json({
            message: 'Auth successful',
            token: token
        });
    },
    logout:async (req,res)=>{
        const user =req.userData.userId;
        let findUser = await User.findOne({id : user});
        if(findUser) {
            let Edit = await User.update({ id : findUser.id}, { token : ""}).fetch();
            if(Edit) {
                return res.status(200).json({
                    msg : 'user logout successfully'
                })
            } else {
                return res.status(500).json({
                    msg : 'Database error'
                })
            }
        }
    },
    list : async (req,res)=> {
        const { id } = req.body
        if( id == null ){
            const findCategory = await Category.find({isDeleted : false})
            return res.status(202).json({
                count : findCategory.length,
                categories : findCategory
            })
        }
        const findFoodCategory = await Food.find({ category : id, isDeleted : false}).omit(['isDeleted'])
        if(!findFoodCategory[0]) {
            const findFood = await Food.findOne({ id : id, isDeleted : false}).omit(['isDeleted','updatedAt'])
            if(!findFood){
                return res.status(404).json({
                    message : 'id is invalid'
                })
            }
            return res.status(200).json({
                food : findFood
            })
        }
        res.status(201).json({
            category : id,
            count : findFoodCategory.length,
            food : findFoodCategory
        })
    },
    listFood : async (req,res)=> {
        const { id } = req.body
        const listCategory = await Category.find({id : id,isDeleted : false }).populate('food', { where : { isDeleted : false}})
        if(!listCategory[0]){
            return res.status(404).json({
                message : 'category not found'
            })
        }
        res.status(200).json({
            category : id,
            count : listCategory[0].food.length,
            food : listCategory[0].food,
        })
    },

};
