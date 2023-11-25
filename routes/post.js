const router = require("express").Router();
const Post = require("../models/Post");
// Create a post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);

  try {
    const savedpost = await newPost.save();
    res.status(200).json(savedpost);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update post

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
        await post.updateOne({$set:req.body})
        res.status(200).json('Post Uopdated')
    } else {
      res.status(403).json("You can update only your post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete Post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (post.userId === req.body.userId) {
        await post.deleteOne()
        res.status(200).json("Post Deleted")
    } else {
      res.status(403).json("You can delete only your post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});



module.exports = router;
