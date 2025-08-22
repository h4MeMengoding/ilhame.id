import { useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  FiEdit,
  FiEye,
  FiEyeOff,
  FiFolder,
  FiPlus,
  FiRefreshCw,
  FiStar,
  FiTrash2,
} from 'react-icons/fi';
import useSWR from 'swr';

import Card from '@/common/components/elements/Card';
import SectionHeading from '@/common/components/elements/SectionHeading';
import SectionSubHeading from '@/common/components/elements/SectionSubHeading';
import { ProjectItemProps } from '@/common/types/projects';
import { fetcher } from '@/services/fetcher';

import ProjectForm from './ProjectForm';

const ProjectsManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItemProps | null>(
    null,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cacheKey, setCacheKey] = useState(Date.now());

  const { data, isLoading, mutate } = useSWR(
    `/api/projects?t=${cacheKey}`,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 0, // Disable deduping to always fetch fresh data
      refreshInterval: 0, // Disable auto refresh
      revalidateIfStale: true,
      revalidateOnMount: true,
    },
  );

  const projects: ProjectItemProps[] = data?.data || [];

  const handleCreateProject = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleEditProject = (project: ProjectItemProps) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProject(null);

    // Update cache key to force fresh data
    setCacheKey(Date.now());

    // Force aggressive refresh data from server
    mutate(undefined, {
      revalidate: true,
      rollbackOnError: false,
      populateCache: false,
    });
    toast.success(
      editingProject
        ? 'Project updated successfully!'
        : 'Project created successfully!',
    );
  };

  const handleHardSync = async () => {
    setIsRefreshing(true);
    try {
      // Update cache key to force fresh data
      setCacheKey(Date.now());

      // Force complete cache invalidation and fresh fetch
      await mutate(undefined, {
        revalidate: true,
        rollbackOnError: false,
        populateCache: false,
        optimisticData: undefined,
      });
      toast.success('Projects synchronized successfully!');
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Failed to synchronize projects');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleToggleVisibility = async (
    projectId: number,
    currentVisibility: boolean,
  ) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          is_show: !currentVisibility,
        }),
      });

      if (response.ok) {
        // Force immediate data refresh with optimistic update
        const updatedProjects = projects.map((project) =>
          project.id === projectId
            ? { ...project, is_show: !currentVisibility }
            : project,
        );

        // Update with optimistic data first
        mutate({ data: updatedProjects }, false);

        // Then revalidate from server
        await mutate();

        toast.success(
          `Project ${!currentVisibility ? 'shown' : 'hidden'} successfully!`,
        );
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update project');
      }
    } catch (error) {
      console.error('Toggle visibility error:', error);
      toast.error('Failed to update project visibility');
      // Revalidate to ensure UI consistency
      mutate();
    }
  };

  const handleToggleFeatured = async (
    projectId: number,
    currentFeatured: boolean,
  ) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          is_featured: !currentFeatured,
        }),
      });

      if (response.ok) {
        // Force immediate data refresh with optimistic update
        const updatedProjects = projects.map((project) =>
          project.id === projectId
            ? { ...project, is_featured: !currentFeatured }
            : project,
        );

        // Update with optimistic data first
        mutate({ data: updatedProjects }, false);

        // Then revalidate from server
        await mutate();

        toast.success(
          `Project ${!currentFeatured ? 'featured' : 'unfeatured'} successfully!`,
        );
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update project');
      }
    } catch (error) {
      console.error('Toggle featured error:', error);
      toast.error('Failed to update project featured status');
      // Revalidate to ensure UI consistency
      mutate();
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.ok) {
        // Optimistically remove the project from UI
        const updatedProjects = projects.filter(
          (project) => project.id !== projectId,
        );
        mutate({ data: updatedProjects }, false);

        // Then revalidate from server
        await mutate();

        toast.success('Project deleted successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Delete project error:', error);
      toast.error('Failed to delete project');
      // Revalidate to ensure UI consistency
      mutate();
    }
  };

  if (showForm) {
    return (
      <ProjectForm
        key={editingProject?.id || 'new'}
        project={editingProject}
        onSuccess={handleFormSuccess}
        onCancel={handleCloseForm}
      />
    );
  }

  return (
    <div className='space-y-4 sm:space-y-6'>
      <div className='flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
        <div>
          <SectionHeading title='Projects Management' />
          <SectionSubHeading>Manage your portfolio projects</SectionSubHeading>
        </div>
        <div className='flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0'>
          <button
            onClick={handleHardSync}
            disabled={isRefreshing}
            className='flex w-full items-center justify-center space-x-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 sm:w-auto'
          >
            <FiRefreshCw
              className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            <span>{isRefreshing ? 'Syncing...' : 'Hard Sync'}</span>
          </button>
          <button
            onClick={handleCreateProject}
            className='flex w-full items-center justify-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 sm:w-auto'
          >
            <FiPlus className='h-4 w-4' />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className='flex justify-center py-8'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600'></div>
        </div>
      ) : (
        <div className='grid gap-3 sm:gap-4'>
          {projects.map((project) => (
            <Card key={project.id} className='p-4 sm:p-6'>
              <div className='flex flex-col space-y-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0'>
                <div className='min-w-0 flex-1'>
                  <div className='flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0'>
                    <h3 className='text-base font-semibold text-neutral-900 dark:text-white sm:text-lg'>
                      {project.title}
                    </h3>
                    <div className='flex items-center space-x-2'>
                      {project.is_featured && (
                        <FiStar className='h-4 w-4 text-yellow-500' />
                      )}
                      {!project.is_show && (
                        <span className='rounded-full bg-red-100 px-2 py-1 text-xs text-red-800 dark:bg-red-900 dark:text-red-300'>
                          Hidden
                        </span>
                      )}
                    </div>
                  </div>
                  <p className='mt-1 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400'>
                    {project.description}
                  </p>
                  <div className='mt-2 flex flex-wrap gap-1 sm:gap-2'>
                    {(() => {
                      try {
                        const stacks = JSON.parse(project.stacks || '[]');
                        return Array.isArray(stacks)
                          ? stacks
                              .slice(0, 3)
                              .map((stack: string, index: number) => (
                                <span
                                  key={index}
                                  className='rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                                >
                                  {stack}
                                </span>
                              ))
                          : [];
                      } catch (error) {
                        return [];
                      }
                    })()}
                  </div>
                </div>

                {/* Mobile Action Buttons */}
                <div className='flex items-center justify-end space-x-1 sm:hidden'>
                  <button
                    onClick={() => handleEditProject(project)}
                    className='rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
                    title='Edit project'
                  >
                    <FiEdit className='h-4 w-4' />
                  </button>
                  <button
                    onClick={() =>
                      handleToggleVisibility(project.id!, project.is_show)
                    }
                    className='rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
                    title={project.is_show ? 'Hide project' : 'Show project'}
                  >
                    {project.is_show ? (
                      <FiEye className='h-4 w-4' />
                    ) : (
                      <FiEyeOff className='h-4 w-4' />
                    )}
                  </button>
                  <button
                    onClick={() =>
                      handleToggleFeatured(project.id!, project.is_featured)
                    }
                    className={`rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                      project.is_featured
                        ? 'text-yellow-500 hover:text-yellow-600'
                        : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                    }`}
                    title={
                      project.is_featured
                        ? 'Remove from featured'
                        : 'Add to featured'
                    }
                  >
                    <FiStar className='h-4 w-4' />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id!)}
                    className='rounded-lg p-2 text-red-600 hover:bg-red-100 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900 dark:hover:text-red-300'
                    title='Delete project'
                  >
                    <FiTrash2 className='h-4 w-4' />
                  </button>
                </div>

                {/* Desktop Action Buttons */}
                <div className='hidden items-center space-x-2 sm:flex'>
                  <button
                    onClick={() => handleEditProject(project)}
                    className='rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
                    title='Edit project'
                  >
                    <FiEdit className='h-4 w-4' />
                  </button>
                  <button
                    onClick={() =>
                      handleToggleVisibility(project.id!, project.is_show)
                    }
                    className='rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
                    title={project.is_show ? 'Hide project' : 'Show project'}
                  >
                    {project.is_show ? (
                      <FiEye className='h-4 w-4' />
                    ) : (
                      <FiEyeOff className='h-4 w-4' />
                    )}
                  </button>
                  <button
                    onClick={() =>
                      handleToggleFeatured(project.id!, project.is_featured)
                    }
                    className={`rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                      project.is_featured
                        ? 'text-yellow-500 hover:text-yellow-600'
                        : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                    }`}
                    title={
                      project.is_featured
                        ? 'Remove from featured'
                        : 'Add to featured'
                    }
                  >
                    <FiStar className='h-4 w-4' />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id!)}
                    className='rounded-lg p-2 text-red-600 hover:bg-red-100 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900 dark:hover:text-red-300'
                    title='Delete project'
                  >
                    <FiTrash2 className='h-4 w-4' />
                  </button>
                </div>
              </div>
            </Card>
          ))}
          {projects.length === 0 && (
            <Card className='p-6 text-center sm:p-8'>
              <FiFolder className='mx-auto h-10 w-10 text-neutral-400 sm:h-12 sm:w-12' />
              <h3 className='mt-3 text-base font-medium text-neutral-900 dark:text-white sm:mt-4 sm:text-lg'>
                No projects yet
              </h3>
              <p className='mt-2 text-sm text-neutral-600 dark:text-neutral-400 sm:text-base'>
                Create your first project to get started.
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectsManager;
