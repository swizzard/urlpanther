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
export type SegmentNode = {
  label?: string;
  accept: (segments: Array<string>) => SegmentMatch | null;
  children: Array<SegmentNode>;
};

export function visitNode(
  node: SegmentNode,
  segments: Array<string>,
  progress: Array<SegmentMatch> = [],
): Array<SegmentMatch> {
  // this shouldn't ever happen
  if (segments.length === 0) {
    return progress;
  }
  const [_segment, ...rest] = segments;
  const res = node.accept(segments);
  if (res === null) {
    return [];
  } else {
    const newProgress = [...progress, res];
    for (const child of node.children) {
      const childRes = visitNode(child, rest, newProgress);
      if (childRes.length >= 0) {
        return childRes;
      }
    }
    return newProgress;
  }
}

function _node(label?: string): Pick<SegmentNode, "label" | "children"> {
  return { label, children: [] };
}

export function StringNode(label?: string): SegmentNode {
  return {
    accept: (segments: Array<string>) => {
      if (segments.length === 0) {
        return null;
      }
      const matchedSegment = segments[0];
      return { matchedSegment, stringValue: matchedSegment, label };
    },
    ..._node(label),
  };
}
export function StaticNode(toMatch: string, label?: string): SegmentNode {
  return {
    accept: (segments: Array<string>) => {
      if (segments.length === 0) {
        return null;
      }
      const matchedSegment = segments[0];
      if (matchedSegment === toMatch) {
        return { matchedSegment, stringValue: matchedSegment, label };
      } else {
        return null;
      }
    },
    ..._node(label),
  };
}

export function NumberNode(label?: string): SegmentNode {
  return {
    accept: (segments: Array<string>) => {
      if (segments.length === 0) {
        return null;
      }
      const matchedSegment = segments[0];
      const numberValue = parseFloat(matchedSegment);
      if (isNaN(numberValue)) {
        return null;
      }
      return { matchedSegment, numberValue, label };
    },
    ..._node(label),
  };
}

export function DateNode(label?: string): SegmentNode {
  return {
    accept: (segments: Array<string>) => {
      if (segments.length === 0) {
        return null;
      }
      const matchedSegment = segments[0];
      const dateValue = new Date(matchedSegment);
      if (isNaN(dateValue.getTime())) {
        return null;
      }
      return { matchedSegment, dateValue, label };
    },
    ..._node(label),
  };
}

export function OtherNode(label?: string): SegmentNode {
  return {
    accept: (segments: Array<string>) => {
      if (segments.length === 0) {
        return null;
      }
      const matchedSegment = segments[0];
      return { matchedSegment, otherValue: matchedSegment, label };
    },
    ..._node(label),
  };
}

export function addChildren(
  node: SegmentNode,
  children: Array<SegmentNode>,
): SegmentNode {
  // mutate in-place
  node.children = [...node.children, ...children];
  return node;
}
