const Action = require('./todo').Action;
/**
 * Manages the operations that you can take
 * in the application
 * @param {Object} config configuration object containing
 * a Tasks manager and an Actions manager
 */

 const methods = {
   add(task) {return this.tasks.add(task);},
   remove(task) {return this.tasks.remove(task);}
 };
function App(config) {
  if (!(this instanceof App)) {
    return new App(config);
  }
  this.tasks = config.tasks;
  this.actions = config.actions;
}

App.prototype.constructor = App;

/**
 * The common interface for methods to be called
 * @param  {String} methodname The method to be invoked by App
 * @return {Object}            The Action object that was performed
 */
App.prototype.do = function (methodname) {
  const args = Array.from(arguments).slice(1);
  const data = args[0];
  if (methods[methodname]) {
      const fn = methods[methodname].bind(this);
      const r = fn.call(this, data);
      const action = Action({name: methodname, data: r});
      this.actions.add(action);
  } else {
    throw new Error('Method ' + methodname + ' is not defiend');
  }
  return action;
};
/**
 * The undo handler
 * @return {Object} the Action object after the operation
 */
App.prototype.undo = function () {
  if (this.actions.getCount()) {
    const lastAction = this.actions.pop();
    this.actions.undoActions.push(Action({
      isUndo: true,
      name: lastAction.name,
      data: lastAction.data,
    }));
    return this.tasks.undo({
      task: lastAction.data,
      action: lastAction
    });
  } else {
    return Action({name: 'empty'});
  }
};
/**
 * The redo handler
 * @return {Action} the action that was performed
 */
App.prototype.redo = function () {
  if (this.actions.undoActions.length) {
    const lastUndo = this.actions.undoActions.pop();
    this.do(lastUndo.name, lastUndo.data);
  } else {
    return Action({name: 'empty'});
  }
};

/**
 * Export
 */
module.exports = App;
