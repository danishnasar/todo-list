import logo from './logo.svg';
import './App.css';
import TodoList from './component/TodoList';
import React, { useState } from 'react'

function App() {
  return (
    <div className="App">
      <TodoList />
    </div>
  );
}

export default App;
