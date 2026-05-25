import { API_BASE_URL } from "./baseUrl";

export async function loadProjects(token) {
    const res = await fetch(`${API_BASE_URL}/projects`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }
    });
    if (!res.ok) return null;
    return await res.json();
};

export async function createProject(name, token) {
    const res = await fetch(`${API_BASE_URL}/projects`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name }),
    });
    if (!res.ok) return null;
    return await res.json();
};

export async function deleteProject(projectId, token) {
    const res = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
    if (!res.ok) return false;
    return true;
}

export async function updateProject(projectId, name, token) {
    const res = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name })
    })
    if (!res.ok) return null;
    return await res.json();
}