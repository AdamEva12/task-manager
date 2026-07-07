import { useRef, useEffect } from "react"
function ProjectsPanel({
    projects,
    projectName,
    setProjectName,
    description,
    setDescription,
    prioridity,
    setPrioridity,
    createProject,
    loadProjects,
    selectedProjectId,
    setSelectedProjectId,
    editingName,
    setEditingName,
    editingProjectId,
    setEditingProjectId,
    updateProject,
    handleProjectDelete
}) {
    const inputRef = useRef(null);
    useEffect(() => {
        if (editingProjectId !== null) {
            inputRef.current?.focus();
        }
    }, [editingProjectId]);
    return (
        <div>
            <div className="row">
                <input
                    className="input"
                    data-testid="project-input"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Project name"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            createProject();
                            return;
                        }

                        if (e.key === "Escape") {
                            setProjectName("");
                            e.currentTarget.blur();
                        }
                    }}
                />
                <button className="btn" onClick={createProject}>
                    Create
                </button>
                <button className="btn btnSecondary" onClick={loadProjects}>
                    Reload
                </button>
            </div>
                    <div className="row">
            <input
        className="input"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Project description (optional)"
    />
</div>
                    <div className="row">
            <input
        className="input"
        value={prioridity}
        onChange={(e) => setPrioridity(e.target.value)}
        placeholder="Project priority (optional)"
    />
</div>
            <h3 className="cardTitle">Projects</h3>

            {projects.length === 0 ? (
                <p className="hint">No projects yet</p>
            ) : (
                <ul className="list">
                    {projects.map((p) => (
                        <li
                            key={p.id}
                            data-testid={`project-item-${p.id}`}
                            className={`listItem ${p.id === selectedProjectId ? "selected" : ""}`}
                            onClick={() => setSelectedProjectId(p.id)}
                        >
                            {p.id !== editingProjectId ? (
                                <>
                                    <span className="itemMain">{p.name}</span>
                                    <span className="badge">id: {p.id}</span>

                                    <div className="actions">
                                        <button
                                            className="btn btnSecondary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingProjectId(p.id);
                                                setEditingName(p.name);
                                            }}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="btn btnDanger"
                                            data-testid={`delete-project-${p.id}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleProjectDelete(p.id);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <input
                                        className="input"
                                        ref={inputRef}
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") updateProject(p.id);
                                            if (e.key === "Escape") {
                                                setEditingProjectId(null);
                                                setEditingName("");
                                                e.currentTarget.blur();
                                            }
                                        }}
                                    />

                                    <div className="actions">
                                        <button className="btn" onClick={() => updateProject(p.id)}>
                                            Save
                                        </button>
                                        <button
                                            className="btn btnSecondary"
                                            onClick={() => {
                                                setEditingProjectId(null);
                                                setEditingName("");
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ProjectsPanel;