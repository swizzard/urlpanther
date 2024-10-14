export enum SegmentType {
  String,
  Number,
  Date,
  Terminus,
}
export type MatchResult = {
  name?: string;
  value: any;
  type: SegmentType;
};

export interface StringMatchResult extends MatchResult {
  name?: string;
  value: any;
  type: SegmentType.String;
}
export interface NumberMatchResult extends MatchResult {
  name?: string;
  value: any;
  type: SegmentType.Number;
}
export interface DateMatchResult extends MatchResult {
  name?: string;
  value: any;
  type: SegmentType.Date;
}
export interface TerminusMatchResult extends MatchResult {
  name?: string;
  value: any;
  type: SegmentType.Terminus;
}
export function unwrapStringMatchResult({ name, value }: StringMatchResult): {
  name?: string;
  value: string;
} {
  return { name, value };
}
export function unwrapNumberMatchResult({ name, value }: StringMatchResult): {
  name?: string;
  value: number;
} {
  return { name, value: value as number };
}
export function unwrapDateMatchResult({ name, value }: StringMatchResult): {
  name?: string;
  value: Date;
} {
  return { name, value: value as Date };
}
export function unwrapTerminusMatchResult({ name }: StringMatchResult): {
  name?: string;
  value: undefined;
} {
  return { name, value: undefined };
}
export function isTerminus({ type }: MatchResult): boolean {
  return type === SegmentType.Terminus;
}

export interface Segment {
  match(input: string): MatchResult | null;
}

export function makeStatic(toMatch: string, name: string | undefined): Segment {
  return {
    match: (input: string) => {
      if (input === toMatch) {
        return { name, value: toMatch, type: SegmentType.String };
      } else {
        return null;
      }
    },
  };
}

export function makeNumber(name: string | undefined): Segment {
  return {
    match: (input: string) => {
      const parsed = parseFloat(input);
      if (!isNaN(parsed)) {
        return { name, value: parsed, type: SegmentType.Number };
      } else {
        return null;
      }
    },
  };
}

export function makeDate(name: string | undefined): Segment {
  return {
    match: (input: string) => {
      const value = new Date(input);
      if (isNaN(value.valueOf())) {
        return null;
      } else {
        return { name, value, type: SegmentType.Date };
      }
    },
  };
}

export function makeTerminus(name: string | undefined): Segment {
  return {
    match: (input: string) => {
      if (!input.length) {
        return { name, value: undefined, type: SegmentType.Terminus };
      } else {
        return null;
      }
    },
  };
}
