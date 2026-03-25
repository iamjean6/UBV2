import { createContext, useContext, useState, useEffect } from 'react';

export const ROLES = {
    SUPER_ADMIN: 'superadmin',
    ADMIN: 'admin',
};

// Use relative path for production (proxied through nginx), fallback to localhost for dev
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('adminUser');
        const token = localStorage.getItem('adminToken');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();

            if (result.status === 'success') {
                const userData = {
                    id: result.data.id,
                    name: result.data.username,
                    role: result.data.role
                };
                setUser(userData);
                localStorage.setItem('adminToken', result.token);
                localStorage.setItem('adminUser', JSON.stringify(userData));
                return { success: true, role: result.data.role };
            } else {
                return { success: false, message: result.message };
            }
        } catch (error) {
            console.error('Login Error:', error);
            return { success: false, message: 'An error occurred during login' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
    };

    const hasAccess = (path) => {
        if (!user) return false;
        // Superadmin has access to everything
        if (user.role === ROLES.SUPER_ADMIN) return true;
        
        // Admin permissions: Restrict activity logs and other superadmin only stuff
        if (user.role === ROLES.ADMIN) {
            if (path.includes('activities')) return false;
            return true;
        }
        
        return false;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, hasAccess, ROLES, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
