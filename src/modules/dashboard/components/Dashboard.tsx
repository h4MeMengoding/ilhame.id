import { useEffect, useState } from 'react';

import { useAuth } from '@/common/context/AuthContext';

import AdminOnlyMessage from './AdminOnlyMessage';
import BlogManager from './BlogManager';
import DashboardLayout from './DashboardLayout';
import ProjectsManager from './ProjectsManager';
import GalleryManager from '../../gallery/components/GalleryManager';
import UrlShortener from '../../urlshortener';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<
    'urls' | 'projects' | 'blogs' | 'gallery'
  >('urls');
  const { user } = useAuth();

  // Redirect non-admin users away from admin-only tabs
  useEffect(() => {
    if (
      (activeTab === 'projects' ||
        activeTab === 'blogs' ||
        activeTab === 'gallery') &&
      user?.role !== 'admin'
    ) {
      setActiveTab('urls');
    }
  }, [activeTab, user?.role]);

  const renderContent = () => {
    switch (activeTab) {
      case 'urls':
        return <UrlShortener />;
      case 'projects':
        return user?.role === 'admin' ? (
          <ProjectsManager />
        ) : (
          <AdminOnlyMessage />
        );
      case 'blogs':
        return user?.role === 'admin' ? <BlogManager /> : <AdminOnlyMessage />;
      case 'gallery':
        return user?.role === 'admin' ? (
          <GalleryManager />
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
