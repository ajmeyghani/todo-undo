const test = require('tape').test
const Todo = require('../src/todo')
const Action = Todo.Action

test('The actions instance should add actions', (t) => {
  const actions = Todo.Actions()
  const addAction = Action({name: 'add'})
  actions.add(addAction)
  const actual = actions.getAll()
  const expected = [{name: 'add', id: '1'}]
  t.deepEqual(actual, expected, 'should have name and id')
  t.equal(addAction instanceof Action, true, 'should be instance of Action')
  t.end()
})

