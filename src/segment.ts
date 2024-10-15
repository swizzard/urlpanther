export type StringMatch = { stringValue: string };
export type NumberMatch = { numberValue: number };
export type DateMatch = { dateValue: Date };
export type OtherMatch = { otherValue: unknown };
export type SegmentMatch = { matchedSegment: string; label?: string } & (
  | StringMatch
  | NumberMatch
  | DateMatch
  | OtherMatch
);

export interface SegmentNode {
  accept: (segments: Array<string>) => SegmentMatch | null;
  children: Array<SegmentNode>;
}

class _SegmentNode implements SegmentNode {
  label?: string;
  children: Array<_SegmentNode> = [];
  acceptInput: (segments: Array<string>) => string | null;
  constructor(label?: string) {
    this.label = label;
    this.acceptInput = _nonterminal.bind(this);
  }
  accept(segments: Array<string>): SegmentMatch | null {
    const matchedSegment = this.acceptInput(segments);
    if (matchedSegment === null) {
      return null;
    }
    return this.matchSegment(matchedSegment);
  }
  matchSegment(segment: string): SegmentMatch | null {
    return { matchedSegment: segment, label: this.label, stringValue: segment };
  }
}
export class NonTerminalStringNode extends _SegmentNode {}
export class TerminalStringNode extends NonTerminalStringNode {
  constructor(label?: string) {
    super(label);
    this.acceptInput = _terminal.bind(this);
  }
}
export class NonTerminalStaticNode extends _SegmentNode {
  toMatch: string;
  constructor(toMatch: string, label?: string) {
    super(label);
    this.toMatch = toMatch;
  }
  matchSegment(segment: string): SegmentMatch | null {
    if (segment === this.toMatch) {
      return {
        matchedSegment: segment,
        label: this.label,
        stringValue: segment,
      };
    }
    return null;
  }
}
export class TerminalStaticNode extends NonTerminalStaticNode {
  constructor(toMatch: string, label?: string) {
    super(toMatch, label);
    this.acceptInput = _terminal.bind(this);
  }
}

export class NonTerminalNumberNode extends _SegmentNode {
  matchSegment(segment: string): SegmentMatch | null {
    const numberValue = parseFloat(segment);
    if (isNaN(numberValue)) {
      return null;
    }
    return { matchedSegment: segment, label: this.label, numberValue };
  }
}
export class TerminalNumberNode extends NonTerminalNumberNode {
  constructor(label?: string) {
    super(label);
    this.acceptInput = _terminal.bind(this);
  }
}
export class NonTerminalDateNode extends _SegmentNode {
  matchSegment(segment: string): SegmentMatch | null {
    const dateValue = new Date(segment);
    if (isNaN(dateValue.getTime())) {
      return null;
    }
    return { matchedSegment: segment, label: this.label, dateValue };
  }
}
export class TerminalDateNode extends NonTerminalDateNode {
  constructor(label?: string) {
    super(label);
    this.acceptInput = _terminal.bind(this);
  }
}
export class NonTerminalOtherNode extends _SegmentNode {
  matchSegment(segment: string): SegmentMatch | null {
    return { matchedSegment: segment, label: this.label, otherValue: segment };
  }
}
export class TerminalOtherNode extends NonTerminalOtherNode {
  constructor(label?: string) {
    super(label);
    this.acceptInput = _terminal.bind(this);
  }
}

function _nonterminal(segments: Array<string>) {
  if (segments.length < 2) {
    return null;
  }
  return segments[0];
}
function _terminal(segments: Array<string>) {
  if (segments.length === 1) {
    return segments[0];
  }
  return null;
}
