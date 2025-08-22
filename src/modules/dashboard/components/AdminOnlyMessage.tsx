import { FiShield } from 'react-icons/fi';

import Card from '@/common/components/elements/Card';

const AdminOnlyMessage = () => {
  return (
    <Card className='p-6 text-center sm:p-8'>
      <FiShield className='mx-auto h-10 w-10 text-red-400 sm:h-12 sm:w-12' />
      <h3 className='mt-3 text-base font-medium text-neutral-900 dark:text-white sm:mt-4 sm:text-lg'>
        Admin Access Required
      </h3>
      <p className='mt-2 text-sm text-neutral-600 dark:text-neutral-400 sm:text-base'>
        You need administrator privileges to access project management features.
      </p>
      <div className='mt-4 text-xs text-neutral-500 dark:text-neutral-400 sm:text-sm'>
        Contact your administrator if you need access to this feature.
      </div>
    </Card>
  );
};

export default AdminOnlyMessage;
