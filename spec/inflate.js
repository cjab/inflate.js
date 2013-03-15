define([
  "inflate!spec/fixtures/simple.json",
  "inflate!spec/fixtures/nested.json",
  "inflate!spec/fixtures/array.json"
], function(simpleFixture, nestedFixture, arrayFixture) {

  describe("inflate", function() {


    describe("given an object containing only string values", function() {

      it("should map the keys correctly", function() {
        console.log(simpleFixture);
        expect(simpleFixture.firstName).toEqual("FirstName1");
        expect(simpleFixture.lastName).toEqual("LastName1");
      });
    });


    describe("given an object containing strings and other objects", function() {

      it("should map the keys correctly", function() {
        expect(nestedFixture.firstName).toEqual("FirstName1");
        expect(nestedFixture.lastName).toEqual("LastName1");
        expect(nestedFixture.address.street).toEqual("123 Fake St.");
        expect(nestedFixture.address.state).toEqual("IN");
        expect(nestedFixture.address.zip).toEqual(46350);
      });
    });


    describe("given an array of objects", function() {

      it("should map the keys correctly", function() {
        expect(arrayFixture[0].firstName).toEqual("FirstName1");
        expect(arrayFixture[0].lastName).toEqual("LastName1");
        expect(arrayFixture[1].firstName).toEqual("FirstName2");
        expect(arrayFixture[1].lastName).toEqual("LastName2");
        expect(arrayFixture[2].firstName).toEqual("FirstName3");
        expect(arrayFixture[2].lastName).toEqual("LastName3");
      });
    });
  });
});
