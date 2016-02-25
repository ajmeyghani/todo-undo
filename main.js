const todoApp = require('./src/todo')
const Tasks = todoApp.Tasks
const Actions = todoApp.Actions
const Item = todoApp.Item
const app = require('./src/app')({
  tasks: Tasks(),
  actions: Actions()
});

app.do('add', Item({name: 'clean'}))
app.do('add', Item({name: 'clean2'}))


console.log(app.tasks.getAll())
console.log(app.actions.getAll())
