const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await new User({
      username: username,
      email: email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error)
  }
});

//login
router.post("/login", async(req, res)=>{
    const {email, password} = req.body
    try {
        const user = await User.findOne({email : email})
        !user && res.status(404).send({message : "User not found"})

        const validPassword = await bcrypt.compare(password, user.password)
        !validPassword && res.status(404).send({message : 'Wrong Password'})

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;
