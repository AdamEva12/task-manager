import { API_BASE_URL } from "./baseUrl";

export async function loadTasks(projectId, token) {
    const res = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    });
    if (!res.ok) return null
    return await res.json();
};


export async function createTaskInProject(projectId, title, token) {
    const res = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title })
    });
    if (!res.ok) return null;
    return await res.json();
}

export async function updateTask(taskId, title, token) {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "PATCH",
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title })
    })
    if (!res.ok) return null;
    return await res.json();
};

export async function deleteTask(taskId, token) {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, { 
        method: "DELETE",
        headers: { 
            Authorization: `Bearer ${token}`
        },
    });
    if (!res.ok) return false;
    return true;
};