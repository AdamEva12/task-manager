const express = require("express");
const cors = require("cors");
const { createTasksRouter } = require("./routes/tasks");
const { createProjectRouter } = require("./routes/projects");
const { errorHandler } = require("./middlewares/errorHandler");
const { createProjectRepo } = require("./repositories/projectRepo")
const {createTaskRepo} = require("./repositories/taskRepo")
const {createAuthRouter} = require("./routes/auth")


function createApp(prisma) {
  const app = express();
  const projectRepo = createProjectRepo(prisma);
  const taskRepo = createTaskRepo(prisma);

  app.use(cors());
  app.use(express.json());

  app.get("/health", (req, res) => {
    res.json({ ok: true });
  });
  app.use("/auth", createAuthRouter(prisma));
  app.use("/projects", createProjectRouter(projectRepo, taskRepo));
  app.use("/tasks", createTasksRouter(taskRepo));
  app.use(errorHandler)

  return app;
}

module.exports = { createApp };