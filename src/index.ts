import { config } from 'dotenv'
import env from 'cli-node-env'
config()

import rype from 'rype'
globalThis.r = rype
declare global {
  var r: typeof rype
}

console.log('---', new Date().toString())
env.isDev && console.clear()

import './db'
import './server'
import './_lab'
