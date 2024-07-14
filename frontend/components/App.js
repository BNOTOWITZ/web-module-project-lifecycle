import React from 'react'

// frontend\components\App.js
import TodoList from './TodoList' // TodoList.js  frontend\components\TodoList.js
export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      todos: []
    } // state = { todos: [] }
  }
  componentDidMount() {
    this.getTodos() // this.getTodos()
  }
  async getTodos() {
    const response = await fetch('http://localhost:9000/api/todos')
    const todos = await response.json()
    this.setState({ todos })  // this.setState({ todos })     
  }
  async addTodo(newTodo) {
    const response = await fetch('http://localhost:9000/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTodo)
    })
    const todo = await response.json()
    this.setState({ todos: [...this.state.todos, todo] })
  }
  async deleteTodo(id) {
    await fetch(`http://localhost:9000/api/todos/${id}`, {
      method: 'DELETE'
    })
    this.setState({
      todos: this.state.todos.filter(todo => todo.id !== id)
    })
  }
  async toggleTodo(id) {
    const todo = this.state.todos.find(todo => todo.id === id)
    const updatedTodo = { ...todo, completed: !todo.completed }
    const response = await fetch(`http://localhost:9000/api/todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedTodo)
    })
    const data = await response.json()
    this.setState({
      todos: this.state.todos.map(todo =>
        todo.id === id ? data : todo
      )
    })  
  }
  renderTodos() {
    return (
      <TodoList
        todos={this.state.todos}
        deleteTodo={this.deleteTodo.bind(this)}
        toggleTodo={this.toggleTodo.bind(this)}
      />
    ) // return null  
  }
  renderForm() {
    return <Form addTodo={this.addTodo.bind(this)} /> // return null
  }
  render() {
    return (
      <div>
        {this.renderForm()}
        {this.renderTodos()}
      </div>
    ) // return null
  }
} // class App extends React.Component
class Form extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      newTodo: ''
    }
  }
  handleChange(event) {
    this.setState({ newTodo: event.target.value })
  }
  handleSubmit(event) {
    event.preventDefault()
    this.props.addTodo(this.state.newTodo)
    this.setState({ newTodo: '' })
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <input                        
          type="text"
          value={this.state.newTodo}
          onChange={this.handleChange.bind(this)}   
        />
        <button type="submit">Add Todo</button> 
      </form>
    ) // return null      
  }
} // class Form extends React.Component
