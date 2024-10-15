import * as segment from "./segment";
import { describe, expect, it } from "@jest/globals";

describe("one path", () => {
  describe("one segment", () => {
    describe("StringNode", () => {
      it("success", () => {
        const node = segment.StringNode();
        const input = ["foo"];
        const expected = [{ matchedSegment: "foo", stringValue: "foo" }];
        const actual = segment.visitNode(node, input);
        expect(actual).toEqual(expected);
      });
      it("failure", () => {
        const node = segment.StringNode();
        const input: Array<string> = [];
        const expected: Array<segment.SegmentMatch> = [];
        const actual = segment.visitNode(node, input);
        expect(actual).toEqual(expected);
      });
    });
    describe("StaticNode", () => {
      it("success", () => {
        const node = segment.StaticNode("foo");
        const input = ["foo"];
        const expected = [{ matchedSegment: "foo", stringValue: "foo" }];
        const actual = segment.visitNode(node, input);
        expect(actual).toEqual(expected);
      });
      it("failure", () => {
        const node = segment.StaticNode("foo");
        const input = ["bar"];
        const expected: Array<segment.SegmentMatch> = [];
        const actual = segment.visitNode(node, input);
        expect(actual).toEqual(expected);
      });
    });
    describe("NumberNode", () => {
      it("success", () => {
        const node = segment.NumberNode();
        const input = ["42"];
        const expected = [{ matchedSegment: "42", numberValue: 42 }];
        const actual = segment.visitNode(node, input);
        expect(actual).toEqual(expected);
      });
      it("failure", () => {
        const node = segment.NumberNode();
        const input = ["foo"];
        const expected: Array<segment.SegmentMatch> = [];
        const actual = segment.visitNode(node, input);
        expect(actual).toEqual(expected);
      });
    });
  });
  describe("DateNode", () => {
    it("success", () => {
      const node = segment.DateNode();
      const input = ["2021-01-01"];
      const expected = [
        { matchedSegment: "2021-01-01", dateValue: new Date("2021-01-01") },
      ];
      const actual = segment.visitNode(node, input);
      expect(actual).toEqual(expected);
    });
    it("failure", () => {
      const node = segment.DateNode();
      const input = ["2021-01-01-01-01"];
      const expected: Array<segment.SegmentMatch> = [];
      const actual = segment.visitNode(node, input);
      expect(actual).toEqual(expected);
    });
  });
});
