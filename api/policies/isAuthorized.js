const jwt = require('jsonwebtoken')

module.exports = async (req,res,next)=> {
    try {
        const token = req.headers.authorization.split( " " )[1];
        const findToken = await User.findOne({token : token})
        const decoded = await jwt.verify(token, process.env.JWT_KEY)
        if(token == findToken.token) {
            req.userData = decoded
            return next()
        } else {
            res.status(401).json({
                message: 'Token invalid'
            });
        }
    } catch(error) {
        return res.status(401).json({
            message: 'Auth failed',
            error : error
        });
    }
}