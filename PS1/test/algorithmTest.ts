import assert from "assert";
import { AnswerDifficulty, Flashcard, BucketMap } from "../src/flashcards";
import {
  toBucketSets,
  getBucketRange,
  practice,
  update,
  getHint,
  computeProgress,
} from "../src/algorithm";

/*
 * Testing strategy for toBucketSets():
 *
 * TODO: Describe your testing strategy for toBucketSets() here.
 */
describe("toBucketSets()", () => {
  it("should return an empty array for an empty bucket map", () => {
    const buckets: BucketMap = new Map();
    assert.deepStrictEqual(toBucketSets(buckets), []);
  });

  it("should correctly convert a single bucket", () => {
    const card = new Flashcard("Front", "Back", "Hint", []);
    const buckets: BucketMap = new Map([[0, new Set([card])]]);
    assert.deepStrictEqual(toBucketSets(buckets), [new Set([card])]);
  });

  it("should handle non-sequential buckets correctly", () => {
    const card1 = new Flashcard("F1", "B1", "Hint", []);
    const card2 = new Flashcard("F2", "B2", "Hint", []);
    const buckets: BucketMap = new Map([
      [0, new Set([card1])],
      [2, new Set([card2])],
    ]);
    assert.deepStrictEqual(toBucketSets(buckets), [
      new Set([card1]),
      new Set(),
      new Set([card2]),
    ]);
  });
});

/*
 * Testing strategy for getBucketRange():
 *
 * TODO: Describe your testing strategy for getBucketRange() here.
 */
describe("getBucketRange()", () => {
  it("should return undefined for an empty array", () => {
    assert.strictEqual(getBucketRange([]), undefined);
  });

  it("should return correct range for a single occupied bucket", () => {
    const card = new Flashcard("F1", "B1", "Hint", []);
    assert.deepStrictEqual(getBucketRange([new Set([card])]), { minBucket: 0, maxBucket: 0 });
  });

  it("should return correct range for multiple occupied buckets", () => {
    const card1 = new Flashcard("F1", "B1", "Hint", []);
    const card2 = new Flashcard("F2", "B2", "Hint", []);
    const buckets: Set<Flashcard>[] = [
      new Set<Flashcard>([card1]),
      new Set<Flashcard>(),
      new Set<Flashcard>([card2]),
    ];    
    assert.deepStrictEqual(getBucketRange(buckets), { minBucket: 0, maxBucket: 2 });
  });
});

/*
 * Testing strategy for practice():
 *
 * TODO: Describe your testing strategy for practice() here.
 */
describe("practice()", () => {
  it("should return an empty set when all buckets are empty", () => {
    const buckets: Set<Flashcard>[] = [new Set<Flashcard>(), new Set<Flashcard>()];
    assert.deepStrictEqual(practice(buckets, 0), new Set<Flashcard>());
  });

  it("should return cards from the correct bucket based on day", () => {
    const card1 = new Flashcard("F1", "B1", "Hint", []);
    const card2 = new Flashcard("F2", "B2", "Hint", []);

    // Explicitly typing Set<Flashcard> for each bucket
    const buckets: Set<Flashcard>[] = [
      new Set<Flashcard>([card1]),  // Bucket 0 contains card1
      new Set<Flashcard>(),         // Bucket 1 is empty
      new Set<Flashcard>([card2])   // Bucket 2 contains card2
    ];

    assert.deepStrictEqual(practice(buckets, 0), new Set<Flashcard>([card1]));  // Cards from bucket 0
    assert.deepStrictEqual(practice(buckets, 2), new Set<Flashcard>([card2]));  // Cards from bucket 2
  });

  it("should not return cards if day does not match bucket interval", () => {
    const card = new Flashcard("Front", "Back", "Hint", []);
    const buckets: Set<Flashcard>[] = [
      new Set<Flashcard>(),        // Bucket 0 is empty
      new Set<Flashcard>([card])   // Bucket 1 contains card
    ];

    // At day 0, no cards should be returned
    assert.deepStrictEqual(practice(buckets, 0), new Set<Flashcard>());
    
    // At day 1, card from bucket 1 should be returned
    assert.deepStrictEqual(practice(buckets, 1), new Set<Flashcard>([card]));
  });
});

/*
 * Testing strategy for update():
 *
 * TODO: Describe your testing strategy for update() here.
 */
describe("update()", () => {
  it("should do nothing if the card is not found", () => {
    const buckets: BucketMap = new Map([[0, new Set()]]);
    const card = new Flashcard("Front", "Back", "Hint", []);

    assert.deepStrictEqual(update(buckets, card, AnswerDifficulty.Easy), buckets);
  });

  it("should move card to next bucket on easy", () => {
    const card = new Flashcard("F1", "B1", "Hint", []);
    const buckets: BucketMap = new Map([[0, new Set([card])]]);
    const updatedBuckets = update(buckets, card, AnswerDifficulty.Easy);

    assert(updatedBuckets.get(1)?.has(card));
  });

  it("should move card to previous bucket on hard", () => {
    const card = new Flashcard("F1", "B1", "Hint", []);
    const buckets: BucketMap = new Map([[1, new Set([card])]]);
    const updatedBuckets = update(buckets, card, AnswerDifficulty.Hard);

    assert(updatedBuckets.get(0)?.has(card));
  });

  it("should not move below bucket 0", () => {
    const card = new Flashcard("F1", "B1", "Hint", []);
    const buckets: BucketMap = new Map([[0, new Set([card])]]);
    const updatedBuckets = update(buckets, card, AnswerDifficulty.Hard);

    assert(updatedBuckets.get(0)?.has(card));
  });
});

/*
 * Testing strategy for getHint():
 *
 * TODO: Describe your testing strategy for getHint() here.
 */
describe("getHint()", () => {
  it("should return '?' for an empty front", () => {
    const card = new Flashcard("", "Back", "Hint", []);
    assert.strictEqual(getHint(card), "?");
  });

  it("should return first letter and '_' for a non-empty front", () => {
    const card = new Flashcard("Apple", "Back", "Hint", []);
    assert.strictEqual(getHint(card), "A_");
  });

  it("should return '?' for a single-character front", () => {
    const card = new Flashcard("A", "Back", "Hint", []);
    assert.strictEqual(getHint(card), "?");
  });
});

/*
 * Testing strategy for computeProgress():
 *
 * TODO: Describe your testing strategy for computeProgress() here.
 */
describe("computeProgress()", () => {
  it("should return 0 progress when there are no cards", () => {
    assert.deepStrictEqual(computeProgress(new Map(), []), { totalCards: 0, learnedCards: 0, progress: 0 });
  });

  it("should compute correct progress", () => {
    const card1 = new Flashcard("F1", "B1", "Hint", []);
    const card2 = new Flashcard("F2", "B2", "Hint", []);
    const buckets: BucketMap = new Map([
      [1, new Set([card1])],
      [4, new Set([card2])],
    ]);

    const progress = computeProgress(buckets, []);
    assert.strictEqual(progress.totalCards, 2);
    assert.strictEqual(progress.learnedCards, 1);
    assert.strictEqual(progress.progress, 0.5);
  });
});
