import ErrorLayout from '@app/client/components/ErrorLayout';

function Forbidden() {
  return (
    <ErrorLayout
      code={403}
      text={
        'Вибачте, але ви не маєте відповідних прав, щоб скористатися цим ресурсом.'
      }
    />
  );
}

export default Forbidden;
