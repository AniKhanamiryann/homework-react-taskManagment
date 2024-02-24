import React, { useReducer } from 'react';
import { initialTasks } from '../Tasks/constants';
import { useState } from 'react';


function TaskManager() {
  const [tasks, dispatch] = useReducer(taskReducer, initialTasks);
  
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo',
    assignee: '',
    priority: 'low'
  });

  const handleAddTask = () => {
    dispatch({ type: 'ADD_TASK', payload: { ...newTask, id: tasks.length + 1 } });
    setNewTask({
      title: '',
      description: '',
      status: 'todo',
      assignee: '',
      priority: 'low'
    });
    setShowAddTaskForm(false);
  };

  const handleClose = () => {
    setShowAddTaskForm(false);
  }

  return (
   <div>
    <button className='add-task-button' onClick={() => setShowAddTaskForm(true)}>Add Task</button>
      {showAddTaskForm && (
        <div className='add-task-form'>
          <input className='taskTitle' type="text" value={newTask.title} placeholder="Title" onChange={(e) => setNewTask({...newTask, title: e.target.value})} />
          <input value={newTask.description} placeholder="Description" onChange={(e) => setNewTask({...newTask, description: e.target.value})} />
          <select value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value})}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input type="text" value={newTask.assignee} placeholder="Assignee" onChange={(e) => setNewTask({...newTask, assignee: e.target.value})} />
          <button onClick={handleAddTask}>Add</button>
          <button className='closebtn' onClick={handleClose}>Cancel</button>
        </div>
      )}
    <div className="task-manager">
      <div className="column">
        <h2>TODO</h2>
        <TaskColumn tasks={tasks.filter(task => task.status === 'todo')} dispatch={dispatch} />
      </div>
      <div className="column">
        <h2>DOING</h2>
        <TaskColumn tasks={tasks.filter(task => task.status === 'doing')} dispatch={dispatch} />
      </div>
      <div className="column">
        <h2>DONE</h2>
        <TaskColumn tasks={tasks.filter(task => task.status === 'done')} dispatch={dispatch} />
      </div>
      <div className="column">
        <h2>BLOCKED</h2>
        <TaskColumn tasks={tasks.filter(task => task.status === 'blocked')} dispatch={dispatch} />
      </div>
    </div>
   </div>
  );
}

 
function TaskColumn({ tasks, dispatch }) {
  return (
    <div className="task-column">
      {tasks.map(task => (
        <Task key={task.id} task={task} dispatch={dispatch} />
      ))}
    </div>
  );
}



function Task({ task, dispatch }) {
    const { id, title, description, status, assignee, priority } = task;
    const [selectedStatus, setSelectedStatus] = useState('');
  
    const handleDelete = () => {
      dispatch({ type: 'DELETE_TASK', payload: id });
    };

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        dispatch({ type: 'MOVE_TASK', payload: { id, newStatus } });
      };
    
  
    return (
      <div key={task.id} className={`task ${status}`}>
        <h3>{title}</h3>
        <p>{description}</p>
        <p>Assignee: {assignee}</p>
        <p>Priority: {priority}</p>
        <button onClick={() => handleDelete(task.id)}>Delete</button>
        <select value={status} onChange={handleStatusChange}>
          <option value="todo">TODO</option>
          <option value="doing">DOING</option>
          <option value="done">DONE</option>
          <option value="blocked">BLOCKED</option>
        </select>
      </div>
    );
  }
  
  


function taskReducer(state, action) {
  switch (action.type) {
    case 'DELETE_TASK':
      return state.filter(task => task.id !== action.payload);
    case 'MOVE_TASK':
      return state.map(task => {
        if (task.id === action.payload.id) {
          return { ...task, status: action.payload.newStatus };
        }
        return task;
      });
  
    case 'ADD_TASK':
      return [...state, action.payload];

      
    default:
      return state;
  }
}

function nextStatus(currentStatus) {
    switch (currentStatus) {
      case 'todo':
        return 'doing';
      case 'doing':
        return 'done';
      case 'blocked':
        return 'todo';
      default:
        return 'todo';
    }
  }


export default TaskManager;
