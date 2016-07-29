import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import clients from './clients'

const port = process.env.PORT || 3000
let app = express()

app.use(bodyParser.json())

app.get('/', (req, res) =>
  res.sendFile(path.resolve('src/views/index.html')))

app.get('/remote', (req, res) =>
  res.sendFile(path.resolve('src/views/remote.html')))

app.get('/assets/timer.js', (req, res) =>
  res.sendFile(path.resolve('lib/assets/timer.js')))

app.get('/assets/remote.js', (req, res) =>
  res.sendFile(path.resolve('lib/assets/remote.js')))

app.get('/assets/song.mp3', (req, res) =>
  res.sendFile(path.resolve('src/assets/song.mp3')))

app.post('/clients/:id/commands', (req, res) => {
  console.log(`> Received command ${req.body.command} with value ${req.body.value}`)
  let client = clients.get(req.params.id)
  if (!client) {
    res.status(404).send('Client not found')
  } else {
    client.send(req.body)
    res.send('Ok')
  }
})

app.get('/sse', (req, res) => {
  req.socket.setTimeout(Number.MAX_SAFE_INTEGER)
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  })
  res.write('\n')

  let interval = setInterval(() => {
    res.write('event: ping\n')
    res.write('data: ping\n\n')
  }, 30000)

  let client = clients.create({
    send: (data) => res.write(`data: ${JSON.stringify(data)}\n\n`),
  })

  res.write('event: client-id\n')
  res.write(`data: ${JSON.stringify({id: client.id})}\n\n`)

  req.on('close', () => {
    clients.delete(client.id)
    clearInterval(interval)
  })
})

app.listen(port, () => console.log(`Listening on port ${port}`))
