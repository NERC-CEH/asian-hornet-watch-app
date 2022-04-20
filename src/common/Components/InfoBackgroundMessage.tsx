import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { InfoBackgroundMessage } from '@flumens';
import appModel, { Attrs } from 'models/app';

interface Props {
  name?: any;
  children: any;
}

const Message: FC<Props> = ({ name, children, ...props }) => {
  if (name) {
    return null;
  }

  const hideMessage = () => {
    (appModel.attrs as any)[name as keyof Attrs] = false;
    return {};
  };

  const onHide = name ? hideMessage : undefined;

  return (
    <InfoBackgroundMessage onHide={onHide} {...props}>
      {children}
    </InfoBackgroundMessage>
  );
};

export default observer(Message);
