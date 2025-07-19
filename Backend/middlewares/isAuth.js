import jwt from "jsonwebtoken"

const isAuth=async(req,res,next) =>{
    try {
        const token=req.cookies.token
        if(!token)
        {
            return res.status(400).json({message:"token not found"})
        }
     const verifytoken=await jwt.verify(token,process.env.JWT_SECRET )
         req.userId=verifytoken.userId
         next()
    } catch (error) {
console.log(error)
        return res.status(500).json({message:"is auth error"})
    }
}
export default isAuth