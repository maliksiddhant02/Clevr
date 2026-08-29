import assert from "node:assert/strict";
import { test } from "node:test";
import { railIndex } from "./rail.ts";

// The real geometry, measured at 375px: three slides at w-[76%] of a 335px
// content box, 12px gaps, 20px rail padding.
const SW = 828;
const CW = 375;

test("lights the dot for the slide at rest", () => {
  assert.equal(railIndex(0, SW, CW, 3), 0);
  assert.equal(railIndex(226, SW, CW, 3), 1);
  assert.equal(railIndex(453, SW, CW, 3), 2);
});

test("the last dot lights even though the last slide never centres", () => {
  // 453 is the whole scrollable track: the rail cannot go further.
  assert.equal(railIndex(SW - CW, SW, CW, 3), 2);
});

test("stays in range on overscroll in either direction", () => {
  assert.equal(railIndex(-80, SW, CW, 3), 0);
  assert.equal(railIndex(900, SW, CW, 3), 2);
});

test("a rail with nothing to scroll has no second dot to light", () => {
  assert.equal(railIndex(0, 375, 375, 1), 0);
  assert.equal(railIndex(120, 375, 375, 3), 0);
});
