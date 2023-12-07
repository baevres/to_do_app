import 'dotenv/config'
import http from 'http'
import { createReadStream } from 'node:fs'
import path from 'path'
import fs from 'fs'
import opn from 'opn'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const host = 'localhost'
const port = 2525
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

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`)
  opn(`http://${host}:${port}`)
})
