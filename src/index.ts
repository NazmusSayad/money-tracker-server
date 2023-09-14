import rype from 'rype'
globalThis.r = rype
declare global {
  var r: typeof rype
}

import env from 'cli-node-env'
import { config } from 'dotenv'
config()

console.log('---', new Date().toString())
env.isDev && console.clear()

import './db'
import './server'
import './_lab'
