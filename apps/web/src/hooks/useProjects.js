import * as projectsApi from "../api/projectsApi";
import { useState } from 'react'

export function useProjects(token) {
    const [projects, setProjects] = useState([]);
    const [projectName, setProjectName] = useState("");
    const [description, setDescription] = useState("");
    const [prioridity, setPrioridity] = useState("");
    const [editingName, setEditingName] = useState("");
    const [editingProjectId, setEditingProjectId] = useState(null);

    const loadProjects = async () => {
        const data = await projectsApi.loadProjects(token);
        if (!data) return;
        setProjects(data);
    };

    const createProject = async () => {
        if (!projectName.trim()) return;
        const createdProject = await projectsApi.createProject(projectName, description, token);
        if (!createdProject) return;
        setProjects(prev => [...prev, createdProject]);
        setProjectName("");
        setDescription("");
    };

    const deleteProject = async (projectId) => {
        const ok = await projectsApi.deleteProject(projectId, token);
        if (!ok) return false;
        setProjects(prev => prev.filter(p => p.id !== projectId));
        return true;
    }

    const updateProject = async (projectId) => {
        if (projectId === null || !editingName.trim()) return;
        const updatedProject = await projectsApi.updateProject(projectId, editingName, token);
        if (!updatedProject) return;
        setProjects(prev => prev.map(p => {
            return p.id === projectId ? { ...p, name: updatedProject.name } : p;
        }));
        setEditingProjectId(null);
        setEditingName('');
    }
    return {
        projects,
        projectName,
        setProjectName,
        description,
        setDescription,
        prioridity,
        setPrioridity,
        loadProjects,
        createProject,
        deleteProject,
        updateProject,
        editingName,
        editingProjectId,
        setEditingName,
        setEditingProjectId,
    }
}