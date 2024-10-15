import { SegmentNode, SegmentMatch } from "./segment";

export default function visitNodes(
  nodes: Array<SegmentNode>,
  segments: Array<string>,
  progress: Array<SegmentMatch> = [],
): Array<SegmentMatch> {
  if (nodes.length === 0) {
    return progress;
  }
  // this shouldn't ever happen
  if (segments.length === 0) {
    console.error("segments is empty");
    return [];
  }
  for (const node of nodes) {
    if (node.label) {
      console.log(`visiting ${node.label} with ${segments}`);
    }
    const [_segment, ...rest] = segments;
    const res = node.accept(segments);
    console.log(`got res: ${JSON.stringify(res)}`);
    if (res === null) {
      continue;
    } else {
      const newProgress = [...progress, res];
      return visitNodes(node.children, rest, newProgress);
    }
  }
  return [];
}
