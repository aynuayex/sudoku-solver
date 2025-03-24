const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

const puzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
const puzzleSolutionString = "769235418851496372432178956174569283395842761628713549283657194516924837947381625"

suite('Unit Tests', () => {
    suite("puzzle string validation tests", () => {
        test("Logic handles a valid puzzle string of 81 characters", function () {
            assert.equal(solver.validate(puzzleString) , '', "Logic handles a valid puzzle string of 81 characters")
        })
        test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", function () {
            let InvalidPuzzleArray = puzzleString.split("");
                InvalidPuzzleArray[6] = "p"
            assert.equal(solver.validate(InvalidPuzzleArray.join("")), 'Invalid characters in puzzle', "Logic handles a puzzle string with invalid characters (not 1-9 or .)")
        })
        test("Logic handles a puzzle string that is not 81 characters in length", function () {
            assert.equal(solver.validate(`${puzzleString}7777777`), 'Expected puzzle to be 81 characters long', "Logic handles a puzzle string that is not 81 characters in length")
        })
    })

    suite("row placement check tests", () => {
        test("Logic handles a valid row placement", function() {
            assert.equal(solver.checkRowPlacement(puzzleString, 1, 1, 7),true)
        })
        test("Logic handles an invalid row placement", function() {
            assert.equal(solver.checkRowPlacement(puzzleString, 1, 1, '1'),false)
        })
    })

    suite("column placement check tests",() => {
        test("Logic handles a valid column placement", function() {
            assert.equal(solver.checkColPlacement(puzzleString, 1, 1, 7),true)
        })
        test("Logic handles an invalid column placement", function() {
            assert.equal(solver.checkColPlacement(puzzleString, 1, 1, '6'),false)
        })
    })

    suite("region placement check tests",() => {
        test("Logic handles a valid region (3x3 grid) placement", function() {
            assert.equal(solver.checkRegionPlacement(puzzleString, 1, 1, 7),true)
        })
        test("Logic handles an invalid region (3x3 grid) placement", function() {
            assert.equal(solver.checkRegionPlacement(puzzleString, 1, 1, '4'),false)
        })
    })

    suite("solver function tests",() => {
        test("Valid puzzle strings pass the solver", function() {
            assert.notEqual(solver.solve(puzzleString) ,"Puzzle cannot be solved")
        })
        test("Invalid puzzle strings fail the solver", function() {
            let InvalidPuzzleArray = puzzleString.split("");
                InvalidPuzzleArray[6] = "5"

            assert.equal(solver.solve(InvalidPuzzleArray.join("")),"Puzzle cannot be solved")
        })
        test("Solver returns the expected solution for an incomplete puzzle", function() {
            assert.equal(solver.solve(puzzleString), puzzleSolutionString)
        })
    })
});
