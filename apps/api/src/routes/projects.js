const express = require("express");
const { createError } = require("../utils/createError");

function createProjectRouter(projectRepo, taskRepo) {
    const router = express.Router();

    router.get("/", async (req, res, next) => {
        try {
            const projects = await projectRepo.getAll(req.userId);
            return res.json(projects);
        } catch (error) {
            console.error("GET /projects failed:", error);
            next(error);
        }
    });

    router.post("/", async (req, res, next) => {
        const { name, description,prioridity } = req.body
        if (typeof name !== "string") {
            return next(createError("Name is required", 400));
        }

        const cleanName = name.trim();

        if (!cleanName) {
            return next(createError("Name is required", 400));
        }
        try {
            const created = await projectRepo.create(cleanName, description,prioridity, req.userId);
            return res.status(201).json(created)
        } catch (error) {
            console.error("POST /projects failed:", error);
            next(error)
        }
    })

    router.delete("/:id", async (req, res, next) => {
        const projectId = Number(req.params.id);
        if (isNaN(projectId)) {
            return next(createError("Invalid project id", 400));
        }
        try {
            const deleted = await projectRepo.deleteById(projectId, req.userId)
            if(deleted.count === 0){
                return next(createError("Project not found", 404));
            }
            return res.status(204).send()
        } catch (error) {
            if (error.code === "P2025") {
                return next(createError("Project not found", 404));
            }
            console.error("DELETE /projects failed:", error);
            next(error)
        }
    })

    router.patch("/:id", async (req, res, next) => {
    const updatingProjectId = Number(req.params.id);
    const { name } = req.body;

    if (Number.isNaN(updatingProjectId)) {
        return next(createError("Invalid project id", 400));
    }

    if (typeof name !== "string") {
        return next(createError("Name is required", 400));
    }

    const cleanName = name.trim();

    if (!cleanName) {
        return next(createError("Name is required", 400));
    }

    try {
        const updated = await projectRepo.updateById(
            updatingProjectId,
            cleanName,
            req.userId
        );

        if (updated.count === 0) {
            return next(createError("Project not found", 404));
        }

        const updatedProject = await projectRepo.findById(
            updatingProjectId,
            req.userId
        );

        return res.status(200).json(updatedProject);
    } catch (error) {
        console.error("PATCH /projects failed:", error);
        next(error);
    }
});
    router.patch("/:id", async (req, res, next) => {
        const updatingProjectId = Number(req.params.id);
        const { name } = req.body;
        if (typeof name !== "string") {
            next(createError("Name is required", 400))
        }
        const cleanName = name.trim();
        if (!cleanName) {
            next(createError("Name is required", 400))
        }
        if (isNaN(updatingProjectId)) {
            return next(createError("Invalid project id", 400))
        }
        try {
            const updated = await projectRepo.updateById(updatingProjectId, cleanName, req.userId)
            if(updated.count === 0){
                return next(createError("Project not found", 404));
            }
            const updatedProject = await projectRepo.findById(updatingProjectId, req.userId)
            return res.status(200).json(updatedProject);
        } catch (error) {
            if (error.code === "P2025") {
                return next(createError("Project not found", 404));
            }
            console.error("PATCH /projects failed:", error);
            next(error);
        }
    })

    router.post("/:projectId/tasks", async (req, res, next) => {
        const projectIdForTasks = Number(req.params.projectId);
        const { title, prioridity } = req.body;
        if (typeof title !== 'string') {
            return next(createError("Title is required", 400))
        }
        const cleanTitle = title.trim();
        if (!cleanTitle) {
            return next(createError("Title is required", 400))
        }
        if (isNaN(projectIdForTasks)) {
            return next(createError("Invalid project id", 400))
        }
        try {
            const project = await projectRepo.findById(projectIdForTasks, req.userId)
            if (!project) return next(createError("Project not found", 404))
            const createdTask = await taskRepo.createInProject(cleanTitle, prioridity, projectIdForTasks, req.userId)
            return res.status(201).json(createdTask)
        } catch (error) {
            console.error("POST /tasks failed:", error);
            next(error)
        }
    })

    router.get("/:projectId/tasks", async (req, res, next) => {
        const projectId = Number(req.params.projectId);
        if (isNaN(projectId)) {
            return next(createError("Invalid project id", 400))
        }
        try {
            const project = await projectRepo.findById(projectId, req.userId);
            if (!project) return next(createError("Project not found", 404))
            const tasks = await taskRepo.findByProject(projectId, req.userId)
            return res.json(tasks)
        } catch (error) {
            console.error("GET /projects/:projectId/tasks failed:", error);
            next(error)
        }
    })

    return router;
}

module.exports = { createProjectRouter };