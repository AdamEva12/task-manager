import { useState, useEffect } from 'react';
import { useProjects } from "./hooks/useProjects";
import { useTasks } from "./hooks/useTasks"
import TasksPanel from "./components/TasksPanel"
import ProjectsPanel from "./components/ProjectsPanel";
import AuthPanel from "./components/AuthPanel"
import { useAuth } from "./hooks/useAuth";
import './App.css'

function App() {
  const auth = useAuth();
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const projectsState = useProjects(auth.token);
  const tasksState = useTasks(selectedProjectId, auth.token);

  useEffect(() => {
    if (auth.token) {
      projectsState.loadProjects();
    }
  }, [auth.token]);

  if (!auth.token) {
    return (
      <AuthPanel
        onRegister={auth.register}
        onLogin={auth.login}
        loading={auth.loading}
        error={auth.error}
      />
    );
  }


  const selectedProject = projectsState.projects.find(
    p => p.id === selectedProjectId
  );

  const handleLogout = () => {
    setSelectedProjectId(null);
    auth.logout();
  };

  const handleProjectDelete = async (projectId) => {
    const ok = await projectsState.deleteProject(projectId);
    if (!ok) return;

    if (selectedProjectId === projectId) {
      setSelectedProjectId(null);
    }
  };

  return (
    <div className="appShell">
      <div className="appContainer">
        <div className="appHeader">
          <div className="appTitleBlock">
            <h1>Task Manager</h1>
            <p>Projects & Tasks MVP</p>
          </div>

          <div className="statusBar">
            {selectedProjectId === null
              ? "No project selected"
              : `Selected: ${selectedProject?.name}`}
          </div>
          <button
            className="btn btnSecondary"
            onClick={handleLogout}
          >Logout</button>
        </div>

        <div className="appLayout">
          <section className="panel">
            <ProjectsPanel
              projects={projectsState.projects}
              projectName={projectsState.projectName}
              setProjectName={projectsState.setProjectName}
              description={projectsState.description}
              setDescription={projectsState.setDescription}
              prioridity={projectsState.prioridity}
              setPrioridity={projectsState.setPrioridity}
              createProject={projectsState.createProject}
              loadProjects={projectsState.loadProjects}
              selectedProjectId={selectedProjectId}
              setSelectedProjectId={setSelectedProjectId}
              editingName={projectsState.editingName}
              setEditingName={projectsState.setEditingName}
              editingProjectId={projectsState.editingProjectId}
              setEditingProjectId={projectsState.setEditingProjectId}
              deleteProject={projectsState.deleteProject}
              updateProject={projectsState.updateProject}
              handleProjectDelete={handleProjectDelete}
            />
          </section>

          <section className="panel">
            <TasksPanel
              selectedProjectId={selectedProjectId}
              tasks={tasksState.tasks}
              taskTitle={tasksState.taskTitle}
              setTaskTitle={tasksState.setTaskTitle}
              taskPrioridity={tasksState.taskPrioridity}
              setTaskPrioridity={tasksState.setTaskPrioridity}
              createTaskInProject={tasksState.createTaskInProject}
              editingTaskId={tasksState.editingTaskId}
              setEditingTaskId={tasksState.setEditingTaskId}
              editingTitle={tasksState.editingTitle}
              setEditingTitle={tasksState.setEditingTitle}
              updateTask={tasksState.updateTask}
              deleteTask={tasksState.deleteTask}
            />
          </section>
        </div>
      </div>
    </div>
  );
}

export default App
