import { FC } from 'react';
import { observer } from 'mobx-react';
import { InfoBackgroundMessage } from '@flumens';
import appModel, { Attrs } from 'models/app';

type Props = {
  name?: keyof Attrs;
  children: any;
};

const Message: FC<Props> = ({ name, children, ...props }) => {
  if (name && !appModel.data[name]) {
    return null;
  }

  const hideMessage = () => {
    (appModel.data as any)[name as keyof Attrs] = false;
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
