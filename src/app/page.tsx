"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2, Plus, CheckCircle2, Circle } from "lucide-react";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

type Filter = "all" | "active" | "completed";

export default function TodoPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("orbit-todos");
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse tasks", e);
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("orbit-todos", JSON.stringify(tasks));
    }
  }, [tasks, isMounted]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: input.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
    setInput("");
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  if (!isMounted) return null;

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 border border-slate-100">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Orbit Tasks</h1>
      
      <form onSubmit={addTask} className="flex gap-2 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus size={20} />
        </button>
      </form>

      <div className="flex gap-2 mb-4 text-sm">
        {(["all", "active", "completed"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full capitalize ${
              filter === f ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="space-y-2">
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg group"
          >
            <button onClick={() => toggleTask(task.id)} className="text-slate-400 hover:text-blue-600">
              {task.completed ? <CheckCircle2 className="text-green-500" /> : <Circle />}
            </button>
            <span className={`flex-1 ${task.completed ? "line-through text-slate-400" : "text-slate-700"}`}>
              {task.text}
            </span>
            <button onClick={() => deleteTask(task.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 size={18} />
            </button>
          </li>
        ))}
      </ul>

      {tasks.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
          <span>{tasks.filter(t => !t.completed).length} items left</span>
          <button onClick={clearCompleted} className="hover:text-red-600 underline">Clear completed</button>
        </div>
      )}
    </div>
  );
}