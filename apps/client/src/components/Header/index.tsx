import { Box } from '@mui/material';
import { useStore } from 'effector-react';

import config from '@libs/configs/next';

import { isAuthenticated } from '@app/client/api';
import { userStore } from '@app/client/storage';
import CustomLink from '@app/client/components/CustomLink';
import Logo from '@app/client/components/Logo';
import styles from './styles.module.sass';

function Header() {
  const user = useStore(userStore);
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Logo />
      </div>
      {isAuthenticated(user) && (
        <>
          <Box component={'div'} mr={4}>
            <CustomLink href={config.routes.elections.path}>
              Голосування
            </CustomLink>
          </Box>

          <p className={styles.userName}>{user?.username}</p>
          <div className={styles.logOutContainer}>
            <CustomLink href={`${process.env.DOMAIN}/auth/logout`}>
              Вийти
            </CustomLink>
          </div>
        </>
      )}
    </header>
  );
}

export default Header;
