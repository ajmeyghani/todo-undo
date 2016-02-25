const test = require('tape').test
const Todo = require('../src/todo')
const Tasks = Todo.Tasks
const Actions = Todo.Actions
const Task = Todo.Item
const App = require('../src/app')

test('The do method should call the existing method', (t) => {
  const app = App({tasks: Tasks(), actions: Actions()});
  const action = app.do('add', {name: 'some task', id: '1'})
  const actual = action
  const expected = {name: 'add', data: {name: 'some task', id: '1'}}
  t.deepEqual(actual, expected, 'the do method should proxy the call')
  t.end()
})

test('Add two tasks and remove one and verify the items', (t) => {

  const app = App({tasks: Tasks(), actions: Actions()});
  app.do('add', Task({name: 't1'}))
  app.do('add', Task({name: 't2'}))
  const actual1 = app.tasks.getAll()
  const expected1 = [{name: 't1', id: '1'}, {name: 't2', id: '2'}]
  t.deepEqual(actual1, expected1, 'tasks list equality')
  app.do('remove', Task({name: 't1', id: '1'}))
  const actual2 = app.tasks.getAll()
  const expected2 = [{name: 't2', id: '2'}]
  t.deepEqual(actual2, expected2, 'tasks list equality after remove')
  t.end()
})


test('After every do operation, we are going to add a add action to the list of actions held by the app', (t) => {
  /**
   * app.do('whatever'): need to create an action object and then push to the actions object
   */
  const app = App({tasks: Tasks(), actions: Actions()});
  app.do('add', Task({name: 't1'}))
  app.do('add', Task({name: 't2'}))

   // Now we have two actions in the actions list
  const actual = app.actions.getCount()
  const expected = 2
  t.equal(actual, expected)
  // verify the data
  const actual2 = app.actions.getAll()
  const expected2 = [
    {name: 'add', id: '1', data: {name: 't1', id: '1'}},
    {name: 'add', id: '2', data: {name: 't2', id: '2'}}
  ]
  t.deepEqual(actual2, expected2)
  // then remove data (push removeAction to the stack)
  app.do('remove', Task({name: 't2', id: '2'}))
  const actual3 = app.actions.getAll()
  const expected3 = [
    {name: 'add', id: '1', data: {name: 't1', id: '1'}},
    {name: 'add', id: '2', data: {name: 't2', id: '2'}},
    {name: 'remove', id: '3', data: {name: 't2', id: '2'}}
  ]
  t.deepEqual(actual3, expected3)
   t.end()
})


test('Whent he undo method is invoked, need to remove the data or add the data back depending on the action type', (t) => {

  const app = App({tasks: Tasks(), actions: Actions()});
  app.do('add', Task({name: 't1'}))
  app.do('add', Task({name: 't2'}))

  // then remove data (push removeAction to the stack)
  app.do('remove', Task({name: 't2', id: '2'}))
  const actual1 = [{name: 't1', id: '1'}]
  const expected1 = app.tasks.getAll()
  t.deepEqual(actual1, expected1)
  // then undo the action, and the stuf should come back
  app.undo() // undo the remove step, so we should get the item back
  const actual2 = [
    {name: 't1', id: '1'},
    {name: 't2', id: '2'}
  ]
  const expected2 = app.tasks.getAll()
  t.deepEqual(actual2, expected2)
  t.end()
})

test('If the last action is add, then we need to remove the task', (t) => {

  const app = App({tasks: Tasks(), actions: Actions()});
  app.do('add', Task({name: 't1'}))
  app.do('add', Task({name: 't2'}))
  app.undo()
  const actual = [
    {name: 't1', id: '1'}
  ]
  const expected = app.tasks.getAll()
  t.deepEqual(actual, expected)
  t.end()
})

test('After all the actions are undone, and the stack is empty', (t) => {
  const app = App({tasks: Tasks(), actions: Actions()});
  app.do('add', Task({name: 't1'}))
  app.do('add', Task({name: 't2'}))
  app.undo()
  app.undo()
  const actual = []
  const expected = app.tasks.getAll()
  t.deepEqual(actual, expected)
  t.end()
})

test('Prevent users from getting error after undoing all the actions', (t) => {
  const app = App({tasks: Tasks(), actions: Actions()});
  app.do('add', Task({name: 't1'}))
  app.do('add', Task({name: 't2'}))
  app.undo()
  app.undo()
  const actual = app.undo().name
  const expected = 'empty'
  t.equal(actual, expected)
  t.end()
})

test('Redo is equivalent to undoing an undo', (t) => {
  const app = App({tasks: Tasks(), actions: Actions()});
  app.do('add', Task({name: 't1'}))
  app.do('add', Task({name: 't2'}))
  app.undo()
  app.redo()
  const actual = app.tasks.getAll()
  const expected = [
    {name: 't1', id: '1'},
    {name: 't2', id: '2'}
  ]
  t.deepEqual(actual, expected)
  t.end()
})

test('Redo is equivalent to undoing an undo. Testing when the last ation was a remove', (t) => {
  const app = App({tasks: Tasks(), actions: Actions()});
  app.do('add', Task({name: 't1'}))
  app.do('add', Task({name: 't2'}))
  app.do('add', Task({name: 't3'}))
  app.do('remove', {id: '3'})
  app.undo()
  app.redo()
  const actual = app.tasks.getAll()
  const expected = [
    {name: 't1', id: '1'},
    {name: 't2', id: '2'}
  ]
  t.deepEqual(actual, expected)
  t.end()
})
