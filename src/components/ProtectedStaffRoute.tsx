import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useStaffAuth } from '../context/StaffAuthContext';

function ProtectedStaffRoute({ children }: { children: ReactNode }) {
    const { staffToken } = useStaffAuth();

    if (!staffToken) {
        return <Navigate to="/staff/login" replace />;
    }

    return <>{children}</>;
}

export default ProtectedStaffRoute;