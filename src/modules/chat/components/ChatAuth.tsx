import clsx from 'clsx';
import Link from 'next/link';
import { FiLogIn as LoginIcon } from 'react-icons/fi';

import Button from '@/common/components/elements/Button';

const ChatAuth = ({ isWidget = false }: { isWidget?: boolean }) => {
  return (
    <div className='flex flex-col border-t border-neutral-300 py-1 dark:border-neutral-900'>
      <div className='mb-1 space-y-5 px-4 py-3 text-center text-neutral-700 dark:text-neutral-400'>
        <p className='text-sm'>
          Please log in to start chatting, don't worry, your data is safe.
        </p>
        <div
          className={clsx(
            'flex flex-col items-center justify-center gap-4 lg:flex-row lg:gap-5',
            isWidget && '!flex-col !gap-4',
          )}
        >
          <Link href='/login'>
            <Button
              className={`flex w-full items-center justify-center border bg-blue-600 py-2.5 text-white shadow-sm transition duration-300 hover:scale-[101%] hover:bg-blue-700 lg:w-fit ${isWidget && '!w-full'}`}
              data-umami-event='Login untuk Chat'
            >
              <LoginIcon size={18} className='mr-2' />
              <span>Login to Chat</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChatAuth;
