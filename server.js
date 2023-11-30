import 'dotenv/config'
import http from 'http'
import { createReadStream } from 'node:fs'
import path from 'path'
import fs from 'fs'
import opn from 'opn'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

import router from './routes/router.js'

const host = 'localhost'
const port = 5555
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const pathFolder = path.resolve(__dirname, 'src')
const mainFile = path.resolve(__dirname, 'src', 'index.html')

const setContentType = (filePath) => {
  if (/\.js$/.test(filePath)) return 'text/javascript; charset=utf-8'
  else if (/\.css$/.test(filePath)) return 'text/css; charset=utf-8'
  else if (/(.*)?$/.test(filePath)) return 'text/html; charset=utf-8'
  else if (/\.svg$/.test(filePath)) return 'image/svg+xml; charset=utf-8'
  else return 'text/plain'
}

const requestListener = function (req, res) {
  if (req.method === 'GET' && req.url.indexOf('/api/') === -1) {
    try {
      let fileName
      const url = path.normalize(decodeURI(req.url))
      const filePath = path.join(pathFolder, url)
      const defaultPath = path.join(pathFolder, '/')
      if (url.indexOf('favicon.ico') === -1) {
        if (filePath === defaultPath || !fs.existsSync(filePath)) {
          fileName = mainFile
        } else {
          fileName = filePath
        }
      }

      if (fileName) {
        const stream = createReadStream(fileName, 'utf8')
        stream.on('open', () => {
          res.writeHead(200, {
            'Content-Type': setContentType(filePath),
          })
        })
        stream.pipe(res)

        res.on('close', () => {
          stream.destroy()
        })
      }
    } catch (err) {
      console.log(err)
    }
  }
}

const server = http.createServer(requestListener)

server.on('request', async (req, res) => {
  const url = req.url

  if (url.indexOf('/api/') > -1) {
    let data
    const header = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    }
    try {
      data = await router(req, res)
      if (data && typeof data != 'string') {
        if (data.refreshToken) {
          res.setHeader(
            'Set-Cookie',
            `refreshToken=${data.refreshToken}; Path=/; HttpOnly`,
          )
        }
        res.writeHead(200, header)
        res.end(JSON.stringify(data))
      } else if (typeof data === 'string') {
        switch (data) {
          case 'Unauthorized':
            res.writeHead(401, header)
            data = {
              message: 'Token is invalid or not found',
              type: 'error',
              status: 401,
              reason: 'Unauthorized',
            }
            res.end(JSON.stringify(data))
            break
          case 'Forbidden':
            res.writeHead(403, header)
            data = {
              message: 'The current task does not belong to the user',
              type: 'error',
              status: 403,
              reason: data,
            }
            res.end(JSON.stringify(data))
            break
          case 'Path not found':
            res.writeHead(404, header)
            data = {
              message: data,
              type: 'error',
              status: 404,
              reason: 'Not found',
            }
            res.end(JSON.stringify(data))
            break
          case 'User not found':
            res.writeHead(404, header)
            data = {
              message: 'Username and password do not match',
              type: 'error',
              status: 404,
              reason: 'Not found',
            }
            res.end(JSON.stringify(data))
            break
          default:
            res.writeHead(400, header)
            data = {
              message: 'Invalid data',
              type: 'error',
              status: 400,
              reason: 'Bad request',
              error: data,
            }
            res.end(JSON.stringify(data))
            break
        }
      } else {
        res.writeHead(400, header)
        data = {
          message: 'Invalid data',
          type: 'error',
          status: 400,
          reason: 'Bad request',
          error: data,
        }
        res.end(JSON.stringify(data))
      }
    } catch (error) {
      console.error(error)
      res.writeHead(500, header)
      data = {
        message: 'Internal Server Error',
        type: 'error',
        status: 500,
      }
      res.end(JSON.stringify(data))
    }
  }
})

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`)
  opn(`http://${host}:${port}`)
})
