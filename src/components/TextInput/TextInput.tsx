import { OutlinedTextFieldProps, TextField } from "@mui/material";

interface Props extends OutlinedTextFieldProps {
  handleInputChange: (text: string) => void;
}

export default function TextInput({ handleInputChange, ...textFieldProps }: Props) {
  return (
    <TextField
      sx={{ "& .MuiInputBase-root": { paddingRight: "0px" }}}
      fullWidth
      multiline
      rows={10}
      onChange={e => handleInputChange(e.target.value)}
      placeholder="zde můžete vložit vlastní text"
      maxRows={10}
      {...textFieldProps} />
  );
}
