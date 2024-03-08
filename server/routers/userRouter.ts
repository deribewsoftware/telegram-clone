import {Request,Response,Router} from "express"
import { User } from "../models/userModel";
const userRouter=Router();
userRouter.post('/auth/',async(req:Request,res:Response) => {
  const user=new User(req.body)
  try{
    await user.save();
    res.send(user);

  }
  catch(err){
    console.log(err);
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