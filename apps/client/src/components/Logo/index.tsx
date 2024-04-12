import config from '@libs/configs/next';

import logoImage from '@app/client/img/Logo.svg';
import styles from './styles.module.scss';
function Logo() {
  return (
    <a className={styles.logo} href={config.routes.elections.path}>
      <img src={logoImage.src} alt="KMA Vote Logo" />
    </a>
  );
}

export default Logo;
