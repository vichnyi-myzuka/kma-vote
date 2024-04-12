import classNames from 'classnames';
import styles from './styles.module.scss';

type PageLoaderProps = {
  className?: string;
};
function PageLoader({ className }: PageLoaderProps) {
  return (
    <div className={classNames(styles.container, className)}>
      <img src={'/logo.svg'} alt="KMA Vote Logo" />
    </div>
  );
}

export default PageLoader;
