import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type AppBaseProps = {
  children: React.ReactNode;
  isLoggedIn: boolean;
};

export default function AppBase(props: AppBaseProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!props.isLoggedIn) {
      navigate('/');
    }
  }, [navigate, props.isLoggedIn]);

  return <div>{props.children}</div>;
}
