import * as segment from "./segment";
import visitNodes from "./visit";
import { describe, expect, it } from "@jest/globals";

describe("one path", () => {
  describe("terminal", () => {
    describe("TerminalStringNode", () => {
      it("success", () => {
        const node = new segment.TerminalStringNode();
        const input = ["foo"];
        const expected = [{ matchedSegment: "foo", stringValue: "foo" }];
        const actual = visitNodes([node], input);
        expect(actual).toEqual(expected);
      });
      describe("failure", () => {
        it("not enough", () => {
          const node = new segment.TerminalStringNode();
          const input: Array<string> = [];
          const expected: Array<segment.SegmentMatch> = [];
          const actual = visitNodes([node], input);
          expect(actual).toEqual(expected);
        });
        it("too much", () => {
          const node = new segment.TerminalStringNode();
          const input: Array<string> = ["foo", "bar"];
          const expected: Array<segment.SegmentMatch> = [];
          const actual = visitNodes([node], input);
          expect(actual).toEqual(expected);
        });
      });
    });
    describe("TerminalStaticNode", () => {
      it("success", () => {
        const node = new segment.TerminalStaticNode("foo");
        const input = ["foo"];
        const expected = [{ matchedSegment: "foo", stringValue: "foo" }];
        const actual = visitNodes([node], input);
        expect(actual).toEqual(expected);
      });
      it("failure", () => {
        const node = new segment.TerminalStaticNode("foo");
        const input = ["bar"];
        const expected: Array<segment.SegmentMatch> = [];
        const actual = visitNodes([node], input);
        expect(actual).toEqual(expected);
      });
    });
    describe("TerminalNumberNode", () => {
      it("success", () => {
        const node = new segment.TerminalNumberNode();
        const input = ["42"];
        const expected = [{ matchedSegment: "42", numberValue: 42 }];
        const actual = visitNodes([node], input);
        expect(actual).toEqual(expected);
      });
      it("failure", () => {
        const node = new segment.TerminalNumberNode();
        const input = ["foo"];
        const expected: Array<segment.SegmentMatch> = [];
        const actual = visitNodes([node], input);
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
        const actual = visitNodes([node], input);
        expect(actual).toEqual(expected);
      });
      it("failure", () => {
        const node = new segment.TerminalDateNode();
        const input = ["2021-01-01-01-01"];
        const expected: Array<segment.SegmentMatch> = [];
        const actual = visitNodes([node], input);
        expect(actual).toEqual(expected);
      });
    });
  });
  describe("non-terminal", () => {
    describe("two segments", () => {
      describe("success", () => {
        it("StringNode", () => {
          const tn = new segment.TerminalStringNode();
          const ntn = new segment.NonTerminalStringNode(undefined, [tn]);
          const input = ["the", "end"];
          const expected = [
            { matchedSegment: "the", stringValue: "the" },
            { matchedSegment: "end", stringValue: "end" },
          ];
          const actual = visitNodes([ntn], input);
          expect(actual).toEqual(expected);
        });
        it("StaticNode", () => {
          const tn = new segment.TerminalStaticNode("end");
          const ntn = new segment.NonTerminalStaticNode("the", undefined, [tn]);
          const input = ["the", "end"];
          const expected = [
            { matchedSegment: "the", stringValue: "the" },
            { matchedSegment: "end", stringValue: "end" },
          ];
          const actual = visitNodes([ntn], input);
          expect(actual).toEqual(expected);
        });
      });
      describe("failure ", () => {
        it("not enough", () => {
          const tn = new segment.TerminalStringNode();
          const ntn = new segment.NonTerminalStringNode(undefined, [tn]);
          const input = ["the"];
          const expected: Array<segment.SegmentMatch> = [];
          const actual = visitNodes([ntn], input);
          expect(actual).toEqual(expected);
        });
        it("too much", () => {
          const tn = new segment.TerminalStringNode();
          const ntn = new segment.NonTerminalStringNode(undefined, [tn]);
          const input = ["the", "end", "and"];
          const expected: Array<segment.SegmentMatch> = [];
          const actual = visitNodes([ntn], input);
          expect(actual).toEqual(expected);
        });
        it("bad match", () => {
          const tn = new segment.TerminalStaticNode("end");
          const ntn = new segment.NonTerminalStaticNode("the", undefined, [tn]);
          const input = ["the", "beginning"];
          const expected: Array<segment.SegmentMatch> = [];
          const actual = visitNodes([ntn], input);
          expect(actual).toEqual(expected);
        });
      });
    });
  });
});
describe("choices", () => {
  describe("one gen", () => {
    it("success", () => {
      const wrongTn = new segment.TerminalStaticNode("beginning", "wrong end");
      const tn = new segment.TerminalStaticNode("end", "right end");
      const ntn = new segment.NonTerminalStringNode("non-terminal", [
        wrongTn,
        tn,
      ]);
      const input = ["the", "end"];
      const expected = [
        { matchedSegment: "the", stringValue: "the", label: "non-terminal" },
        { matchedSegment: "end", stringValue: "end", label: "right end" },
      ];
      const actual = visitNodes([ntn], input);
      expect(actual).toEqual(expected);
    });
    describe("mix term/non-term", () => {
      const term1 = new segment.TerminalStaticNode("profile", "term1");
      const term2 = new segment.TerminalStringNode("userId");
      const medial = new segment.NonTerminalStaticNode("profile", "medial", [
        term2,
      ]);
      const start = new segment.NonTerminalStaticNode("user", "start", [
        medial,
        term1,
      ]);
      it("term1", () => {
        const input = ["user", "profile"];
        const expected = [
          { matchedSegment: "user", stringValue: "user", label: "start" },
          { matchedSegment: "profile", stringValue: "profile", label: "term1" },
        ];
        const actual = visitNodes([start], input);
        expect(actual).toEqual(expected);
      });
      it("term2", () => {
        const userId = "abc";
        const input = ["user", "profile", userId];
        const expected = [
          { matchedSegment: "user", stringValue: "user", label: "start" },
          {
            matchedSegment: "profile",
            stringValue: "profile",
            label: "medial",
          },
          { matchedSegment: userId, stringValue: userId, label: "userId" },
        ];
        const actual = visitNodes([start], input);
        expect(actual).toEqual(expected);
      });
    });
  });
});
