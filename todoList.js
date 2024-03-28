// BUG Text k opsání obsahuje tyto neplatné symboly, které nebudou v opisu zobrazeny: "
// " double quote symbol by neměl zobrazovat toto varování, naopak chybý varování pro: <, >, , {, } a pravděpodobně další
// TODO add typing sounds
// TODO add $nbsp; after prepositions
// TODO create a text difficulty assesment function
//  - at first it can be based on symbol difficulty, later on on the symbol combination
//  - and finally both?

// TODO implement notifications - for errors to start with
// TODO handle failed font fetch
// TODO be able to save a text and load it
// TODO limit a text to 10000? symbols

// TODO make links and comments for used sources like wiki and osel(here I should probably ask for permision)
// TODO display url of the loaded article
// TODO for performance - I could split the text to the visible part and make a symbol...
// ...row object just from that. The rest of the symbol row object would be stored and...
// ...updated(on the row change?) separately from the render function

// TODO  add descriptions to main menu text adjustments
// TODO add text adjustment for czech and english keyboard
// TODO style scrollbar along with  theme
// TODO save sorting selection(in statistics) permanently
// TODO set a maximum count for mistyped words (10000?)
// TODO replace initial states(like empty string, array or object) with null where suitable
// TODO minify resultObj which is saved/loaded from LS or DB
// TODO move allowedMistype, setAllowedMistype state to PlayPage (if possible)
// TODO add spinner when loading text from the internet
// TODO add keyboard icon to browser tab
// TODO scrollbars are almost invisible in dark mode (especially in the loaded paragraph tooltips)
// TODO retry text loading when received empty paragraphs from random wiki
// TODO remember text input when going from main menu to statistics (and play page?)
// TODO disable statistics button in MainMenu when there are no results yet
// TODO add small delete button for deleting all text in the text field
// BUG in mistyped words counter shows for example 1-7/10 (when not enough words)
// TODO make tooltip disappear when scrolling and the tooltip arrow is leaving the paragraph window
// TODO user can set up a typing profile (for example for different keyboards, or devices)
// TODO use new Intl.Collator("cz").compare(wordA, wordB) instead of the wordA.localCompare(wordB, "cz") - it's more precise
// TODO improve fetching experience and handling (multiple quick calls, errors, etc.) - there should be libraries for this, do some research

// DATABASE:
// TODO write database security rules: https://firebase.google.com/docs/rules/basics?authuser=0
// TODO handling sync with the firebase
/* Using onbeforeunload listener works only if it triggers the "alert" (the callback must return a string to do that).
Syncing 1x a day doesn't work if the user uses multiple devices for example in a school. Some results would never be synced.
There could be a complicated solution for this - manual sync done by the user and alerting him, when no sync was done
and the broswer is closing. There would also needed to be some FUP in place. It would be increased in a payed version.
The last option leaves me with the sync every time the transcript is done (current solution).  */

// TODO don't save results under 100 (200?) characters
// TODO make the loading screen theme type same as the last one used in the same browser (use local storage)
// this should prevent unconsistent theme flipping in most cases
// TODO show loading state for loading articles (slow connections don't have any feedback)
// TODO change favicon and title (to "Deset prstů")
// TODO unify spinners (probably to ScaleLoader?)
// TODO // implement web-vitals library

    /* The "web-vitals" npm library is a JavaScript library developed to measure and
    report essential performance metrics for web pages, known as Web Vitals.
    Web Vitals are crucial indicators of a user's experience on a website, focusing on
    aspects like page load time, interactivity, and visual stability. */