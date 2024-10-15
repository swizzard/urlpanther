import * as segment from "./segment";
import visitNode from "./visit";
import { describe, expect, it } from "@jest/globals";

describe("one path", () => {
  describe("terminal", () => {
    describe("TerminalStringNode", () => {
      it("success", () => {
        const node = new segment.TerminalStringNode();
        const input = ["foo"];
        const expected = [{ matchedSegment: "foo", stringValue: "foo" }];
        const actual = visitNode(node, input);
        expect(actual).toEqual(expected);
      });
      describe("failure", () => {
        it("not enough", () => {
          const node = new segment.TerminalStringNode();
          const input: Array<string> = [];
          const expected: Array<segment.SegmentMatch> = [];
          const actual = visitNode(node, input);
          expect(actual).toEqual(expected);
        });
        it("too much", () => {
          const node = new segment.TerminalStringNode();
          const input: Array<string> = ["foo", "bar"];
          const expected: Array<segment.SegmentMatch> = [];
          const actual = visitNode(node, input);
          expect(actual).toEqual(expected);
        });
      });
    });
    describe("TerminalStaticNode", () => {
      it("success", () => {
        const node = new segment.TerminalStaticNode("foo");
        const input = ["foo"];
        const expected = [{ matchedSegment: "foo", stringValue: "foo" }];
        const actual = visitNode(node, input);
        expect(actual).toEqual(expected);
      });
      it("failure", () => {
        const node = new segment.TerminalStaticNode("foo");
        const input = ["bar"];
        const expected: Array<segment.SegmentMatch> = [];
        const actual = visitNode(node, input);
        expect(actual).toEqual(expected);
      });
    });
    describe("TerminalNumberNode", () => {
      it("success", () => {
        const node = new segment.TerminalNumberNode();
        const input = ["42"];
        const expected = [{ matchedSegment: "42", numberValue: 42 }];
        const actual = visitNode(node, input);
        expect(actual).toEqual(expected);
      });
      it("failure", () => {
        const node = new segment.TerminalNumberNode();
        const input = ["foo"];
        const expected: Array<segment.SegmentMatch> = [];
        const actual = visitNode(node, input);
        expect(actual).toEqual(expected);
      });
    });
    describe("TerminalDateNode", () => {
      it("success", () => {
        const node = new segment.TerminalDateNode();
        const input = ["2021-01-01"];
        const expected = [
          { matchedSegment: "2021-01-01", dateValue: new Date("2021-01-01") },
        ];
        const actual = visitNode(node, input);
        expect(actual).toEqual(expected);
      });
      it("failure", () => {
        const node = new segment.TerminalDateNode();
        const input = ["2021-01-01-01-01"];
        const expected: Array<segment.SegmentMatch> = [];
        const actual = visitNode(node, input);
        expect(actual).toEqual(expected);
      });
    });
  });
});
