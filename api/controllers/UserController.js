/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
let bcrypt = sails.config.custom.bcrypt;

module.exports = {

    /**
     *
     * @param {Request} req
     * @param {Response} res
     * @description registration for user
     * @route (POST /user/signup)
     */
    signUp : async (req,res)=> {
        try {
            let {
                name,
                email,
                password,
                confirmPassword,
                mobileNo,
                address
            } = req.body;

            let result = await User.validate({
                name,
                email,
                password,
                confirmPassword,
                mobileNo,
                address
            })
            if(result.hasError) {
                return res.status(400).json({
                    message: 'validation error',
                    error: result.error
                })
            }
            const id = sails.config.custom.uuid;
            const pass = await bcrypt.hash(password, 10);

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

            if(password !== confirmPassword) {
                return res.status(400).json({
                    message: 'Password and confirm password not match'
                })
            }

            const data = {
                id : id(),
                name : name,
                email : email,
                password : pass,
                mobileNo : mobileNo,
                address : address
            }
            const findUser = await User.findOne({
                email : email,
                isDeleted: false
            });
            if(findUser){
                return res.status(409).json({
                    message : 'user already exist'
                })
            } else {
                const createUser = await User.create(data).fetch()
                return res.status(200).json({
                    message : 'user created',
                    User : createUser
                })
            }
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
     * @description Login for user return authToken
     * @route (POST /user/login)
     */
    login : async (req,res)=> {
        try {
            const jwt = sails.config.custom.jwt;
            const { email, password } = req.body;
            let result = await User.validate({
                email,
                password,
            })
            if(result.hasError) {
                return res.status(400).json({
                    message: 'validation error',
                    error: result.error
                })
            }
            const user = await User.findOne({ email : email, isDeleted: false })
            if(!user){
                return res.status(404).json({
                    message : 'email invalid'
                })
            }
            const pass = await  bcrypt.compare( password, user.password )
            if(!pass){
                return res.status(400).json({
                    message : 'password invalid'
                })
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
            await User.updateOne({email : user.email}, { token : token })
            return res.status(200).json({
                message: 'Auth successful',
                token: token
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
     * @description Logout user update token null
     * @route (POST /user/logout)
     */
    logout:async (req,res)=>{
        try {
            const user =req.userData.userId;
            let findUser = await User.findOne({id : user, isDeleted: false});
            if(findUser) {
                let Edit = await User.updateOne({ id : findUser.id}, { token : ""});
                if(Edit) {
                    return res.status(200).json({
                        message : 'user logout successfully'
                    })
                } else {
                    return res.status(500).json({
                        message : 'Database error'
                    })
                }
            }
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
     * @description List all users
     * @route (GET /user/list)
     */
    list : async (req,res)=> {
        try {
            let findAllUsers = await User.find({
                isDeleted: false,
                role: 'user'
            })
            .omit(["token","password","isDeleted"])
            return res.status(200).json({
                users: findAllUsers
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
     * @description get user profile
     * @route (GET /listOne)
     */
    profile : async (req,res)=> {
        try {
            let { userId } = req.userData;
            let findUser = await User.findOne({
                id: userId,
                isDeleted: false
            })
            findUser = _.omit(
                findUser,
                "token",
                "password",
                "isDeleted"
            )
            if(!findUser) {
                return res.status(404).json({
                    message: 'user not found'
                })
            }
            return res.status(200).json({
                user: findUser
            })
        } catch (error) {
            return res.status(500).json({
                message: 'server error ' + error
            })
        }
    },

};
