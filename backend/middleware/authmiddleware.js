const JWT = require("jsonwebtoken")

const requireSignIn = async (req,res,next) => {
    try {    
        if (!req.headers.authorization){
            return res.status(400).send({
                success: false,
                message: "User not logged in!!!"
            })
        }
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET_KEY);
        req.user=decode.data;
        next();
    } catch (error) {
        console.log("Error in requireSignIn middleware. Error: ",error);
    }
}

module.exports = requireSignIn;