import { useAlert } from 'common/flumens';

const useThankYouMessage = () => {
  const alert = useAlert();
  return () => {
    alert({
      header: 'Success',
      message:
        'Thank you for your report. You will be sent an email detailing next steps. Please keep specimens for analysis.',
      buttons: [{ text: 'OK' }],
    });

    return true;
  };
};

export default useThankYouMessage;
