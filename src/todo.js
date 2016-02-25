/**
 * Item constructor
 * @param {[type]} opts [description]
 */
function Item (opts) {
  if (!(this instanceof Item)) return new Item(opts)
  Object.assign(this, opts)
}

/**
 * Action Constructor
 * @param {[type]} opts [description]
 */
function Action (opts) {
  if (!(this instanceof Action)) return new Action(opts)
  Item.call(this, opts);
}

Action.prototype = Object.create(Item.prototype)
Action.prototype.constructor = Action

/**
 * Items constructor
 */
function Items () {
  if (!(this instanceof Items)) return new Items()
  this.items = []
  this.idRef = 0
}

Items.prototype = {
  /**
  * Get the item in the list by name or id.
  * @param {Object} the object to use for lookup
  */
  get(o) {
    const field = o.id ? 'id' : 'name'
    return this.items.filter(i => i[field] === o[field])[0]
  },
  /**
  * Adds an item to the list given an item object.
  * @param {Object} the item object to add.
  */
  add(item) {
    const id = (this.idRef += 1) + '';
    const toAdd = Item(Object.assign({
          name: item.name,
          id: id
        }, item))
    this.items.push(toAdd)
    return toAdd
  },
  /**
  * Remove an item for the list given the item.
  * @param {Object} the item to remove
  */
  remove(item) {
    if (!(item.id)) { throw new Error('Item must have id!'); return {} }
    else {
      this.items = this.items.filter(i => i.id !== item.id)
      return item
    }
  },
  /**
   * Undo the last action
   * @param  {Object} opt config object containing the action and the task
   * @return {Object}     Action object
   */
  undo(opt) {
    const task = opt.task
    const lastAction = opt.action
    if (lastAction.name === 'add') {
      this.remove(task)
      return lastAction
    } else if (lastAction.name === 'remove') {
      this.items.push(task)
      return lastAction
    } else {
      return {msg: 'Action ' + lastAction.name + 'cannot be undone'}
    }
  },
  /**
  * Return all the elements in the list.
  */
  getAll() {return this.items},
  /**
  * Return the totall count of items.
  */
  getCount() {return this.items.length},
  /**
  * Get the current id value.
  */
  getRefId() {return this.idRef},
};

/**
 * Actions Constructor
 */
function Actions() {
  if (!(this instanceof Actions)) return new Actions
  Items.call(this)
}

Actions.prototype = Object.create(Items.prototype)

Actions.prototype.undoActions = []

Actions.prototype.add = function (item) {
  const id = (this.idRef += 1) + '';
  const toAdd = Action(Object.assign({
        name: item.name,
        id: id
      }, item))
  this.items.push(toAdd)
  return toAdd
}
Actions.prototype.pop = function () {
  return this.items.pop()
}

Actions.prototype.constructor = Actions

/**
 * Tasks Constructor
 */
function Tasks () {
  if (!(this instanceof Tasks)) return new Tasks
  Items.call(this)
}

Tasks.prototype = Object.create(Items.prototype)
Tasks.prototype.constructor = Tasks;

/**
 * Export
 */
module.exports = {
  Item: Item,
  Action: Action,
  Items: Items,
  Actions: Actions,
  Tasks: Tasks
}
