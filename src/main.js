const lodash = require('lodash')
const isPromise = require('is-promise')
const fs = require('fs');

/**
 * 
 * @param {*} config
 * @returns 
 */
module.exports = function (name , path) {
    // 创建一个给定context上下文对象的原始的 lodash 函数
    const _ = lodash.runInContext()
    // 创建包装实例
    const db = _.chain({})

    const dbPool = [];

    const plant = (state) => {
        db.__wrapped__ = state
        return db
    }
    //添加write 原型
    _.prototype.write = _.wrap(_.prototype.value, function (func) {
        const funcRes = func.apply(this)
        return db.write(funcRes)
    })

    db._ = _
    // 混合方法增加 _
    
    db.read = () => {
        const r = adapter.read()
        return isPromise(r) ? r.then(plant) : plant(r)
    }

    db.write = returnValue => {
        const w = adapter.write(db.getState())
        return isPromise(w) ? w.then(() => returnValue) : returnValue
    }

    db.getState = () => db.__wrapped__

    db.setState = state => plant(state)

    db.getDB = () => {
        return db.DB
    }

    return db.read()
}