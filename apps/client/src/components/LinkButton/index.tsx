import classNames from 'classnames';
import styles from './styles.module.scss';

function LinkButton({ href, children, large }) {
  const className = classNames(styles.linkButton, {
    [styles.large]: large,
  });
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

export default LinkButton;
