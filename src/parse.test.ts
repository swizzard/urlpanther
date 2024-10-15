import * as segment from "./segment";
import * as parse from "./parse";
import { describe, expect, it } from "@jest/globals";

describe("parseRawPaths", () => {
  it("parses RawPaths", () => {
    const input: parse.RawPaths = [
      {
        "user:start": [
          {
            profile: [null, { "<string>:userId": null }],
          },
        ],
      },
    ];
  });
});
