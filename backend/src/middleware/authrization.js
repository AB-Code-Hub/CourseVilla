const jwt = require("jsonwebtoken")

exports.authrization = async (req, res, next) => {
    try {
        
        const authHeader = req.headers['authorization']
        const token = authHeader &&  authHeader.split(' ')[1];
        if(!token){
            return res.status(401).json({message: "No token provieded"})
        }

        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET,) 
        
        if(!verifiedToken){
            return res.status(403).json({message: "Invalid token"})
        }
            console.log(verifiedToken);
        req.userId = verifiedToken.userId
        console.log(verifiedToken.userId);

        next()
    } catch (error) {
        res.status(401).json({message: error.message})
        console.error("error in authrization middleware", error);
        
    }
}