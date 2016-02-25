const test = require('tape').test
const Todo = require('../src/todo')
const Item = Todo.Item
test('The items instance', (t) => {
  const items = Todo.Items()
  const itemToAdd = Item({name: 'clean'})
  items.add(itemToAdd)
  const actual = items.getAll()
  const expected = [{name: 'clean', id: '1'}]
  t.deepEqual(actual, expected, 'should have name and id')
  t.equal(itemToAdd instanceof Item, true, 'item should be instance of item')
  t.end()
})

test('The items instance', (t) => {
  const items = Todo.Items()
  items.add(Item({name: 'clean'}))
  items.add(Item({name: 'laundry'}))
  const actual = items.getCount()
  const expected = 2
  t.equal(actual, expected, 'increment the id automatically')
  t.end()
})

test('The get method', (t) => {
  const items = Todo.Items()
  items.add(Item({name: 'clean'}))
  items.add(Item({name: 'laundry'}))
  const actual = items.get({name: 'clean'})
  const expected = {name: 'clean', id: '1'}
  t.deepEqual(actual, expected, 'should return the item object given the name')
  const actual2 = items.get({id: '1'})
  const expected2 = {name: 'clean', id: '1'}
  t.deepEqual(actual2, expected2, 'should return the item object given the id')
  t.end()
})

test('The remove method', (t) => {
  const items = Todo.Items()
  items.add(Item({name: 'clean'}))
  items.add(Item({name: 'laundry'}))
  const actual = items.getAll()
  const expected = [{name: 'clean', id: '1'}, {name: 'laundry', id: '2'}]
  t.deepEqual(actual, expected, 'first should have two items before remove')
  const itemToRemove = items.get({name: 'clean'})
  items.remove(itemToRemove)
  const actual2 = items.getAll()
  const expected2 = [{name: 'laundry', id: '2'}]
  t.deepEqual(actual2, expected2, 'should remove the given item object')
  t.end()
})

test('The get idRef', (t) => {
  const items = Todo.Items()
  items.add(Item({name: 'clean'}))
  items.add(Item({name: 'laundry'}))
  items.add(Item({name: 'somethingelse'}))
  const actual = items.getRefId()
  const expected = 3
  t.equal(actual, expected, 'should return the current id')
  t.end()
})
