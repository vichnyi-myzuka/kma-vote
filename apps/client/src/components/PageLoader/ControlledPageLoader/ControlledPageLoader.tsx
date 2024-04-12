import { useEffect, useState } from 'react';
import classNames from 'classnames';

import PageLoader from '@app/client/components/PageLoader';
import s from './ControlledPageLoader.module.scss';

type ControlledPageLoaderProps = {
  isLoading: boolean;
};
export default function ControlledPageLoader({
  isLoading,
}: ControlledPageLoaderProps) {
  const [show, setShow] = useState<boolean>(isLoading);
  const [inAnimation, setInAnimation] = useState<boolean>(false);
  const className = classNames(s.loader, {
    [s.showing]: inAnimation && isLoading,
    [s.shown]: !inAnimation && show,
    [s.hidden]: !inAnimation && !show,
    [s.hiding]: inAnimation && !isLoading,
  });

  const animationLength = 200;
  useEffect(() => {
    if (isLoading) {
      setShow(true);
      setInAnimation(true);
      setTimeout(() => {
        setInAnimation(false);
      }, animationLength);
    } else {
      setInAnimation(true);
      setTimeout(() => {
        setInAnimation(false);
        setShow(false);
      }, animationLength);
    }
  }, [isLoading]);

  return (
    <>
      {show && (
        <div className={className}>
          <PageLoader />
        </div>
      )}
    </>
  );
}
