import React from "react";
import { FormControlLabel, Switch, Box, Divider } from "@mui/material";
import { AllowedMistype } from "../../../types/otherTypes";
import SettingsButton from "../SettingsButton/SettingsButton";
import { usePlayPageTheme } from "../../../styles/themeContexts";

interface Props {
  setAllowedMistype: React.Dispatch<React.SetStateAction<AllowedMistype>>;
  allowedMistype: AllowedMistype;
}

export default function MistypeSettings({ allowedMistype, setAllowedMistype }: Props) {
  const { state: textDisplayTheme } = usePlayPageTheme()!;
  const buttonStyle = {
    fontSize: "2rem",
    color: `${textDisplayTheme.text.secondary}`,
    height: "auto"
  };

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
          sx={buttonStyle}
          disabled={allowedMistype.count === 0}
          onClick={() => setMistypeCount(0)}
        >
          1.
        </SettingsButton>
        <SettingsButton
          sx={buttonStyle}
          disabled={allowedMistype.count === 1}
          onClick={() => setMistypeCount(1)}
        >
          2.
        </SettingsButton>
        <SettingsButton
          sx={buttonStyle}
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
        sx={{ color: `${textDisplayTheme.text.secondary}` }}
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
