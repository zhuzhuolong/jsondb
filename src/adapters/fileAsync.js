const fs = require('graceful-fs')
const pify = require('pify')
const steno = require('steno')
const Base = require('./base')

const readFile = pify(fs.readFile)
const writeFile = pify(steno.writeFile)

class FileAsync extends Base {
  read() {
    //检测数据路径是否存在
    if (fs.existsSync(this.source)) {
      // Read database
      return readFile(this.source, 'utf-8')
        .then(data => {
          // 读数据信息
          const trimmed = data.trim()
          // 如果有数据验证数据是否符合标准 否则基于数据源重新初始化
          return trimmed ? this.deserialize(trimmed) : this.defaultValue
        })
        .catch(e => {
            // 根据错误类型解析
          if (e instanceof SyntaxError) {
            e.message = `Malformed JSON in file: ${this.source}\n${e.message}`
          }
          throw e
        })
    } else {
      // 初始化数据源
      return writeFile(this.source, this.serialize(this.defaultValue)).then(
        () => this.defaultValue
      )
    }
  }
  
  write(data) {
    return writeFile(this.source, this.serialize(data))
  }
}

module.exports = FileAsync