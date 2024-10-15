import * as segment from "./segment";

// {
//   "user:start": {
//      "profile": [
//        {"": null
//        {"<string>:userId": null
//      ]
//    }
// }
// becomes
// new NonTerminalStaticNode("user", "start", [
// new NonTerminalStaticNode
// ])

export type RawPaths = Array<{ [key: string]: RawPaths | null } | null>;
export function parseRawPaths(
  paths: Array<RawPaths>,
): Array<segment.SegmentNode> {
  return [];
}
