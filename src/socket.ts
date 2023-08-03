import { Server } from 'socket.io'

const io = new Server({
  cors: { origin: '*', credentials: true },
})

io.on('connect', (socket) => {
  try {
    const { authorization } = socket.handshake.auth
    console.log(authorization)
  } catch (err) {}
})

export default io
