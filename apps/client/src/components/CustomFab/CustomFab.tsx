import { Fab, FabProps } from '@mui/material';
import React, { forwardRef } from 'react';

export type CustomFabProps = {
  onClick: () => void;
  children: React.ReactNode;
  color?: 'primary' | 'secondary';
} & FabProps;

const CustomFab = forwardRef(function CustomFab(
  props: CustomFabProps,
  ref: React.Ref<HTMLButtonElement>,
) {
  const { onClick, children, color = 'primary', ...rest } = props;

  return (
    <Fab
      color={color}
      onClick={onClick}
      ref={ref}
      {...rest}
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 100,
      }}
    >
      {children}
    </Fab>
  );
});
export default CustomFab;
