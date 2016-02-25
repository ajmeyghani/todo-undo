const test = require('tape').test
const Todo = require('../src/todo')
const Item = Todo.Item

test('An item', t => {
  const item = Item({name: 's'})
  t.equal(item instanceof Item, true, 'should be an instance of Item')
  t.end()
})

test('An items manager', (t) => {
  const items = Todo.Items()
  const itemToAdd = Item({name: 'clean'})
  items.add(itemToAdd)
  const actual = items.getAll()
  const expected = [{name: 'clean', id: '1'}]
  t.deepEqual(actual, expected, 'should add items to the Items list')
  t.end()
})

test('An items manager', (t) => {
  const items = Todo.Items()
  items.add(Item({name: 'clean'}))
  items.add(Item({name: 'laundry'}))
  const actual = items.getCount()
  const expected = 2
  t.equal(actual, expected, 'should auto increment the current id after adding items')
  t.end()
})

test('The `get` method', (t) => {
  const items = Todo.Items()
  items.add(Item({name: 'clean'}))
  items.add(Item({name: 'laundry'}))
  const actual = items.get({name: 'clean'})
  const expected = {name: 'clean', id: '1'}
  t.deepEqual(actual, expected, 'should return the item given the name of the item')
  const actual2 = items.get({id: '1'})
  const expected2 = {name: 'clean', id: '1'}
  t.deepEqual(actual2, expected2, 'should return the item given the id of the item')
  t.end()
})

test('The `remove` method', (t) => {
  const items = Todo.Items()
  items.add(Item({name: 'clean'}))
  items.add(Item({name: 'laundry'}))
  const itemToRemove = items.get({name: 'clean'})
  items.remove(itemToRemove)
  const actual = items.getAll()
  const expected = [{name: 'laundry', id: '2'}]
  t.deepEqual(actual, expected, 'should remove a given Item object/instance')
  t.end()
})

test('The `getRefId` method', (t) => {
  const items = Todo.Items()
  items.add(Item({name: 'clean'}))
  items.add(Item({name: 'laundry'}))
  items.add(Item({name: 'somethingelse'}))
  const actual = items.getRefId()
  const expected = 3
  t.equal(actual, expected, 'should return the current id value that automatically gets incremented.')
  t.end()
})
