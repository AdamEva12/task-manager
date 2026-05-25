import * as authApi from "../api/authApi";
import {useState} from 'react'

export function useAuth() {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const register = async (email, password) => {
        setLoading(true);
        setError("");
        try {
            const data = await authApi.register(email, password);
            if (!data.token) {
                setError(data.error || "Registration failed");
                return;
            }
            localStorage.setItem("token", data.token);
            setToken(data.token);
        } catch (error) {
            setError("Registration failed");
        } finally {
            setLoading(false);
        }
    }

    const login = async (email, password) => {
        setLoading(true);
        setError("");
        try {
            const data = await authApi.login(email, password);
            if (!data.token) {
                setError(data.error || "Login failed");
                return;
            }
            localStorage.setItem("token", data.token);
            setToken(data.token);
        } catch (error) {
            setError("Login failed");
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setError("");
    };
    return {
        token,
        error,
        loading,
        register,
        login,
        logout,
    };
}