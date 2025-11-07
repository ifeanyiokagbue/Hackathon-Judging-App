import React from 'react';
import { HackathonProvider, useHackathon } from './context/HackathonContext';
import MainDashboard from './components/MainDashboard';
import LoginScreen from './components/LoginScreen';

const AppContent: React.FC = () => {
    const { userRole } = useHackathon();
    
    if (!userRole || userRole === 'public') {
        const isPublicDirectView = userRole === 'public';
        return <LoginScreen isPublicDirectView={isPublicDirectView} />;
    }
    
    return <MainDashboard />;
};


const App: React.FC = () => {
    return (
        <HackathonProvider>
            <AppContent />
        </HackathonProvider>
    );
};

export default App;
