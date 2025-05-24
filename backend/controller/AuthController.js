const UserModel = require("../models/user");

const signup = async(req,res)=>{
    try{
        const{name,email,password} = req.body;
        const user = await UserModel.findOne({email});
        if(user)
        {
            return res.status(409)
               .json({message:'User already exists, login instead',success:false});
        }
        const usermodel = new UserModel({name,email,password});
        usermodel.password = await bcrypt.hash(password,10);
        await usermodel.save();
        res.status(201)
            .json({message:"signup successful",
            success: true
        })
    }
    catch(err)
    {
        res.status(500)
           .json({
               message: "Internal server error",
               success: false
           })
    }
 
}

const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if user exists
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(401).json({
          message: "User not found. Please sign up.",
          success: false
        });
      }
  
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid email or password",
          success: false
        });
      }
  
      // Login successful
      res.status(200).json({
        message: "Login successful",
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Internal server error",
        success: false
      });
    }
  };
  

module.exports={
    signup,login
}