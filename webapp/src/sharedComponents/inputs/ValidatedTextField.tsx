import TextField, { TextFieldProps } from "@mui/material/TextField";
import { useEffect, useState } from "react";

type ValidatedTextFieldProps = {
  label: string,
  validator: (value: string) => string;
  onChange: (value: string, isValid: boolean) => void;
  initialValue?: string,
  textFieldProps?: TextFieldProps;
}
export const ValidatedTextField = (props: ValidatedTextFieldProps) => {
  const { label, validator, onChange, initialValue, textFieldProps } = props;
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const newValue = event.target.value;
    const errorMessage = validator(newValue);
    setValue(newValue);
    setError(errorMessage);
    onChange(newValue, !errorMessage);
  };

  useEffect(() => {
    if (initialValue) setValue(initialValue);
  }, [initialValue]);

  return (
    <TextField
      label={label}
      value={value}
      onChange={handleChange}
      error={!!error}
      helperText={error}
      {...textFieldProps}
    />
  );
};