import config from '@libs/configs/next';

import styles from './styles.module.scss';
function Logo() {
  return (
    <a className={styles.logo} href={config.routes.elections.path}>
      <img src="/logo.svg" alt="KMA Vote Logo" />
    </a>
  );
}

export default Logo;
