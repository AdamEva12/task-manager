import * as tasksApi from "../api/tasksApi";
import { useState, useEffect } from 'react'

export function useTasks(selectedProjectId, token) {
    const [tasks, setTasks] = useState([]);
    const [taskTitle, setTaskTitle] = useState("");
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editingTitle, setEditingTitle] = useState("");

    
    const loadTasks = async () => {
        if (selectedProjectId === null) {
            setTasks([]);
            return;
        };
        const data = await tasksApi.loadTasks(selectedProjectId, token);
        if (Array.isArray(data)) {
            setTasks(data);
        } else {
            setTasks([]);
        }
    };
    
    const updateTask = async (taskId) => {
        if (taskId === null || !editingTitle.trim()) return;
        const updatedTask = await tasksApi.updateTask(taskId, editingTitle, token);
        if (!updatedTask) return;
        setTasks(prev => prev.map(t => {
            return t.id === taskId ? { ...t, title: editingTitle } : t;
        }));
        setEditingTaskId(null);
        setEditingTitle('');
    };
    
    const deleteTask = async (taskId) => {
        const ok = await tasksApi.deleteTask(taskId, token);
        if (!ok) return;
        setTasks(prev => prev.filter(t => t.id !== taskId))
    };
    
    const createTaskInProject = async () => {
        if (selectedProjectId === null) return;
        if (!taskTitle.trim()) return;
        const createdTask = await tasksApi.createTaskInProject(selectedProjectId, taskTitle, token);
        if (!createdTask) return;
        if (Number(createdTask.projectId) === selectedProjectId) {
            setTasks(prev => [...prev, createdTask]);
        }
        setTaskTitle("");
    }
    
    useEffect(() => {
        if (!selectedProjectId || !token) {
            setTasks([]);
            return;
        }
        loadTasks();
    }, [selectedProjectId, token]);

    return {
        loadTasks,
        createTaskInProject,
        updateTask,
        deleteTask,
        taskTitle,
        setTaskTitle,
        tasks,
        editingTaskId,
        setEditingTitle,
        setEditingTaskId,
        editingTitle,
    }
}