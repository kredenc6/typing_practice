import React from "react";
import { makeStyles, OutlinedTextFieldProps, TextField } from "@material-ui/core";

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
    // <div className={classes.textFieldWrapper}>
        <TextField
          className={classes.textField}
          fullWidth
          multiline
          rows={10}
          onChange={e => handleInputChange(e.target.value)}
          placeholder="zde můžete vložit vlastní text"
          rowsMax={10}
          {...textFieldProps} />
    // </div>
  );
}
