import express from 'express'
import extrass from 'extrass'
import cors from 'cors'
import xss from 'xss-clean'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'
import mongoSanitize from 'express-mongo-sanitize'
import router from './router'
const app = express()

// Safety
app.use(cors({ origin: /.*/ }))
app.use(helmet())
app.use(
  rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000 /* 1 Hour */,
    message: {
      status: 'fail',
      message: 'Too many requests, please try again later',
    },
  })
)

// Parser
app.use(express.json({ limit: '8kb' }))
app.use(cookieParser())

// XXS
app.use(mongoSanitize())
app.use(xss())

app.use((req, res, next) => {
  console.log(req.cookies.Boom)
  const val = Math.random()
  res.cookie('Boom', val, {
    secure: true,
    sameSite: 'none',
    httpOnly: true,
    maxAge: 86400000 /* 1 day -> miliseconds */ * 30,
  })
  next()
})

// Router
app.use(router)

// Finisher
extrass(app, { ping: '/ping' })
export default app
