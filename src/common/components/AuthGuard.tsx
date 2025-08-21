import { ReactNode } from 'react';

import useTokenExpiry from '@/common/hooks/useTokenExpiry';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  // This hook will handle automatic logout on token expiry
  useTokenExpiry();

  return <>{children}</>;
};

export default AuthGuard;
