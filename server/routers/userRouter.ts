import {Request,Response,Router} from "express"
import { User } from "../models/userModel";
import "dotenv/config"
import jwt from "jsonwebtoken"
const userRouter=Router();
userRouter.post('/auth/',async(req:Request,res:Response) => {
  const user=new User(req.body)
  try {
    await user.save();
    const accessToken = jwt.sign(
      user.toObject(),
      process.env.ACCESS_TOKEN_SECRET!
    );
    res.setHeader("Set-Cookie", `user=${accessToken}; Path=/`);
    res.send("user created");
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

userRouter.get("/users",async(req:Request, res:Response)=>{
  try{
    const users=await User.find({})
    res.send(users);
  }
  catch(err){}

})

export default userRouter;