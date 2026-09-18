import { Routes, Route } from 'react-router-dom';
import CustomerLayout from './components/CustomerLayout';
import VenueListPage from './pages/VenueListPage';
import VenueDetailPage from './pages/VenueDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import StaffLoginPage from './pages/staff/StaffLoginPage';
import StaffRegisterPage from './pages/staff/StaffRegisterPage';
import StaffDashboardPage from './pages/staff/StaffDashboardPage';
import ManageVenuesPage from './pages/staff/ManageVenuesPage';
import ManageAreasPage from './pages/staff/ManageAreasPage';
import ManageTablesPage from './pages/staff/ManageTablesPage';
import ManageTableTypesPage from './pages/staff/ManageTableTypesPage';
import ProtectedStaffRoute from './components/ProtectedStaffRoute';
import StaffLayout from './components/StaffLayout';
import ManageStaffPage from './pages/staff/ManageStaffPage';

function App() {
    return (
        <Routes>
            <Route element={<CustomerLayout />}>
                <Route path="/" element={<VenueListPage />} />
                <Route path="/venues/:venueId" element={<VenueDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/account" element={<AccountPage />} />
            </Route>

            <Route path="/staff/login" element={<StaffLoginPage />} />
            <Route path="/staff/register" element={<StaffRegisterPage />} />
            <Route
                path="/staff"
                element={
                    <ProtectedStaffRoute>
                        <StaffLayout />
                    </ProtectedStaffRoute>
                }
            >
                <Route index element={<StaffDashboardPage />} />
                <Route path="manage/venues" element={<ManageVenuesPage />} />
                <Route path="manage/venues/:venueId" element={<ManageAreasPage />} />
                <Route path="manage/areas/:areaId" element={<ManageTablesPage />} />
                <Route path="manage/table-types" element={<ManageTableTypesPage />} />
                <Route path="manage/staff" element={<ManageStaffPage />} />
            </Route>
        </Routes>
    );
}

export default App;