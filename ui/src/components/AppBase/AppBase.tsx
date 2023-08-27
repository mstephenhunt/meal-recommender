import React from 'react';

type AppBaseProps = {
  children: React.ReactNode;
};

export default function AppBase(props: AppBaseProps) {
  return <div>{props.children}</div>;
}
