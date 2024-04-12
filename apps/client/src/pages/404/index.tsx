import ErrorLayout from '@app/client/components/ErrorLayout';

function NotFound() {
  return (
    <ErrorLayout code={404} text={'Вибачте, але такого ресурсу не існує.'} />
  );
}

export default NotFound;
