require('dotenv').config()// NECESITO INSTALAR ESTO 
const { v4: uuidv4 } = require('uuid')
const { Pool } = require('pg')

const config = {
  // user: process.env.PG_USER,
  // password: process.env.PG_PASSWORD,
  // host: process.env.PG_HOST,
  // port: process.env.PG_PORT,
  connectionString: process.env.DATABASE_URL,
  // allowExitOnIdle: true,
  ssl: process.env.node_env === 'development',
}

const pool = new Pool(config)

const genericQuery = (query, values) => pool
  .query(query, values)
  .then(({ rows }) => rows)
  .catch(({ code, message }) => ({ code, message }))

const createPosts = async ({ titulo, url: img, descripcion, likes }) => {
  const query = 'INSERT INTO posts (id, titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4, $5) RETURNING *;'
  const values = [uuidv4(), titulo, img, descripcion, likes]
  return await genericQuery(query, values)
}

const readPosts = async () => await genericQuery('SELECT * FROM posts;')

const updatePost = async (id) => await genericQuery('UPDATE posts SET likes = COALESCE(likes, 0) + 1 WHERE id = $1 RETURNING *;', [id])

const deletePost = async (id) => await genericQuery('DELETE FROM posts WHERE id = $1 RETURNING *;', [id])

module.exports = {
  createPosts,
  readPosts,
  updatePost,
  deletePost
}
