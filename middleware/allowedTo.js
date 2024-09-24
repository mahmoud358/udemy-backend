module.exports =(...roles)=>{
    // console.log("roles",roles);
    return(req,res,next)=>{
    
console.log(req.role);


        if(!roles.includes(req.role)){
            return next(res.json({status:"fail",message :"You are not authorized "}))
        }
        next();
    }
}