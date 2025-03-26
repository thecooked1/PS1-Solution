import { expect } from "chai";
import {
  chordLength,
  distance,
  drawSquare,
  drawApproximateCircle,
  findPath,
  drawPersonalArt,
} from "../src/turtlesoup"; // Import functions to test
import { SimpleTurtle, Point } from "../src/turtle";

function assertAlmostEqual(
  actual: number,
  expected: number,
  delta: number = 0.001,
  message?: string
): void {
  expect(actual).to.be.closeTo(expected, delta, message);
}

describe("chordLength", () => {
  it("acute angle, integer result", () => {
    assertAlmostEqual(chordLength(5, 60), 5, 0.001);;
  });

  it("right angle, decimal result", () => {
    assertAlmostEqual(chordLength(5, 90), 7.071, 0.001); // Example with delta
  });

  it("obtuse angle, decimal result", () => {
    assertAlmostEqual(chordLength(5, 120), 8.66, 0.001);
  });
});

describe("distance", () => {
  it("for p1.x = p2.x, p1.y != p2.y", () => {
    const p1: Point = { x: 0, y: 0 };
    const p2: Point = { x: 0, y: 5 };
    expect(distance(p1, p2)).to.equal(5);
  });

  it("for p1.x != p2.x, p1.y != p2.y", () => {
    const p1: Point = { x: 0, y: 0 };
    const p2: Point = { x: 3, y: 4 };
    expect(distance(p1, p2)).to.equal(5);
  });

  it("for p1.x = p2.x, p1.y = p2.y", () => {
    const p1: Point = { x: 2, y: 2 };
    const p2: Point = { x: 2, y: 2 };
    expect(distance(p1, p2)).to.equal(0);
  });
});

describe("drawSquare", () => {
  it("should draw a square (manual visual check - output.html)", () => {
    const turtle = new SimpleTurtle();
    const startPosition = turtle.getPosition();
    
    drawSquare(turtle, 50);

    // Use a tolerance check instead of strict equality
    assertAlmostEqual(turtle.getPosition().x, startPosition.x, 0.001);
    assertAlmostEqual(turtle.getPosition().y, startPosition.y, 0.001);

    // Ensure the turtle's heading is back to the original (0 degrees)
    expect(turtle.getHeading()).to.equal(0);
    // You'll need to visually inspect output.html to verify the square is drawn correctly.
    // Add more assertions if you want to test turtle's internal state (position, heading, etc.)
  });
});

describe("drawApproximateCircle", () => {
  it("should draw an approximate circle (manual visual check - output.html)", () => {
    const turtle = new SimpleTurtle();
    const startPosition = turtle.getPosition();
    drawApproximateCircle(turtle, 30, 36);
    const finalPosition = turtle.getPosition();
    assertAlmostEqual(distance(startPosition, finalPosition), 0, 1.0);
    // Visual check of output.html
  });
});

describe("findPath", () => {
  it("example path finding (conceptual check)", () => {
    const turtle = new SimpleTurtle();
  const points: Point[] = [
    { x: 10, y: 10 },
    { x: 40, y: 10 },
    { x: 40, y: 40 },
  ];
  const pathInstructions = findPath(turtle, points);
  
  expect(pathInstructions).to.be.an("array").that.is.not.empty;
  expect(pathInstructions[0]).to.match(/turn|forward/);
    // More detailed tests would involve analyzing the *content* of pathInstructions if you define a specific output format.
  });
});

describe("drawPersonalArt", () => {
  it("should draw personal art (manual visual check - output.html)", () => {
    const turtle = new SimpleTurtle();
    drawPersonalArt(turtle);
    // Visual check of output.html
  });
});
