import { SegmentNode, SegmentMatch } from "./segment";

export default function visitNode(
  node: SegmentNode,
  segments: Array<string>,
  progress: Array<SegmentMatch> = [],
): Array<SegmentMatch> {
  // this shouldn't ever happen
  if (segments.length === 0) {
    console.error("segments is empty");
    return progress;
  }
  if (node.label) {
    console.log(`visiting ${node.label} with ${segments}`);
  }
  const [_segment, ...rest] = segments;
  const res = node.accept(segments);
  console.log(`got res: ${JSON.stringify(res)}`);
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
