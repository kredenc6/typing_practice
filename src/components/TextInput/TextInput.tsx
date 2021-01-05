import React from "react";
import { makeStyles, OutlinedTextFieldProps, TextField } from "@material-ui/core";

interface Props extends OutlinedTextFieldProps {
  handleInputChange: (text: string) => void;
}

const useStyles = makeStyles({
  textFieldWrapper: {
    minWidth: "500px",
    width: "70%",
    margin: "1rem auto"
  },
  textField: {
    "& .MuiInputBase-root": {
      paddingRight: "0px"
    }
  }
});

export default function TextInput({ handleInputChange, ...textFieldProps }: Props) {
  const classes = useStyles();
  return(
    <div className={classes.textFieldWrapper}>
        <TextField
          className={classes.textField}
          fullWidth
          multiline
          onChange={e => handleInputChange(e.target.value)}
          placeholder="paste some text here"
          rowsMax={7}
          {...textFieldProps} />
    </div>
  )
}
