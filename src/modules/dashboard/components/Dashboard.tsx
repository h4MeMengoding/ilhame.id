import { useEffect, useState } from 'react';

import { useAuth } from '@/common/context/AuthContext';

import AdminOnlyMessage from './AdminOnlyMessage';
import DashboardLayout from './DashboardLayout';
import ProjectsManager from './ProjectsManager';
import UrlShortener from '../../urlshortener';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'urls' | 'projects'>('urls');
  const { user } = useAuth();

  // Redirect non-admin users away from projects tab
  useEffect(() => {
    if (activeTab === 'projects' && user?.role !== 'admin') {
      setActiveTab('urls');
    }
  }, [activeTab, user?.role]);

  const renderContent = () => {
    switch (activeTab) {
      case 'urls':
        return <UrlShortener />;
      case 'projects':
        // Double check: only render ProjectsManager for admin, show message for others
        return user?.role === 'admin' ? (
          <ProjectsManager />
        ) : (
          <AdminOnlyMessage />
        );
      default:
        return <UrlShortener />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default Dashboard;
