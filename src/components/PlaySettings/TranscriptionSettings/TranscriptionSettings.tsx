import React from "react";
import { makeStyles, FormControlLabel, Switch, Box, Divider } from "@material-ui/core";
import { AllowedMistype } from "../../../types/otherTypes";
import SettingsButton from "../SettingsButton/SettingsButton";

interface Props {
  setAllowedMistype: React.Dispatch<React.SetStateAction<AllowedMistype>>;
  allowedMistype: AllowedMistype;
}

const useStyles = makeStyles({
  button: {
    fontSize: "1rem",
    textTransform: "none",
    alignItems: "flex-start"
  },
  buttonNumber: {
    fontSize: "2rem"
  }
});

export default function RuleSettings({ allowedMistype, setAllowedMistype }: Props) {
  const classes = useStyles();

  const toggleMistype = () => {
    setAllowedMistype(prev => ({ ...prev, isAllowed: !prev.isAllowed }));
  };
  const setMistypeCount = (count: AllowedMistype["count"]) => {
    setAllowedMistype(prev => ({ ...prev, count }))
  };

  const MistypeCountComponents = function() {
    return (
      <>
        <SettingsButton
          className={classes.button}
          disabled={allowedMistype.count === 0}
          onClick={() => setMistypeCount(0)}
        >
          <span className={classes.buttonNumber}>1</span>st
        </SettingsButton>
        <SettingsButton
          className={classes.button}
          disabled={allowedMistype.count === 1}
          onClick={() => setMistypeCount(1)}
        >
          <span className={classes.buttonNumber}>2</span>nd
        </SettingsButton>
        <SettingsButton
          className={classes.button}
          disabled={allowedMistype.count === 2}
          onClick={() => setMistypeCount(2)}
        >
          <span className={classes.buttonNumber}>3</span>rd
        </SettingsButton>
      </>
    );
  };

  return (
    <Box>
      <FormControlLabel
        control={
          <Switch
            checked={allowedMistype.isAllowed}
            onChange={toggleMistype}
            name="Block on error(s)" />
        }
        label="Block on error(s)" />
        {allowedMistype.isAllowed &&
          <>
            <Divider />
            <MistypeCountComponents />
          </>
        }
    </Box>
  );
}
