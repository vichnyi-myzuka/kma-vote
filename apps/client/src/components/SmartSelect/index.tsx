import { InputLabel, MenuItem, Select, SelectProps } from '@mui/material';
import { useEffect, useState } from 'react';

const selectProps: SelectProps = {
  fullWidth: true,
  variant: 'standard',
};

// eslint-disable-next-line react/display-name
export default function SmartSelect(props: {
  optionsData?;
  optionsDeps?: any;
  groupRoot?: string;
  secondaryGroupRoot?: string;
  hasGroupRoot?: boolean;
  hasSecondaryGroupRoot?: boolean;
  innerSelectProps: SelectProps;
}) {
  const {
    optionsData,
    optionsDeps,
    groupRoot,
    hasGroupRoot,
    secondaryGroupRoot,
    hasSecondaryGroupRoot,
    innerSelectProps,
  } = props;
  const resetValue = { value: '', text: 'Нічого' };
  const [options, setOptions] = useState([resetValue]);
  const { label, labelId } = innerSelectProps;

  function setOptionsFromData() {
    try {
      let newOptions: string[] = [];
      if (hasGroupRoot) {
        if (!hasSecondaryGroupRoot) {
          newOptions = groupRoot ? optionsData[groupRoot] : [];
        } else {
          newOptions =
            groupRoot && secondaryGroupRoot
              ? optionsData[groupRoot][secondaryGroupRoot]
              : [];
        }
      } else {
        newOptions = optionsData;
      }
      if (newOptions) {
        setOptions([
          resetValue,
          ...newOptions.map((option) => ({ value: option, text: option })),
        ]);
      }
    } catch (e) {
      console.log(e, label);
    }
  }

  function getOptions() {
    return options.map(({ value, text }) => (
      <MenuItem key={value} value={value}>
        {text}
      </MenuItem>
    ));
  }

  useEffect(
    () => {
      if (optionsData) {
        setOptionsFromData();
      }
    },
    optionsDeps ? optionsDeps : [],
  );

  return (
    <>
      <InputLabel sx={{ fontSize: '12px' }} id={labelId}>
        {label}
      </InputLabel>
      <Select {...innerSelectProps} {...selectProps}>
        {getOptions()}
      </Select>
    </>
  );
}
