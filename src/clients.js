import shortid from 'shortid'

let clientPool = {}

export default {
  get: (id) => clientPool[id],
  create: (client) => {
    client.id = shortid.generate()
    while (clientPool[client.id]) { // avoid collisions
      client.id = shortid.generate()
    }
    clientPool[client.id] = client
    return client
  },
  delete: (id) => delete clientPool[id],
}
