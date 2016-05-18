const test = require('tape').test;
const Todo = require('../src/todo');
const Action = Todo.Action;

test('The action object', t => {
  const a = Action({name: 'add', id: '1'});
  const actual = a instanceof Action;
  const expected = true;
  t.equal(actual, expected, 'should be an instance of Action');
  t.end();
});

test('Action\'s `add` method', (t) => {
  const actions = Todo.Actions();
  const addAction = Action({name: 'add'});
  actions.add(addAction);
  const actual = actions.getAll();
  const expected = [{name: 'add', id: '1'}];
  t.deepEqual(actual, expected, 'should add instances to the actions list');
  t.end();
})

