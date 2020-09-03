const router = require("express").Router();

const Posts = require("../data/db.js");

// GET returns array of posts

router.get("/", (req, res) => {
    Posts.find()
      .then(allPosts => {
        return res.status(200).json(allPosts);
      })
      .catch(error => {
        console.log(error);
        return res
          .status(500)
          .json({ error: "The posts information could not be retrieved." });
      });
  });
  
  // GET by id 
  
  router.get("/:id", (req, res) => {
    const postId = req.params.id;
  
    Posts.findById(postId)
      .then(post => {
        if (post.length === 0) {
          return res
            .status(404)
            .json({ message: "The post with the specified ID does not exist." });
        } else {
          return res.status(200).json(post);
        }
      })
      .catch(error => {
        console.log(error);
        return res.status(500).json({
          error: "The post information could not be retrieved."
        });
      });
  });
  
  // GET by comments 
  
  router.get("/:id/comments", (req, res) => {
    const postId = req.params.id;
    
  
    Posts.findPostComments(postId)
      .then(comments => {
        if (comments.length === 0) {
          return res
            .status(404)
            .json({ message: "The post with the specified ID does not exist." });
        } else {
          return res.status(200).json(comments);
        }
      })
      .catch(error => {
        console.log(error);
        return res
          .status(500)
          .json({ error: "The comments information could not be retrieved." });
      });
  });
  
  // POST creates a post 
  
  router.post("/", (req, res) => {
    const { title, contents } = req.body;
  
    Posts.insert(req.body)
      .then(post => {
        if (!title || !contents) {
          return res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
          });
        } else {
          return res.status(201).json(post);
        }
      })
      .catch(error => {
        console.log(error);
        return res.status(500).json({
          error: "There was an error while saving the post to the database"
        });
      });
  });
  
  // POST creates a comment for the post, with post id and using req.body 
  //TESTTTESTTESTETST
  router.post("/:id/comments", (req, res) => {
    const { text, post_id } = req.body;
  
    Posts.insertComment(req.body)
      .then(newComment => {
        if (!post_id) {
          return res
            .status(404)
            .json({ message: "The post with the specified ID does not exist." });
        } else if (!text) {
          return res
            .status(400)
            .json({ errorMessage: "Please provide text for the comment." });
        } else {
          return res.status(201).json(newComment);
        }
      })
      .catch(error => {
        console.log(error);
        return res.status(500).json({
          error: "There was an error while saving the comment to the database"
        });
      });
  });
  
  // DELETE removes a post, returns deleted post object 
  
  router.delete("/:id", (req, res) => {
    const deleteId = req.params.id;
  
    Posts.findById(deleteId)
  
      .then(deleted => {
        if (deleted.length === 0) {
          return res.status(404).json({
            message: "The post with the specified ID does not exist."
          });
        } else {
          Posts.remove(deleteId).then(res.status(200).json(deleted));
        }
      })
      .catch(error => {
        console.log(error);
        return res.status(500).json({
          error: "The post could not be removed"
        });
      });
  });
  // PUT updates a post with id using req.body
  
  router.put("/:id", (req, res) => {
    const updateId = req.params.id;
    const { title, contents } = req.body;
  
    Posts.update(updateId, req.body)
      .then(updated => {
        if (!title) {
          return res.status(400).json({
            errorMessage: "please provide a title for the post"
          });
        }
        if (!contents) {
          return res.status(400).json({
            errorMessage: "please provide content for the post"
          });
        }
        if (!updateId) {
          return res.status(404).json({
            errorMessage: "the post with the specified Id does not exist"
          });
        } else {
          Posts.findById(updateId).then(post => res.status(200).json(post));
        }
      })
      .catch(error => {
        console.log(error);
        return res
          .status(500)
          .json({ error: "The post information could not be modified." });
      });
   
  });

module.exports = router;