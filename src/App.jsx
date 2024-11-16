import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';

function App() {
  const [task, setTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem('tasks');
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
      return [];
    }
  });
  const [filter, setFilter] = useState('all');
  const [quote, setQuote] = useState('');

  // List of motivational quotes
  const quotes = [
    "The best way to get started is to quit talking and begin doing.",
    "Don't let yesterday take up too much of today.",
    "It’s not whether you get knocked down, it’s whether you get up.",
    "You learn more from failure than from success. Don’t let it stop you.",
    "The only limit to our realization of tomorrow is our doubts of today."
  ];

  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  }, [tasks]);

  useEffect(() => {
    fetchRandomQuote();
  }, []);

  const fetchRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  };

  const handleAddTask = () => {
    if (task.trim()) {
      const newTask = { text: task, dueDate: dueDate, completed: false };
      setTasks([...tasks, newTask]);
      setTask('');
      setDueDate('');
      fetchRandomQuote();
    }
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const toggleTaskCompletion = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  return (
    <div className="app">
      <div className="task-section">
        <h2>Task List</h2>
        <div className="task-container">
          {filteredTasks.length > 0 ? (
            <ul className="task-list">
              {filteredTasks.map((task, index) => (
               <li key={index} className="task-item">
               <input
                 type="checkbox"
                 className="custom-checkbox"
                 checked={task.completed}
                 onChange={() => toggleTaskCompletion(index)}
               />
               <span className={`task-text ${task.completed ? 'completed' : ''}`}>
                 {task.text}
                 {task.dueDate && <span className="due-date"> (Due: {task.dueDate})</span>}
               </span>
               <i className="fas fa-trash delete-icon" onClick={() => handleDeleteTask(index)}></i>
             </li>
              
              ))}
            </ul>
          ) : (
            <p className="no-tasks">No tasks added yet!</p>
          )}
        </div>
      </div>

      <div className="input-section">
        <h2>Add Task</h2>
        <input
          type="text"
          placeholder="Enter a task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button onClick={handleAddTask}>Add Task</button>

        <div className="filter-section">
          <label>
            Filter:
            <select value={filter} onChange={handleFilterChange}>
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </label>
        </div>
      </div>

      <div className="quote-section">
        <h2>Motivational Quote</h2>
        <p>{quote}</p>
      </div>
    </div>
  );
}

export default App;
