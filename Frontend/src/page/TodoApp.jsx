import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCheckCircle, FaTrash, FaEdit, FaPlus, FaSave } from "react-icons/fa";

const TaskApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [taskDescription, setTaskDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/todos")
      .then((response) => setTasks(response.data.data || []))
      .catch((error) => console.error(error));
  }, []);

  const addTask = () => {
    if (!newTask) {
      setErrorMessage("Title is required!");
      return;
    }
    setErrorMessage("");

    axios
      .post("http://localhost:8000/api/todos", {
        title: newTask,
        description: taskDescription,
        status: "pending",
      })
      .then((response) => {
        setTasks([...tasks, response.data.data]);
        setNewTask("");
        setTaskDescription("");
      })
      .catch((error) => console.error(error));
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

    axios
      .put(`http://localhost:8000/api/todos/${editingTask.id}`, {
        title: newTask,
        description: taskDescription,
        status: editingTask.status,
      })
      .then((response) => {
        setTasks(tasks.map((task) => (task.id === editingTask.id ? response.data.data : task)));
        setEditingTask(null);
        setNewTask("");
        setTaskDescription("");
      })
      .catch((error) => console.error(error));
  };

  const toggleTaskStatus = (task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    axios
      .put(`http://localhost:8000/api/todos/${task.id}`, { status: newStatus })
      .then((response) => {
        setTasks(tasks.map((t) => (t.id === task.id ? response.data.data : t)));
      })
      .catch((error) => console.error(error));
  };

  const deleteTask = (id) => {
    axios
      .delete(`http://localhost:8000/api/todos/${id}`)
      .then(() => setTasks(tasks.filter((task) => task.id !== id)))
      .catch((error) => console.error(error));
  };

  const filteredTasks = tasks.filter((task) =>
    filter === "all" ? true : task.status === filter
  );

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-black to-blue-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-6">Task Management</h1>

      <div className="flex gap-4 mb-4">
        <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded ${filter === "all" ? "bg-green-500" : "bg-gray-500"}`}>All</button>
        <button onClick={() => setFilter("completed")} className={`px-4 py-2 rounded ${filter === "completed" ? "bg-green-500" : "bg-gray-500"}`}>Completed</button>
        <button onClick={() => setFilter("pending")} className={`px-4 py-2 rounded ${filter === "pending" ? "bg-yellow-500" : "bg-gray-500"}`}>Pending</button>
      </div>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Task Title"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="p-2 rounded"
        />
        <input
          type="text"
          placeholder="Description"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          className="p-2 rounded"
        />
        <button onClick={editingTask ? saveTask : addTask} className="bg-indigo-600 px-4 py-2 rounded">
          {editingTask ? <FaSave /> : <FaPlus />}
        </button>
      </div>

      <ul className="w-full max-w-2xl">
        {filteredTasks.map((task) => (
          <li key={task.id} className={`p-4 rounded mb-2 ${task.status === "completed" ? "bg-green-500" : "bg-yellow-500"}`}>
            <div className="flex justify-between">
              <div>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
              </div>
              <div>
                <button onClick={() => toggleTaskStatus(task)}><FaCheckCircle /></button>
                <button onClick={() => editTask(task)}><FaEdit /></button>
                <button onClick={() => deleteTask(task.id)}><FaTrash /></button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskApp;
