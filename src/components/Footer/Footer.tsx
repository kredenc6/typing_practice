import { Box, Link } from "@mui/material";
import { CSSObjects } from "../../types/themeTypes";

// BUG the background on the PlayPage does not correspond to this Footer backgound (they have different themes).
// create a separate footer?, provide the theme style of the parent component and base the footer background on that?
const styles: CSSObjects = {
  footer: ({ palette }) => ({
    alignSelf: "flex-end", // to keep the background just around the text
    textAlign: "right",
    fontSize: "66%",
    margin: "1rem",
    backgroundColor: palette.background.default,
    color: palette.text.primary
  })
};

export default function Footer() {
  return (
    <Box component="footer" sx={styles.footer}>
      {/* This site is protected by reCAPTCHA and the Google <Link href="https://policies.google.com/privacy">Privacy Policy</Link> and <Link href="https://policies.google.com/terms">Terms of Service</Link> apply. */}
      chráněno službou reCAPTCHA <Link href="https://policies.google.com/privacy">Ochrana soukromí</Link> , <Link href="https://policies.google.com/terms">Smluvní podmínky</Link>.
    </Box>
  );
}
