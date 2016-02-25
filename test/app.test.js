const test = require('tape').test
const Todo = require('../src/todo')
const Tasks = Todo.Tasks
const Actions = Todo.Actions
const Task = Todo.Item
const App = require('../src/app')

test('The do method', (t) => {
  const app = App({tasks: Tasks(), actions: Actions()});
  const action = app.do('add', {name: 'some task', id: '1'})
  const actual = action
  const expected = {name: 'add', data: {name: 'some task', id: '1'}}
  t.deepEqual(actual, expected, 'should call the existing method and return the action')
  t.end()
})

test('After adding two items and removing one ', (t) => {

  const app = App({tasks: Tasks(), actions: Actions()});
  app.do('add', Task({name: 't1'}))
  app.do('add', Task({name: 't2'}))
  const actual1 = app.tasks.getAll()
  const expected1 = [{name: 't1', id: '1'}, {name: 't2', id: '2'}]
  t.deepEqual(actual1, expected1, '...')
  app.do('remove', Task({name: 't1', id: '1'}))
  const actual2 = app.tasks.getAll()
  const expected2 = [{name: 't2', id: '2'}]
  t.deepEqual(actual2, expected2, 'should have 1 item in the app')
  t.end()
})


test('After every operation done by app', (t) => {
  const app = App({tasks: Tasks(), actions: Actions()});
  app.do('add', Task({name: 't1'}))
  app.do('add', Task({name: 't2'}))

   // Now we have two actions in the actions list
  const actual = app.actions.getCount()
  const expected = 2
  t.equal(actual, expected, 'should have correct number of actions in the actions list')
  // verify the data
  const actual2 = app.actions.getAll()
  const expected2 = [
    {name: 'add', id: '1', data: {name: 't1', id: '1'}},
    {name: 'add', id: '2', data: {name: 't2', id: '2'}}
  ]
  t.deepEqual(actual2, expected2, 'should have correct number of actions in the actions list')
  // then remove data (push removeAction to the stack)
  app.do('remove', Task({name: 't2', id: '2'}))
  const actual3 = app.actions.getAll()
  const expected3 = [
    {name: 'add', id: '1', data: {name: 't1', id: '1'}},
    {name: 'add', id: '2', data: {name: 't2', id: '2'}},
    {name: 'remove', id: '3', data: {name: 't2', id: '2'}}
  ]
  t.deepEqual(actual3, expected3, 'should have correct number of actions in the actions list')
   t.end()
})


test('The `undo` method', (t) => {

  const app = App({tasks: Tasks(), actions: Actions()});
  app.do('add', Task({name: 't1'}))
  app.do('add', Task({name: 't2'}))

  // then remove data (push removeAction to the stack)
  app.do('remove', Task({name: 't2', id: '2'}))
  const actual1 = [{name: 't1', id: '1'}]
  const expected1 = app.tasks.getAll()
  t.deepEqual(actual1, expected1, 'should add the item back if the last action was remove')
  // then undo the action, and the stuf should come back
  app.undo() // undo the remove step, so we should get the item back
  const actual2 = [
    {name: 't1', id: '1'},
    {name: 't2', id: '2'}
  ]
  const expected2 = app.tasks.getAll()
  t.deepEqual(actual2, expected2, 'should add the item back if the last action was remove')
  t.end()
})

test('The `undo` method', (t) => {

  const app = App({tasks: Tasks(), actions: Actions()});
  app.do('add', Task({name: 't1'}))
  app.do('add', Task({name: 't2'}))
  app.undo()
  const actual = [
    {name: 't1', id: '1'}
  ]
  const expected = app.tasks.getAll()
  t.deepEqual(actual, expected, 'should remove the item if the last action was add')
  t.end()
})

test('After undoing all the actions', (t) => {
  const app = App({tasks: Tasks(), actions: Actions()});
  app.do('add', Task({name: 't1'}))
  app.do('add', Task({name: 't2'}))
  app.undo()
  app.undo()
  const actual = []
  const expected = app.tasks.getAll()
  t.deepEqual(actual, expected, 'the actions list should be empty')
  t.end()
})

test('If the user keeps on undoing', (t) => {
  const app = App({tasks: Tasks(), actions: Actions()});
  app.do('add', Task({name: 't1'}))
  app.do('add', Task({name: 't2'}))
  app.undo()
  app.undo()
  const actual = app.undo().name
  const expected = 'empty'
  t.equal(actual, expected, 'app should not throw error')
  t.end()
})

test('The `redo` method', (t) => {
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
  t.deepEqual(actual, expected, 'should repeat the task was a undo')
  t.end()
})

test('If the last action was a remove', (t) => {
  const app = App({tasks: Tasks(), actions: Actions()});
  app.do('add', Task({name: 't1'}))
  app.do('add', Task({name: 't2'}))
  app.do('add', Task({name: 't3'}))
  app.do('remove', Task({name: 't3', id: '3'}))
  app.undo()
  app.redo()
  const actual = app.tasks.getAll()
  const expected = [
    {name: 't1', id: '1'},
    {name: 't2', id: '2'}
  ]
  t.deepEqual(actual, expected, 'undo and then redoing should add the last item and then remove the last item')
  t.end()
})
