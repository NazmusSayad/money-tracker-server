import app from './app'
import io from './socket'

const port = process.env.PORT ?? 8000

const server = app.listen(port, () => {
  console.log('>>>', `App running on port "${port}"...`)
})

io.attach(server)
export default server
