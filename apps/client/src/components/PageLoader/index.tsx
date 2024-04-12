import classNames from 'classnames';

import logoImage from '@app/client/img/Logo.svg';
import styles from './styles.module.scss';

type PageLoaderProps = {
  className?: string;
};
function PageLoader({ className }: PageLoaderProps) {
  return (
    <div className={classNames(styles.container, className)}>
      <img src={logoImage.src} alt="KMA Vote Logo" />
    </div>
  );
}

export default PageLoader;
