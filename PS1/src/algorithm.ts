/**
 * Problem Set 1: Flashcards - Algorithm Functions
 *
 * This file contains the implementations for the flashcard algorithm functions
 * as described in the problem set handout.
 *
 * Please DO NOT modify the signatures of the exported functions in this file,
 * or you risk failing the autograder.
 */

import { Flashcard, AnswerDifficulty, BucketMap } from "./flashcards";

/**
 * Converts a Map representation of learning buckets into an Array-of-Set representation.
 *
 * @param buckets Map where keys are bucket numbers and values are sets of Flashcards.
 * @returns Array of Sets, where element at index i is the set of flashcards in bucket i.
 *          Buckets with no cards will have empty sets in the array.
 * @spec.requires buckets is a valid representation of flashcard buckets.
 */
export function toBucketSets(buckets: BucketMap): Array<Set<Flashcard>> {
  const bucketSets: Array<Set<Flashcard>> = [];
  for (let i = 0; i <= Math.max(...Array.from(buckets.keys())); i++) {
    if (buckets.has(i)) {
      bucketSets[i] = buckets.get(i) ?? new Set<Flashcard>();
    } else {
      bucketSets[i] = new Set<Flashcard>();
    }
  }
  return bucketSets;
}

/**
 * Finds the range of buckets that contain flashcards, as a rough measure of progress.
 *
 * @param buckets Array-of-Set representation of buckets.
 * @returns object with minBucket and maxBucket properties representing the range,
 *          or undefined if no buckets contain cards.
 * @spec.requires buckets is a valid Array-of-Set representation of flashcard buckets.
 */
export function getBucketRange(
  buckets: Array<Set<Flashcard>>
): { minBucket: number; maxBucket: number } | undefined {
  // TODO: Implement this function
  let minBucket: number | undefined;
  let maxBucket: number | undefined;

  for (let i = 0; i < buckets.length; i++) {
    if (buckets[i] && buckets[i]!.size > 0) {
      if (minBucket === undefined) minBucket = i;
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
export function practice(
  buckets: Array<Set<Flashcard>>,
  day: number
): Set<Flashcard> {
  // TODO: Implement this function
  const result = new Set<Flashcard>();
  if (day < buckets.length && buckets[day]) {
    buckets[day].forEach(card => result.add(card));
  }
  return result;
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
export function update(
  buckets: BucketMap,
  card: Flashcard,
  difficulty: AnswerDifficulty
): BucketMap {
  // TODO: Implement this function
  let currentBucket = -1;

  for (const [bucket, flashcards] of buckets.entries()) {
    if (flashcards.has(card)) {
      currentBucket = bucket;
      flashcards.delete(card);
      break;
    }
  }

  if (currentBucket === -1) return buckets; // Card not found

  let newBucket = currentBucket;
  if (difficulty === AnswerDifficulty.Easy) newBucket++;
  else if (difficulty === AnswerDifficulty.Hard) newBucket = Math.max(0, currentBucket - 1);

  if (!buckets.has(newBucket)) {
    buckets.set(newBucket, new Set());
  }
  buckets.get(newBucket)!.add(card);

  return buckets;
}

/**
 * Generates a hint for a flashcard.
 *
 * @param card flashcard to hint
 * @returns a hint for the front of the flashcard.
 * @spec.requires card is a valid Flashcard.
 */
export function getHint(card: Flashcard): string {
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
export function computeProgress(buckets: BucketMap, history: any): any {
  // Replace 'any' with appropriate types
  // TODO: Implement this function (and define the spec!)
  let totalCards = 0;
  let learnedCards = 0;

  for (const [bucket, flashcards] of buckets.entries()) {
    totalCards += flashcards.size;
    if (bucket > 3) learnedCards += flashcards.size;
  }

  return {
    totalCards,
    learnedCards,
    progress: totalCards > 0 ? learnedCards / totalCards : 0,
  };
}
