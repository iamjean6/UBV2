import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAdminAuth';

export function ProtectedRoute({ children }) {
    const { user, hasAccess, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!user) {
        // Redirect to admin login if not authenticated
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    // Check path-based access
    if (!hasAccess(location.pathname)) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
                <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100 max-w-md">
                    <div className="text-5xl mb-6">🔒</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h3>
                    <p className="text-gray-600 mb-6">
                        Your account ({user.role}) doesn't have permissions to access this specific module. 
                    </p>
                    <button 
                        onClick={() => window.history.back()}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return children;
}
