const isType = function (o: any) {
  const s = Object.prototype.toString.call(o);
  return s.match(/\[object (.*?)\]/)[1].toLowerCase();
};

export const isPrimitive = (o: any) => {
  const name = isType(o);
  return (
    name === "string" ||
    name === "number" ||
    name === "symbol" ||
    name === "boolean"
  );
};
export const isDate = (o: any) => {
  return isType(o) === "date";
};
export const isNumber = (o: any) => {
  return isType(o) === "number";
};
export const isString = (o: any) => {
  return isType(o) === "string";
};
export const isObject = (o: any) => {
  return isType(o) === "object";
};
export const isArray = (o: any) => {
  return isType(o) === "array";
};
export const isBuffer = (o: any) => {
  return isType(o) === "buffer";
};
