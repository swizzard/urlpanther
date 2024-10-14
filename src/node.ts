import { Segment, MatchResult, isTerminus } from "./segment";

const START_TOKEN = "###START###";

export interface Node extends Segment {
  parent?: Node;
  children: Node[];
  match(input: string): MatchResult | null;
}

export type MatchInput = {
  matchInput: Array<string>;
};
export function toMatchInput(input: string): MatchInput {
  const matchInput = [START_TOKEN];
  for (const segment in input.split("/")) {
    if (segment) {
      matchInput.push(segment);
    }
  }
  matchInput.push("");
  return { matchInput };
}
function wrapMI(matchInput: Array<string>): MatchInput {
  return { matchInput };
}

export class MatcherNode {
  segment: Segment;
  children: Array<MatcherNode>;
  childIndex: number = 0;
  parent?: MatcherNode;

  constructor(
    segment: Segment,
    children: Array<MatcherNode>,
    parent: MatcherNode | undefined,
  ) {
    this.segment = segment;
    this.children = children;
    this.parent = parent;
  }
  fail(input: MatchInput, output: Array<MatchResult>): Array<MatchResult> {
    if (this.parent) {
      return this.parent.tryNext(input, output);
    }
    return output;
  }
  match(
    input: MatchInput,
    output: Array<MatchResult> = [],
  ): Array<MatchResult> {
    const [curr, ...rest] = input.matchInput;
    const mr = this.segment.match(curr);
    if (mr === null) {
      return this.fail(input, output);
    }
    if (isTerminus(mr)) {
      if (rest.length === 0) {
        output.push(mr);
        return output;
      } else {
        return this.fail(input, output);
      }
    } else if (rest.length === 0) {
      return this.fail(input, output);
    } else {
      return this.children[this.childIndex].match(wrapMI(rest), output);
    }
  }
  tryNext(input: MatchInput, output: Array<MatchResult>): Array<MatchResult> {
    this.childIndex++;
    if (this.childIndex >= this.children.length) {
      return this.fail(input, output);
    }
    return this.children[this.childIndex].match(input, output);
  }
}
// export function matchSegmentsDepthFirst(
//   node: Node,
//   segments: MatchInput,
//   output: Array<MatchResult> = [],
// ): Array<MatchResult> {
//     const [curr, ...rest] = segments.matchInput;
//     const mr = node.match(curr);
//     if (mr === null) {
//
//     }
// }
