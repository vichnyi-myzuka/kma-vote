import ErrorLayout from '@app/client/components/ErrorLayout';

function NotAuthorized() {
  return (
    <ErrorLayout
      code={401}
      text={'Увійдіть до свого акаунту, щоб отримати доступ до ресурсу.'}
    />
  );
}

export default NotAuthorized;
