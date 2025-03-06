import TextField, { TextFieldProps } from "@mui/material/TextField";
import { useCallback, useEffect, useState } from "react";

type ValidatedTextFieldProps = Omit<TextFieldProps,"value" | "error" | "helperText" | "onChange"> & 
{
  validator: (value: string) => string;
  onChange: (value: string, isValid: boolean) => void;
  initialValue?: string;
};
export const ValidatedTextField = (props: ValidatedTextFieldProps) => {
  const { label, validator, onChange, initialValue, ...textFieldProps } = props;
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const handleChange = useCallback((newValue: string) => {
    const errorMessage = validator(newValue);
    setValue(newValue);
    setError(errorMessage);
    onChange(newValue, !errorMessage);
  }, [onChange, validator]);

  useEffect(() => {
    if (initialValue) handleChange(initialValue);
  }, [initialValue, handleChange]);

  return (
    <TextField
      label={label}
      value={value}
      onChange={e => handleChange(e.target.value)}
      error={!!error}
      helperText={error}
      {...textFieldProps}
    />
  );
};