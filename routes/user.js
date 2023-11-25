const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Update User
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.salt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).json(error);
      }
    }

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });

      res.status(200).json("Account has been updated");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res
      .status(403)
      .send({ message: "You can only update your profile" });
  }
});

// delete User
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete({_id : req.params.id});
      res.status(200).json("Acount has been deleted");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res
      .status(403)
      .send({ message: "You can only delete your profile" });
  }
});

// Get user 
router.get("/:id", async(req, res)=>{
    try {
        const user = await User.findOne({_id:req.params.id})

        const {isAdmin, createdAt, updatedAt, password, ...others} = user._doc
        res.status(200).json(others)
    } catch (error) {
        res.status(500).json("No record found with this id")
    }
})

// Follow user
router.put("/:id/follow", async(req, res)=>{
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push : {followers : req.body.userId}})
                await currentUser.updateOne({$push : {following : req.params.id}})

                res.status(200).json("Successfully Followed")
            }else{
                res.status(403).json('You already followed this user')
            }
        } catch (error) {
            
        }
    }else{
        res.status(403).json("You can not follow yourself")
    }
})

// Unfollow user
router.put("/:id/unfollow", async(req, res)=>{
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull : {followers : req.body.userId}})
                await currentUser.updateOne({$pull : {following : req.params.id}})

                res.status(200).json("Successfully Unfollowed")
            }else{
                res.status(403).json('You dont follow this user')
            }
        } catch (error) {
            
        }
    }else{
        res.status(403).json("You can not unfollow yourself")
    }
})
module.exports = router;
