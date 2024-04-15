const hooksService = require("../services/hooksService");

describe("reduceAge", () => {
  it('should return correct age when birthday has passed this year', () => {
    const inputDate = new Date('1990-01-01');
    const timestamp = inputDate.getTime() / 1000;

    const contact = {
      custom_fields: [
        { name: "Дата рождения", values: [timestamp] }
      ]
    };
    const expectedAge = new Date().getFullYear() - 1990;

    expect(hooksService.calculateAge(contact)).toBe(expectedAge);
  });

  it('should return correct age when birthday has not passed this year', () => {
    const inputDate = new Date("1990-12-31");
    const timestamp = inputDate.getTime() / 1000;

    const contact = {
      custom_fields: [
        { name: "Дата рождения", values: [timestamp] }
      ]
    };
    const expectedAge = new Date().getFullYear() - 1990 - 1;

    expect(hooksService.calculateAge(contact)).toBe(expectedAge);
  });

  it('should return undefined if birthday field is not found', () => {
    const contact = {
      custom_fields: [
        { name: "Some other field", values: ["Some value"] }
      ]
    };

    expect(hooksService.calculateAge(contact)).toBeUndefined();
  });
});
