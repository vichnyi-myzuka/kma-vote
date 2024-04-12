import Router from 'next/router';

import config from '@libs/configs/next';

import styles from '@app/client/styles/errors.module.scss';
import CustomLink from '@app/client/components/CustomLink';
import Layout from '@app/client/components/Layout';

function ErrorLayout({ code, text }) {
  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.returnButtonContainer}>
          <CustomLink
            onClick={(e: Event) => {
              e.preventDefault();
              Router.push(config.routes.root.path);
            }}
          >
            Повернутися
          </CustomLink>
        </div>

        <h1 className={styles.code}>{code}</h1>
        <p className={styles.text}>{text}</p>
      </div>
    </Layout>
  );
}

export default ErrorLayout;
