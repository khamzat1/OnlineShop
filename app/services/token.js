 import  jwt from "jsonwebtoken";

 const generateJWTToken = userId =>{
    const accesToken = jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:'30d'})

    return accesToken
 }


 export {generateJWTToken}