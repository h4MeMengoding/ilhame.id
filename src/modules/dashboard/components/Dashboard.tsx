import { useState } from 'react';

import { useAuth } from '@/common/context/AuthContext';

import AdminOnlyMessage from './AdminOnlyMessage';
import BlogManager from './BlogManager';
import DashboardLayout from './DashboardLayout';
import ProjectsManager from './ProjectsManager';
import GalleryManager from '../../gallery/components/GalleryManager';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'blogs' | 'gallery'>(
    'projects',
  );
  const { user } = useAuth();

  const renderContent = () => {
    if (user?.role !== 'admin') {
      return <AdminOnlyMessage />;
    }

    switch (activeTab) {
      case 'projects':
        return <ProjectsManager />;
      case 'blogs':
        return <BlogManager />;
      case 'gallery':
        return <GalleryManager />;
      default:
        return <ProjectsManager />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default Dashboard;
