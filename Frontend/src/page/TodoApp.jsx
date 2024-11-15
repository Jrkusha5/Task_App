import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaTrash, FaEdit, FaPlus, FaSave } from 'react-icons/fa';

const TaskApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [taskDescription, setTaskDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    axios.get("http://localhost:8000/api/todos")
      .then(response => {
        if (Array.isArray(response.data)) {
          setTasks(response.data);
        } else {
          console.error('API response is not an array:', response.data);
          setTasks([]);
        }
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
        setTasks([]);
      });
  }, []);

  const addTask = () => {
    if (!newTask) {
      setErrorMessage("Title is required!");
      return;
    }
    setErrorMessage("");

    axios.post("http://localhost:8000/api/todos", {
      title: newTask,
      description: taskDescription,
      status: "pending"  // New task starts as "pending"
    })
    .then(response => {
      setTasks([response.data.data, ...tasks]); // Add new task at the top
      setNewTask("");
      setTaskDescription("");
    })
    .catch(error => console.error(error));
  };

  const editTask = (task) => {
    setEditingTask(task);
    setNewTask(task.title);
    setTaskDescription(task.description);
  };

  const saveTask = () => {
    if (!newTask) {
      setErrorMessage("Title is required!");
      return;
    }
    setErrorMessage("");

    axios.put(`http://localhost:8000/api/todos/${editingTask.id}`, {
      title: newTask,
      description: taskDescription,
      status: editingTask.status
    })
    .then(response => {
      setTasks(tasks.map(task => task.id === editingTask.id ? response.data.data : task));
      setEditingTask(null);
      setNewTask("");
      setTaskDescription("");
    })
    .catch(error => console.error(error));
  };

  const toggleTaskStatus = (task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    axios.put(`http://localhost:8000/api/todos/${task.id}`, { status: newStatus })
      .then(response => {
        setTasks(tasks.map(t => t.id === task.id ? response.data.data : t));
      })
      .catch(error => {
        console.error('Error updating task status:', error);
      });
  };

  const deleteTask = (id) => {
    axios.delete(`http://localhost:8000/api/todos/${id}`)
      .then(() => {
        setTasks(tasks.filter(task => task.id !== id));
      })
      .catch(error => console.error(error));
  };

  const filteredTasks = tasks
    .filter(task => {
      if (filter === "completed") {
        return task.status === "completed";
      }
      if (filter === "pending") {
        return task.status === "pending";
      }
      return true;
    })
    .reverse(); // Reverse the order to show latest tasks on top

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-blue-900 overflow-hidden p-4">
      <div className="relative z-10 container mx-auto p-8 text-white max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">Task Management</h1>

        <div className="mb-6 flex justify-center gap-4">
          <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-lg ${filter === "all" ? "bg-indigo-600 text-white" : "bg-white text-indigo-600"}`}>
            All Tasks
          </button>
          <button onClick={() => setFilter("completed")} className={`px-4 py-2 rounded-lg ${filter === "completed" ? "bg-indigo-600 text-white" : "bg-white text-indigo-600"}`}>
            Completed
          </button>
          <button onClick={() => setFilter("pending")} className={`px-4 py-2 rounded-lg ${filter === "pending" ? "bg-indigo-600 text-white" : "bg-white text-indigo-600"}`}>
            Pending
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center items-center">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Task Title"
            className="p-3 w-full md:w-72 text-black border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Description (Optional)"
            className="p-3 w-full md:w-72 text-black border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={editingTask ? saveTask : addTask}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 w-full md:w-auto flex items-center justify-center"
          >
            {editingTask ? (
              <>
                <FaSave className="mr-2" />
                Save Task
              </>
            ) : (
              <>
                <FaPlus className="mr-2" />
                Add Task
              </>
            )}
          </button>
        </div>

        {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

        <ul className="space-y-4">
          {filteredTasks.map((task) => (
            <li key={task.id} className={`flex flex-col md:flex-row justify-start items-start p-6 bg-white text-gray-800 rounded-xl shadow-lg ${task.status === "completed" ? "border-l-4 border-green-500" : "border-l-4 border-yellow-500"}`}>
              <div className="flex items-center justify-between w-full mb-2 md:mb-0">
                <div className="flex items-center">
                  <button onClick={() => toggleTaskStatus(task)} className={`p-3 rounded-full ${task.status === "completed" ? "bg-green-100 text-green-500" : "bg-yellow-100 text-yellow-500"}`}>
                    <FaCheckCircle />
                  </button>
                  <div className="ml-4">
                    <span className={`text-lg font-medium ${task.status === "completed" ? "line-through text-gray-500" : "text-gray-800"}`}>
                      {task.title}
                    </span>
                    {task.description && (
                      <p className="mt-2 text-sm text-gray-600">{task.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2 md:mt-0">
                  <button onClick={() => editTask(task)} className="text-yellow-500 hover:text-yellow-600 p-2 transition duration-300">
                    <FaEdit size={18} />
                  </button>
                  <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:text-red-600 p-2 transition duration-300">
                    <FaTrash size={18} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskApp;
