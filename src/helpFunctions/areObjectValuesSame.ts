type GenericObject = Record<string, any>;

export default function areObjectValuesSame(object1: GenericObject, object2: GenericObject, comparedProps?: string[]): boolean {
  if(object1 === null && object2 === null) return true;
  if(object1 === null || object2 === null) return false;
  
  if(!comparedProps || !comparedProps.length) {
    comparedProps = Object.keys(object1);
  }

  // prevents ({a: undefined} === {b: "whatev"}) === true, allows ({a: "whatev"} === {a: "whatev", b: "whatev"}) === true
  if(!comparedProps.every(prop => Object.keys(object2).includes(prop))) {
    return false;
  }
  
  return comparedProps.every(comparedProp => {
    if(typeof object1[comparedProp] === "object") {
      return areObjectValuesSame(object1[comparedProp], object2[comparedProp]);
    }

    return object1[comparedProp] === object2[comparedProp];
  });
}
