import { Typography, TypographyProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export default styled((props: TypographyProps) => <Typography {...props} />)(
  () => ({
    fontFamily: 'FixelDisplay, sans',
  }),
);
