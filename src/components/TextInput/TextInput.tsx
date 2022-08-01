import { OutlinedTextFieldProps, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";

interface Props extends OutlinedTextFieldProps {
  handleInputChange: (text: string) => void;
}

const useStyles = makeStyles({
  textFieldWrapper: {
    minWidth: "500px",
    width: "70%",
    margin: "0 auto"
  },
  textField: {
    "& .MuiInputBase-root": {
      paddingRight: "0px"
    }
  }
});

export default function TextInput({ handleInputChange, ...textFieldProps }: Props) {
  const classes = useStyles();
  return (
    <TextField
      className={classes.textField}
      fullWidth
      multiline
      rows={10}
      onChange={e => handleInputChange(e.target.value)}
      placeholder="zde můžete vložit vlastní text"
      maxRows={10}
      {...textFieldProps} />
  );
}
