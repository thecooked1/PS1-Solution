"use strict";
/**
 * Problem Set 1: Flashcards - Algorithm Functions
 *
 * This file contains the implementations for the flashcard algorithm functions
 * as described in the problem set handout.
 *
 * Please DO NOT modify the signatures of the exported functions in this file,
 * or you risk failing the autograder.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBucketSets = toBucketSets;
exports.getBucketRange = getBucketRange;
exports.practice = practice;
exports.update = update;
exports.getHint = getHint;
exports.computeProgress = computeProgress;
const flashcards_1 = require("./flashcards");
/**
 * Converts a Map representation of learning buckets into an Array-of-Set representation.
 *
 * @param buckets Map where keys are bucket numbers and values are sets of Flashcards.
 * @returns Array of Sets, where element at index i is the set of flashcards in bucket i.
 *          Buckets with no cards will have empty sets in the array.
 * @spec.requires buckets is a valid representation of flashcard buckets.
 */
function toBucketSets(buckets) {
    // Find the highest bucket number to determine array size
    const maxBucket = Math.max(...buckets.keys(), 0);
    // Initialize an array with empty sets
    const bucketArray = Array.from({ length: maxBucket + 1 }, () => new Set());
    // Populate the array with existing bucket sets
    for (const [bucket, flashcards] of buckets.entries()) {
        bucketArray[bucket] = flashcards;
    }
    return bucketArray;
}
/**
 * Finds the range of buckets that contain flashcards, as a rough measure of progress.
 *
 * @param buckets Array-of-Set representation of buckets.
 * @returns object with minBucket and maxBucket properties representing the range,
 *          or undefined if no buckets contain cards.
 * @spec.requires buckets is a valid Array-of-Set representation of flashcard buckets.
 */
function getBucketRange(buckets) {
    // TODO: Implement this function
    let minBucket;
    let maxBucket;
    for (let i = 0; i < buckets.length; i++) {
        if (buckets[i] && buckets[i].size > 0) {
            if (minBucket === undefined)
                minBucket = i;
            maxBucket = i;
        }
    }
    return minBucket !== undefined && maxBucket !== undefined
        ? { minBucket, maxBucket }
        : undefined;
}
/**
 * Selects cards to practice on a particular day.
 *
 * @param buckets Array-of-Set representation of buckets.
 * @param day current day number (starting from 0).
 * @returns a Set of Flashcards that should be practiced on day `day`,
 *          according to the Modified-Leitner algorithm.
 * @spec.requires buckets is a valid Array-of-Set representation of flashcard buckets.
 */
function practice(buckets, day) {
    // TODO: Implement this function
    const practiceSet = new Set();
    for (let i = 0; i < buckets.length; i++) {
        if (buckets[i] && buckets[i].size > 0 && day % (i + 1) === 0) {
            buckets[i].forEach((card) => practiceSet.add(card));
        }
    }
    return practiceSet;
}
/**
 * Updates a card's bucket number after a practice trial.
 *
 * @param buckets Map representation of learning buckets.
 * @param card flashcard that was practiced.
 * @param difficulty how well the user did on the card in this practice trial.
 * @returns updated Map of learning buckets.
 * @spec.requires buckets is a valid representation of flashcard buckets.
 */
function update(buckets, card, difficulty) {
    // TODO: Implement this function
    let currentBucket = -1;
    for (const [bucket, flashcards] of buckets.entries()) {
        if (flashcards.has(card)) {
            currentBucket = bucket;
            flashcards.delete(card);
            break;
        }
    }
    if (currentBucket === -1)
        return buckets; // Card not found
    let newBucket = currentBucket;
    if (difficulty === flashcards_1.AnswerDifficulty.Easy)
        newBucket++;
    else if (difficulty === flashcards_1.AnswerDifficulty.Hard)
        newBucket = Math.max(0, currentBucket - 1);
    if (!buckets.has(newBucket)) {
        buckets.set(newBucket, new Set());
    }
    buckets.get(newBucket).add(card);
    return buckets;
}
/**
 * Generates a hint for a flashcard.
 *
 * @param card flashcard to hint
 * @returns a hint for the front of the flashcard.
 * @spec.requires card is a valid Flashcard.
 */
function getHint(card) {
    // TODO: Implement this function (and strengthen the spec!)
    return card.front.length > 1 ? card.front[0] + "_" : "?";
}
/**
 * Computes statistics about the user's learning progress.
 *
 * @param buckets representation of learning buckets.
 * @param history representation of user's answer history.
 * @returns statistics about learning progress.
 * @spec.requires [SPEC TO BE DEFINED]
 */
function computeProgress(buckets, history) {
    // Replace 'any' with appropriate types
    // TODO: Implement this function (and define the spec!)
    let totalCards = 0;
    let learnedCards = 0;
    for (const [bucket, flashcards] of buckets.entries()) {
        totalCards += flashcards.size;
        if (bucket > 3)
            learnedCards += flashcards.size;
    }
    return {
        totalCards,
        learnedCards,
        progress: totalCards > 0 ? learnedCards / totalCards : 0,
    };
}
