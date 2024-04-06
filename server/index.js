require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { createPosts, readPosts, updatePost, deletePost } = require('../utils/pg')

const PORT = process.env.PORT || 3000
const app = express()

app.use(cors())
app.use(express.json())

app.get('/posts', (_, res) => {
  readPosts()
    .then((result) => res.status(result?.code ? 500 : 200).json(result))
    .catch((error) => res.status(500).json(error))
})

app.post('/posts', (req, res) => {
  createPosts(req.body)
    .then((result) => res.status(result?.code ? 500 : 200).json(result))
    .catch((error) => res.status(500).json(error))
})

app.put('/posts/like/:id', (req, res) => {
  updatePost(req.params.id)
    .then((result) => res.status(result?.code ? 500 : 200).json(result))
    .catch((error) => res.status(500).json(error))
})

app.delete('/posts/:id', (req, res) => {
  deletePost(req.params.id)
    .then((result) => res.status(result?.code ? 500 : 200).json(result))
    .catch((error) => res.status(500).json(error))
})

app.all('*', (_, res) => res.status(404).json({ code: 404, message: 'Resource not found' }))

app.listen(PORT, () => console.log(`Server UP in URL: http://localhost:${PORT}`))
