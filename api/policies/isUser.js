const jwt = require('jsonwebtoken')

module.exports = async (req,res,next)=> {
    try {
        const token = req.headers.authorization.split( " " )[1];
        const findToken = await User.findOne({token : token})
        const decoded = await jwt.verify(token, process.env.JWT_KEY)
        if(decoded.role == 'user') {
            return next()
        }else {
            return res.status(403).json({
                message : 'only for user'
            })
        }
    } catch(error) {
        return res.status(401).json({
            message: 'Auth failed',
            error : error
        });
    }
}