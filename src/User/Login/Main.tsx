import { useState } from 'react';
import clsx from 'clsx';
import {
  keyOutline,
  eyeOutline,
  eyeOffOutline,
  mailOutline,
} from 'ionicons/icons';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Trans as T } from 'react-i18next';
import { TypeOf } from 'zod';
import { Main, Button } from '@flumens';
import { zodResolver } from '@hookform/resolvers/zod';
import { IonIcon, IonRouterLink } from '@ionic/react';
import { UserModel } from 'models/user';
import ControlledInput from '../common/Components/ControlledInput';

type Details = TypeOf<typeof UserModel.loginSchema>;

type Props = {
  onSubmit: SubmitHandler<Details>;
};

const LoginMain = ({ onSubmit }: Props) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePassword = () => setShowPassword(!showPassword);

  const { formState, handleSubmit, control } = useForm<Details>({
    defaultValues: { email: '', password: '' },
    resolver: zodResolver(UserModel.loginSchema),
  });

  return (
    <Main>
      <div className="mx-auto flex max-w-md flex-col gap-8 px-3 pt-3">
        <h1 className="text-center">
          <T>Welcome back</T>
        </h1>
        <h2 className="-mt-5 text-center">
          <T>Sign in to your account to start</T>
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-list">
            <ControlledInput
              control={control}
              name="email"
              prefix={<IonIcon icon={mailOutline} className="size-5" />}
              type="email"
              placeholder="Email"
            />
            <ControlledInput
              control={control}
              name="password"
              prefix={<IonIcon icon={keyOutline} className="size-5" />}
              suffix={
                <IonIcon
                  icon={showPassword ? eyeOutline : eyeOffOutline}
                  className="size-5 opacity-50"
                  onClick={togglePassword}
                />
              }
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
            />
          </div>
          <div className="my-4 flex justify-end">
            <IonRouterLink
              routerLink="/user/reset"
              className="text-sm text-primary-950"
            >
              <T>Forgot password?</T>
            </IonRouterLink>
          </div>

          <Button
            className={clsx(
              'mx-auto mt-7 bg-secondary-500',
              !formState.isValid && 'opacity-50'
            )}
            color="secondary"
            type="submit"
          >
            Sign in
          </Button>
        </form>
      </div>
    </Main>
  );
};

export default LoginMain;
