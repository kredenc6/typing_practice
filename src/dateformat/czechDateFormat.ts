import dateFormat from "dateformat";
dateFormat.i18n = { // doesn't work - dateFormat bug? 
  dayNames: [
    "ne",
    "po",
    "út",
    "st",
    "čt",
    "pá",
    "so",
    "neděle",
    "pondělí",
    "úterý",
    "středa",
    "čtvrtek",
    "pátek",
    "sobota",
  ],
  monthNames: [
    "led",
    "úno",
    "bře",
    "dub",
    "kvě",
    "čvn",
    "čvc",
    "spr",
    "zář",
    "říj",
    "lis",
    "pro",
    "leden",
    "únor",
    "březen",
    "duben",
    "květen",
    "červen",
    "červenec",
    "srpen",
    "září",
    "říjen",
    "listopad",
    "prosinec",
  ],
  timeNames: ["a", "p", "am", "pm", "A", "P", "AM", "PM"],
};

export default dateFormat;
