import React from "react";
import { makeStyles, FormControlLabel, Switch, Box, Divider } from "@material-ui/core";
import { AllowedMistype } from "../../../types/otherTypes";
import SettingsButton from "../SettingsButton/SettingsButton";

interface Props {
  setAllowedMistype: React.Dispatch<React.SetStateAction<AllowedMistype>>;
  allowedMistype: AllowedMistype;
}

const useStyles = makeStyles(({  textDisplayTheme }) => ({
  button: {
    fontSize: "2rem",
    color: `${textDisplayTheme.text.secondary}`,
    height: "auto"
  },
  switchLabel: {
    color: `${textDisplayTheme.text.secondary}`
  }
}));

export default function MistypeSettings({ allowedMistype, setAllowedMistype }: Props) {
  const classes = useStyles();

  const toggleMistype = () => {
    setAllowedMistype(prev => {
      const updatedObj = { ...prev, isAllowed: !prev.isAllowed };
      localStorage.setItem("typingPracticeMistypeSettings", JSON.stringify(updatedObj));
      return updatedObj;
    });
  };
  const setMistypeCount = (count: AllowedMistype["count"]) => {
    setAllowedMistype(prev => {
      const updatedObj = { ...prev, count };
      localStorage.setItem("typingPracticeMistypeSettings", JSON.stringify(updatedObj));
      return updatedObj;
    });
  };

  const MistypeCountComponents = function() {
    return (
      <>
        <SettingsButton
          className={classes.button}
          disabled={allowedMistype.count === 0}
          onClick={() => setMistypeCount(0)}
        >
          1.
        </SettingsButton>
        <SettingsButton
          className={classes.button}
          disabled={allowedMistype.count === 1}
          onClick={() => setMistypeCount(1)}
        >
          2.
        </SettingsButton>
        <SettingsButton
          className={classes.button}
          disabled={allowedMistype.count === 2}
          onClick={() => setMistypeCount(2)}
        >
          3.
        </SettingsButton>
      </>
    );
  };

  return (
    <Box>
      <FormControlLabel
        className={classes.switchLabel}
        control={
          <Switch
            color="primary"
            checked={allowedMistype.isAllowed}
            onChange={toggleMistype}
            name="Blokuj postup na chybě" />
        }
        label="Blokuj postup na chybě" />
        {allowedMistype.isAllowed &&
          <>
            <Divider />
            <MistypeCountComponents />
          </>
        }
    </Box>
  );
}
