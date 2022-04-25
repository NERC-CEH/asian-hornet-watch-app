import React, { FC } from 'react';
import savedSamples from 'models/savedSamples';
import { UserModel } from 'models/user';
import { AppModel } from 'models/app';
import { Page, Header, useToast } from '@flumens';
import { observer } from 'mobx-react';
import Main from './Main';

function onToggle(appModel: any, setting: string, checked: boolean) {
  appModel.attrs[setting] = checked; // eslint-disable-line
  appModel.save();
}

type Props = {
  savedSamples: typeof savedSamples;
  appModel: AppModel;
  userModel: UserModel;
};

const MenuController: FC<Props> = ({ savedSamples, appModel, userModel }) => {
  const toast = useToast();

  const { sendAnalytics, training } = appModel.attrs;

  const onToggleWrap = (settings: string, checked: boolean) => {
    return onToggle(appModel, settings, checked);
  };

  const resetApp = async () => {
    console.log('Settings:Menu:Controller: resetting the application!', 'w');

    try {
      await savedSamples.resetDefaults();
      await appModel.resetDefaults();
      await userModel.resetDefaults();
      toast.success('Done');
    } catch (e) {
      if (e instanceof Error) {
        toast.error(`${e.message}`);
      }
    }
  };

  return (
    <Page id="settings">
      <Header title="Settings" />
      <Main
        resetApp={resetApp}
        sendAnalytics={sendAnalytics}
        training={training}
        onToggle={onToggleWrap}
      />
    </Page>
  );
};

export default observer(MenuController);
