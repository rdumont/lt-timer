import express from 'express'

const port = process.env.PORT || 3000
let app = express()

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.listen(port, () => console.log(`Listening on port ${port}`))
