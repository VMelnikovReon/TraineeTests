import { CUSTOM_FIELDS_ID, MSEC_PER_SEC } from "../../infrastructure/consts";
import { calculateAge } from "../../infrastructure/helpers/calculateAge";
import { testData } from "./testData";

describe("calculateAge", () => {
  testData.forEach(({params, tobe}, index)=>{
    it(`should return correct age for test case ${index + 1}`, () => {
      expect(calculateAge(params)).toBe(tobe);
    });
  })
});
