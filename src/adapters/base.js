const {stringify} = require('./utils')

class Base {
  constructor(
    source,
    { defaultValue = {}, serialize = stringify, deserialize = JSON.parse } = {}
  ) {
    this.source = source
    this.defaultValue = defaultValue
    this.serialize = serialize
    this.deserialize = deserialize
  }
}

module.exports = Base