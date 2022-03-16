const { Comment } = require("../models")
const createComment = require("../services/comments/createComment.service")
const findPostComments = require("../services/comments/findPostComments.service")
const commentSchema = require("../validators/comment.validate")

const options = {
  errors: {
    wrap: {
      label: "",
    },
  },
}

module.exports = {
  create: async (req, res) => {
    const { description, productId } = req.body
    // Validate comment input
    const { error } = commentSchema.validate(
      { description: req.body.description },
      options
    )
    if (error) return res.status(400).send({ error: error.details[0].message })
    if (!productId)
      return res.status(400).send({ error: "product id is missing" })

    // Create comment
    const result = await createComment(description, productId, req.userID)
    if (result?.err) {
      return res
        .status(422)
        .send({ error: "failed to create comment", message: result.err })
    }
    return res.status(201).send(result.comment)
  },

  findProductComments: async (req, res) => {
    if (!req.params.id)
      return res.status(400).send({ error: "product id is missing" })

    const result = await findPostComments(req.params.id, req.userID)
    if (result?.err) {
      return res.status(422).send({
        error: "failed to get this post comments",
        message: result.err,
      })
    }
    return res.status(200).send(result.comments)
  },

  update: (req, res) => {
    const { description, id } = req.body
    // Validate comment input
    const { error } = commentSchema.validate(
      { description: req.body.description },
      options
    )
    if (error) return res.status(400).send({ error: error.details[0].message })
    if (!id) return res.status(400).send({ error: "id is missing" })

    // Update comment
    Comment.update(
      { description },
      { where: { id: parseInt(id), uid: req.userID } }
    )
      .then((comment) => {
        if (comment[0] > 0)
          return res.status(200).send({ success: "Updated successfully" })
        throw "wrong comment id"
      })
      .catch((err) =>
        res
          .status(422)
          .send({ error: "failed to update comment", message: err })
      )
  },

  delete: (req, res) => {
    if (!req.params.id) return res.status(400).send({ error: "id is missing" })
    // Destroy comment
    Comment.destroy({ where: { id: parseInt(req.params.id), uid: req.userID } })
      .then((comment) => {
        if (comment > 0)
          return res.status(200).send({ success: "Deleted successfully" })
        throw "wrong comment id"
      })
      .catch((err) =>
        res
          .status(422)
          .send({ error: "failed to delete comment", message: err })
      )
  },
}
