import { SegmentNode, SegmentMatch } from "./segment";

export default function visitNode(
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
