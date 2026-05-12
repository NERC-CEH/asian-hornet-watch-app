import { FC } from 'react';
import { observer } from 'mobx-react';
import { Page, Header, useToast } from '@flumens';
import { AppModel } from 'models/app';
import SavedSamples from 'models/collections/samples';
import { UserModel } from 'models/user';
import Main from './Main';

function onToggle(appModel: any, setting: string, checked: boolean) {
  appModel.data[setting] = checked;
  appModel.save();
}

type Props = {
  savedSamples: typeof SavedSamples;
  appModel: AppModel;
  userModel: UserModel;
};

const MenuController: FC<Props> = ({ savedSamples, appModel, userModel }) => {
  const toast = useToast();

  const { sendAnalytics, training } = appModel.data;

  const onToggleWrap = (settings: string, checked: boolean) =>
    onToggle(appModel, settings, checked);

  const resetApp = async () => {
    console.log('Settings:Menu:Controller: resetting the application!', 'w');

    try {
      await savedSamples.resetDefaults();
      await appModel.resetDefaults();
      await userModel.resetDefaults();
      toast.success('Done');
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
      }
    }
  };

  return (
    <Page id="settings">
      <Header title="Settings" />
      <Main
        resetApp={resetApp}
        sendAnalytics={sendAnalytics}
        useTraining={training}
        onToggle={onToggleWrap}
      />
    </Page>
  );
};

export default observer(MenuController);
