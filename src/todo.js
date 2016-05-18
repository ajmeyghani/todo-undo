/**
 * Item constructor
 * @param {Object} opts Item configuration
 */
function Item (opts) {
  if (!(this instanceof Item)) {
    return new Item(opts);
  }
  Object.assign(this, opts);
}

/**
 * Action Constructor
 * @param {Object} opts Action configuration
 */
function Action (opts) {
  if (!(this instanceof Action)) {
    return new Action(opts);
  }
  Item.call(this, opts);
}

Action.prototype = Object.create(Item.prototype);
Action.prototype.constructor = Action;

/**
 * Items constructor
 */
function Items () {
  if (!(this instanceof Items)) {
    return new Items();
  }
  this.items = [];
  this.idRef = 0;
}

/**
* Get the item in the list by name or id.
* @param {Object} the object to use for lookup
*/
Items.prototype.get = function (o) {
  const field = o.id ? 'id' : 'name';
  return this.items.filter(i => i[field] === o[field])[0];
};
/**
* Adds an item to the list given an item object.
* @param {Object} item The item object to add.
*/
Items.prototype.add = function (item) {
  const id = (this.idRef += 1) + '';
  const toAdd = Item(Object.assign({
        name: item.name,
        id: id
      }, item));
  this.items.push(toAdd);
  return toAdd;
};
/**
* Remove an item for the list given the item.
* @param {Object} item to be removed
*/
Items.prototype.remove = function (item) {
  if (!(item instanceof Item)) { throw new Error('Object should be an Item instance'); return {}; }
  else {
    this.items = this.items.filter(i => i.id !== item.id);
    return item;
  }
};
/**
 * Undo the last action
 * @param  {Object} opt config object containing the action and the task
 * @return {Object}     Action object
 */
Items.prototype.undo = function (opt) {
  const task = opt.task;
  const lastAction = opt.action;
  if (lastAction.name === 'add') {
    this.remove(task);
    return lastAction;
  } else if (lastAction.name === 'remove') {
    this.items.push(task);
    return lastAction;
  } else {
    return {
      msg: 'Action ' + lastAction.name + 'cannot be undone'
    };
  }
};
/**
 * Return all the elements in the list
 * @return {Array} list containing all the Items
 */
Items.prototype.getAll = function () {return this.items;};
/**
 * Get the total number of items in the list
 * @return {Number} total number of Items in the list
 */
Items.prototype.getCount = function () {return this.items.length;};
/**
 * Get the current id value
 * @return {Number} the current id value
 */
Items.prototype.getRefId = function () {return this.idRef;};

/**
 * Manages the actions list
 */
function Actions() {
  if (!(this instanceof Actions)) {
    return new Actions;
  }
  Items.call(this);
}

Actions.prototype = Object.create(Items.prototype);

Actions.prototype.undoActions = [];

/**
 * Adds an action to the list of actions given an Action
 * @param {Object} item the action to be added to the list of Actions
 */
Actions.prototype.add = function (item) {
  const id = (this.idRef += 1) + '';
  const toAdd = Action(Object.assign({
        name: item.name,
        id: id
      }, item));
  this.items.push(toAdd);
  return toAdd;
};
/**
 * Removes the last Action from the action list
 * @return {Object} the last Action object from the list
 */
Actions.prototype.pop = function () {
  return this.items.pop();
};

Actions.prototype.constructor = Actions;

/**
 * Manages tasks by keeping a reference
 * to the Tasks list
 */
function Tasks () {
  if (!(this instanceof Tasks)) {
    return new Tasks;
  }
  Items.call(this);
}

Tasks.prototype = Object.create(Items.prototype);
Tasks.prototype.constructor = Tasks;

/**
 * Export
 */
module.exports = {
  Item, Action, Items, Actions, Tasks
};
