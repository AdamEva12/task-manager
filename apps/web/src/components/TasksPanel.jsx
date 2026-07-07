import { useRef, useEffect } from "react"
function TasksPanel({
    selectedProjectId,
    tasks,
    taskTitle,
    setTaskTitle,
    taskPrioridity,
    setTaskPrioridity,
    createTaskInProject,
    editingTaskId,
    setEditingTaskId,
    editingTitle,
    setEditingTitle,
    updateTask,
    deleteTask
}) {
    const inputRef = useRef(null);
    useEffect(() => {
        if (editingTaskId !== null) {
            inputRef.current?.focus();
        }
    }, [editingTaskId]);
    return (
        <div>
            {selectedProjectId !== null && (
                <div className="row">
                    <input
                        className="input"
                        data-testid="task-input"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        placeholder="Task name"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                createTaskInProject();
                                return;
                            }

                            if (e.key === "Escape") {
                                setTaskTitle("");
                                e.currentTarget.blur();
                            }
                        }}
                    />
                    <input
                        className="input"
                        value={taskPrioridity}
                        onChange={(e) => setTaskPrioridity(e.target.value)}
                        placeholder="Priority"
                        style={{ marginLeft: '8px', width: '120px' }}
                    />
                    <button className="btn" onClick={createTaskInProject}>
                        Create task
                    </button>
                </div>
            )}

            <h3 className="cardTitle">Tasks</h3>

            {selectedProjectId === null && <p className="hint">Select a project</p>}

            {selectedProjectId !== null && tasks.length === 0 && (
                <p className="hint">No tasks yet</p>
            )}

            {selectedProjectId !== null && tasks.length !== 0 && (
                <ul className="list">
                    {tasks.map((t) => (
                        <li key={t.id} className="listItem">
                            {t.id !== editingTaskId ? (
                                <>
                                    <span className="itemMain">{t.title}</span>
                                    {t.prioridity && <span className="badge">{t.prioridity}</span>}

                                    <div className="actions">
                                        <button
                                            className="btn btnSecondary"
                                            onClick={() => {
                                                setEditingTaskId(t.id);
                                                setEditingTitle(t.title);
                                            }}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="btn btnDanger"
                                            onClick={() => {
                                                deleteTask(t.id);
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
                                        value={editingTitle}
                                        onChange={(e) => setEditingTitle(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") updateTask(t.id);
                                            if (e.key === "Escape") {
                                                setEditingTaskId(null);
                                                setEditingTitle("");
                                                e.currentTarget.blur();
                                            }
                                        }}
                                    />

                                    <div className="actions">
                                        <button
                                            className="btn"
                                            onClick={() => {
                                                updateTask(t.id);
                                            }}
                                        >
                                            Save
                                        </button>

                                        <button
                                            className="btn btnSecondary"
                                            onClick={() => {
                                                setEditingTaskId(null);
                                                setEditingTitle("");
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
};

export default TasksPanel;