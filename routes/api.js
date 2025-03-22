'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const {puzzle, coordinate, value} = req.body
      let conflict = []
      const mapCoordinate = {"A": 1, "a": 1, "B": 2, "b": 2, "C": 3, "c": 3, "D": 4, "d": 4, "E": 5, "e": 5, "F": 6, "f": 6, "G": 7, "g": 7, "H": 8, "h": 8, "I": 9, "i": 9 }
      if(!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' })
      }
      if(/[^1-9.]/.test(puzzle)) {
        return res.json({ error: 'Invalid characters in puzzle' })
      }
      if(!solver.validate(puzzle)) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' })
      }
      if(!Object.keys(mapCoordinate).includes(coordinate[0]) || !(/^[1-9]$/.test(coordinate.slice(1)))) {
        return res.json({ error: 'Invalid coordinate'})
      }
      if(!(/^[1-9]$/.test(value))) {
        return res.json({ error: 'Invalid value' })
      }
      if(!solver.checkRowPlacement(puzzle, mapCoordinate[coordinate[0]], coordinate[1], value)) {
        conflict.push("row")
      }
      if(!solver.checkColPlacement(puzzle, mapCoordinate[coordinate[0]], coordinate[1], value)) {
        conflict.push("column")
      }
      if(!solver.checkRegionPlacement(puzzle, mapCoordinate[coordinate[0]], coordinate[1], value)) {
        conflict.push("region")
      }
      const existingValue = puzzle[(mapCoordinate[coordinate[0]] - 1) * 9 + (parseInt(coordinate[1]) - 1)];
      if (existingValue === value) {
          return res.json({ valid: true });
      }

      // update here to check if it return true
      // If the puzzle is invalid or cannot be solved
      if(conflict.length > 0 ) {
        return res.json({valid: false, conflict})
      }

      res.json({valid: true})
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const {puzzle} = req.body
      if(!puzzle) {
        return res.json({ error: 'Required field missing' })
      }
      if(/[^0-9.]/.test(puzzle)) {
        return res.json({ error: 'Invalid characters in puzzle' })
      }
      if(!solver.validate(puzzle)) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' })
      }
      // update here to check if it return true
      // If the puzzle is invalid or cannot be solved
      const solution = solver.solve(puzzle);

      if (solution === "Puzzle cannot be solved") {
          return res.json({ error: 'Puzzle cannot be solved' });
      }

      res.json({ solution });
    });
};
