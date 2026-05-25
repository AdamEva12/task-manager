import { useState } from "react"

function AuthPanel({
    onRegister,
    onLogin,
    loading,
    error,
}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    return (
        <div className="appShell">
            <div className="appContainer">

                <div className="panel">

                    <header className="appHeader">
                        <div className="appTitleBlock">
                            <h1>Task Manager</h1>
                            <p>Register or Login</p>
                        </div>
                    </header>

                    <form className="column">

                        <div className="field">
                            <label>Email</label>

                            <input
                                className="input"
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                disabled={loading}
                                onChange={(e) => setEmail(e.target.value)}
                                id="email"
                            />
                        </div>

                        <div className="field">
                            <label>Password</label>

                            <input
                                className="input"
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                disabled={loading}
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                            />
                        </div>

                        <div className="row authActions">
                            <button
                                className="btn"
                                type="button"
                                onClick={() => onRegister(email, password)}
                                disabled={loading}
                            >
                                Register
                            </button>

                            <button
                                className="btn btnSecondary"
                                type="button"
                                onClick={() => onLogin(email, password)}
                                disabled={loading}
                            >
                                {loading ? "Loading..." : "Login"}
                            </button>
                        </div>

                        {error && (
                            <div className="errorMessage">
                                {error}
                            </div>
                        )}

                    </form>

                </div>
            </div>
        </div>
    )
}

export default AuthPanel;