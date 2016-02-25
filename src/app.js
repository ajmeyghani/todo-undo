const Action = require('./todo').Action
function App(config) {
  if (!(this instanceof App)) return new App(config)
  this.tasks = config.tasks
  this.actions = config.actions
}

App.prototype = (function () {
  const methods = {
    add(task) {return this.tasks.add(task)},
    remove(task) {return this.tasks.remove(task)}
  }
  return {
    constructor: App,
    do(methodname) {
      const args = Array.from(arguments).slice(1)
      const data = args[0]
      if (methods[methodname]) {
          const fn = methods[methodname].bind(this)
          const r = fn.call(this, data)
          const action = Action({name: methodname, data: r})
          this.actions.add(action)
      } else {
        throw new Error('Method ' + methodname + ' is not defiend')
      }
      return action
    },
    undo () {
      if (this.actions.getCount()) {
        const lastAction = this.actions.pop()
        this.actions.undoActions.push(Action({
          isUndo: true,
          name: lastAction.name,
          data: lastAction.data,
        }))
        return this.tasks.undo({
          task: lastAction.data,
          action: lastAction
        })
      } else {
        return Action({name: 'empty'})
      }
    },
    redo() {
      if (this.actions.undoActions.length) {
        const lastUndo = this.actions.undoActions.pop()
        this.do(lastUndo.name, lastUndo.data)
      } else {
        return Action({name: 'empty'})
      }
    }
  }
}())

module.exports = App;
