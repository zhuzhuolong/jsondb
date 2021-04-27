const fs = require('graceful-fs')
const Base = require('./base')

const readFile = fs.readFileSync
const writeFile = fs.writeFileSync

// 去除异步await
class FileSync extends Base {
  read() {
    if (fs.existsSync(this.source)) {
      try {
        const data = readFile(this.source, 'utf-8').trim()
        // Handle blank file
        return data ? this.deserialize(data) : this.defaultValue
      } catch (e) {
        if (e instanceof SyntaxError) {
          e.message = `Malformed JSON in file: ${this.source}\n${e.message}`
        }
        throw e
      }
    } else {
      writeFile(this.source, this.serialize(this.defaultValue))
      return this.defaultValue
    }
  }

  write(data) {
    return writeFile(this.source, this.serialize(data))
  }
}

module.exports = FileSync
