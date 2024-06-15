import React, { useState, useEffect } from 'react';
import { RouteProps, Navigate, useLocation } from 'react-router-dom';
import { useLoginUserStore } from 'stores';
import { Myalert } from 'components/alert';

type ProtectedRouteProps = RouteProps & {
  children: JSX.Element;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { loginUser } = useLoginUserStore();
  const location = useLocation();
  const [alertShown, setAlertShown] = useState(false);

  useEffect(() => {
    if (!loginUser && !alertShown) {
        Myalert("warning", "로그인 안내", "로그인 후 접근할 수 있는 페이지 이므로, 로그인 페이지로 이동했습니다.", "확인")
      setAlertShown(true);
    }
  }, [loginUser, alertShown]);

  if (!loginUser) {
    return <Navigate to="/auth/signin" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
