import classNames from 'classnames';
import styles from './styles.module.scss';
import Image from 'next/image';

type PageLoaderProps = {
  className?: string;
};
function PageLoader({ className }: PageLoaderProps) {
  return (
    <div className={classNames(styles.container, className)}>
      <Image src={'/logo.svg'} alt="KMA Vote Logo" />
    </div>
  );
}

export default PageLoader;
