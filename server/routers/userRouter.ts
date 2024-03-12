import {Request,Response,Router} from "express"
import { User } from "../models/userModel";
import "dotenv/config"
import jwt, { JwtPayload } from "jsonwebtoken"
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


userRouter.get("/user", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send("Authorization header is missing");
    }

    const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload; // Explicit cast to JwtPayload
    const user = await User.find({ email: data?.email });
    res.send(user);
  } catch (err) {
    console.error(err); // Log the error
    res.status(500).send(err);
  }
});


userRouter.get("/messages", async (req:Request, res:Response) => {
  const { sender, reciver } = req.query;
  const user = await User.find({ email: reciver });
  const filteredUser = user[0]?.messages?.filter((message: any) => message.sender === sender && message.reciver === reciver || message.sender === reciver && message.reciver === sender);
  res.send(filteredUser);
})

export default userRouter;