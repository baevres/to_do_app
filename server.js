const express = require('express')
const path = require('path')
const port = process.env.PORT || 5500

const app = express()

app.use(express.static(path.resolve(__dirname, 'src')))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'src', 'index.html'))
})

app.listen(port, () => {
  console.log(`server running on http://127.0.0.1:${port}`)
})
