import clsx from 'clsx';
import { HiOutlineLogout as SignOutIcon } from 'react-icons/hi';

import { useAuth } from '@/common/context/AuthContext';

const ChatUserInfo = ({ isWidget = false }: { isWidget?: boolean }) => {
  const { user, logout } = useAuth();

  const userName = user?.name ?? user?.email?.split('@')[0] ?? null;
  const userEmail = user?.email ?? null;

  return user ? (
    <div
      className={clsx(
        'flex flex-col items-start gap-2 px-4 pb-3 text-sm md:flex-row md:items-center',
        isWidget && 'text-xs',
      )}
    >
      <div className='flex flex-wrap gap-1 text-neutral-500'>
        <p>Masuk sebagai</p>
        <p className='font-medium'>{userName}</p>
        <p>({userEmail})</p>
      </div>
      {!isWidget && (
        <>
          <div className='hidden text-neutral-500 md:block'>•</div>
          <div
            onClick={() => logout()}
            className='flex cursor-pointer items-center gap-1 font-medium text-red-500'
            data-umami-event='Keluar Dari Halaman Chat'
          >
            <SignOutIcon size={16} className='cursor-pointer text-red-500' />
            <span>Keluar</span>
          </div>
        </>
      )}
    </div>
  ) : null;
};

export default ChatUserInfo;
