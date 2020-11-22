export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

let allValues = [
  Gender.MALE,
  Gender.FEMALE,
];
let GenderEnum = {
  enum: Gender,
  values: allValues,
  valuesStr: allValues.map(i=><string>i),
};
export { GenderEnum };
