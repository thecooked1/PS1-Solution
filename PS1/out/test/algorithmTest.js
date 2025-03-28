"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const flashcards_1 = require("../src/flashcards");
const algorithm_1 = require("../src/algorithm");
/*
 * Testing strategy for toBucketSets():
 *
 * TODO: Describe your testing strategy for toBucketSets() here.
 */
describe("toBucketSets()", () => {
    it("should return an empty array for an empty bucket map", () => {
        const buckets = new Map();
        assert_1.default.deepStrictEqual((0, algorithm_1.toBucketSets)(buckets), []);
    });
    it("should correctly convert a single bucket", () => {
        const card = new flashcards_1.Flashcard("Front", "Back", "Hint", []);
        const buckets = new Map([[0, new Set([card])]]);
        assert_1.default.deepStrictEqual((0, algorithm_1.toBucketSets)(buckets), [new Set([card])]);
    });
    it("should handle non-sequential buckets correctly", () => {
        const card1 = new flashcards_1.Flashcard("F1", "B1", "Hint", []);
        const card2 = new flashcards_1.Flashcard("F2", "B2", "Hint", []);
        const buckets = new Map([
            [0, new Set([card1])],
            [2, new Set([card2])],
        ]);
        assert_1.default.deepStrictEqual((0, algorithm_1.toBucketSets)(buckets), [
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
        assert_1.default.strictEqual((0, algorithm_1.getBucketRange)([]), undefined);
    });
    it("should return correct range for a single occupied bucket", () => {
        const card = new flashcards_1.Flashcard("F1", "B1", "Hint", []);
        assert_1.default.deepStrictEqual((0, algorithm_1.getBucketRange)([new Set([card])]), { minBucket: 0, maxBucket: 0 });
    });
    it("should return correct range for multiple occupied buckets", () => {
        const card1 = new flashcards_1.Flashcard("F1", "B1", "Hint", []);
        const card2 = new flashcards_1.Flashcard("F2", "B2", "Hint", []);
        const buckets = [
            new Set([card1]),
            new Set(),
            new Set([card2]),
        ];
        assert_1.default.deepStrictEqual((0, algorithm_1.getBucketRange)(buckets), { minBucket: 0, maxBucket: 2 });
    });
});
/*
 * Testing strategy for practice():
 *
 * TODO: Describe your testing strategy for practice() here.
 */
describe("practice()", () => {
    it("should return an empty set when all buckets are empty", () => {
        const buckets = [new Set(), new Set()];
        assert_1.default.deepStrictEqual((0, algorithm_1.practice)(buckets, 0), new Set());
    });
    it("should return cards from the correct bucket based on day", () => {
        const card1 = new flashcards_1.Flashcard("F1", "B1", "Hint", []);
        const card2 = new flashcards_1.Flashcard("F2", "B2", "Hint", []);
        // Explicitly typing Set<Flashcard> for each bucket
        const buckets = [
            new Set([card1]), // Bucket 0 contains card1
            new Set(), // Bucket 1 is empty
            new Set([card2]) // Bucket 2 contains card2
        ];
        assert_1.default.deepStrictEqual((0, algorithm_1.practice)(buckets, 0), new Set([card1])); // Cards from bucket 0
        assert_1.default.deepStrictEqual((0, algorithm_1.practice)(buckets, 2), new Set([card2])); // Cards from bucket 2
    });
    it("should not return cards if day does not match bucket interval", () => {
        const card = new flashcards_1.Flashcard("Front", "Back", "Hint", []);
        const buckets = [
            new Set(), // Bucket 0 is empty
            new Set([card]) // Bucket 1 contains card
        ];
        // At day 0, no cards should be returned
        assert_1.default.deepStrictEqual((0, algorithm_1.practice)(buckets, 0), new Set());
        // At day 1, card from bucket 1 should be returned
        assert_1.default.deepStrictEqual((0, algorithm_1.practice)(buckets, 1), new Set([card]));
    });
});
/*
 * Testing strategy for update():
 *
 * TODO: Describe your testing strategy for update() here.
 */
describe("update()", () => {
    it("should do nothing if the card is not found", () => {
        const buckets = new Map([[0, new Set()]]);
        const card = new flashcards_1.Flashcard("Front", "Back", "Hint", []);
        assert_1.default.deepStrictEqual((0, algorithm_1.update)(buckets, card, flashcards_1.AnswerDifficulty.Easy), buckets);
    });
    it("should move card to next bucket on easy", () => {
        const card = new flashcards_1.Flashcard("F1", "B1", "Hint", []);
        const buckets = new Map([[0, new Set([card])]]);
        const updatedBuckets = (0, algorithm_1.update)(buckets, card, flashcards_1.AnswerDifficulty.Easy);
        (0, assert_1.default)(updatedBuckets.get(1)?.has(card));
    });
    it("should move card to previous bucket on hard", () => {
        const card = new flashcards_1.Flashcard("F1", "B1", "Hint", []);
        const buckets = new Map([[1, new Set([card])]]);
        const updatedBuckets = (0, algorithm_1.update)(buckets, card, flashcards_1.AnswerDifficulty.Hard);
        (0, assert_1.default)(updatedBuckets.get(0)?.has(card));
    });
    it("should not move below bucket 0", () => {
        const card = new flashcards_1.Flashcard("F1", "B1", "Hint", []);
        const buckets = new Map([[0, new Set([card])]]);
        const updatedBuckets = (0, algorithm_1.update)(buckets, card, flashcards_1.AnswerDifficulty.Hard);
        (0, assert_1.default)(updatedBuckets.get(0)?.has(card));
    });
});
/*
 * Testing strategy for getHint():
 *
 * TODO: Describe your testing strategy for getHint() here.
 */
describe("getHint()", () => {
    it("should return '?' for an empty front", () => {
        const card = new flashcards_1.Flashcard("", "Back", "Hint", []);
        assert_1.default.strictEqual((0, algorithm_1.getHint)(card), "?");
    });
    it("should return first letter and '_' for a non-empty front", () => {
        const card = new flashcards_1.Flashcard("Apple", "Back", "Hint", []);
        assert_1.default.strictEqual((0, algorithm_1.getHint)(card), "A_");
    });
    it("should return '?' for a single-character front", () => {
        const card = new flashcards_1.Flashcard("A", "Back", "Hint", []);
        assert_1.default.strictEqual((0, algorithm_1.getHint)(card), "?");
    });
});
/*
 * Testing strategy for computeProgress():
 *
 * TODO: Describe your testing strategy for computeProgress() here.
 */
describe("computeProgress()", () => {
    it("should return 0 progress when there are no cards", () => {
        assert_1.default.deepStrictEqual((0, algorithm_1.computeProgress)(new Map(), []), { totalCards: 0, learnedCards: 0, progress: 0 });
    });
    it("should compute correct progress", () => {
        const card1 = new flashcards_1.Flashcard("F1", "B1", "Hint", []);
        const card2 = new flashcards_1.Flashcard("F2", "B2", "Hint", []);
        const buckets = new Map([
            [1, new Set([card1])],
            [4, new Set([card2])],
        ]);
        const progress = (0, algorithm_1.computeProgress)(buckets, []);
        assert_1.default.strictEqual(progress.totalCards, 2);
        assert_1.default.strictEqual(progress.learnedCards, 1);
        assert_1.default.strictEqual(progress.progress, 0.5);
    });
});
