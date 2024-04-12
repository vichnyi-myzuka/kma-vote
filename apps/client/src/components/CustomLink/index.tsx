import classNames from 'classnames';
import styles from './styles.module.scss';

function CustomLink({ href = '', children, onClick = null, className = '' }) {
  return (
    <a
      className={classNames(styles.customLink, className)}
      href={href ? href : null}
      onClick={onClick}
    >
      {children}
    </a>
  );
}

export default CustomLink;
