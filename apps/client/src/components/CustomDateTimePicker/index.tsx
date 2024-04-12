import { DateTimePicker, DateTimePickerProps } from '@mui/x-date-pickers';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { Dayjs } from 'dayjs';

export default function CustomDateTimePicker(
  props: DateTimePickerProps<Dayjs>,
) {
  return (
    <DateTimePicker
      sx={{
        width: '100%',
      }}
      ampm={false}
      viewRenderers={{
        hours: renderTimeViewClock,
        minutes: renderTimeViewClock,
        seconds: renderTimeViewClock,
      }}
      {...props}
    />
  );
}
