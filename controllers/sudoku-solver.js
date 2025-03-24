  class SudokuSolver {

    validate(puzzleString) {
      if(/[^1-9.]/.test(puzzleString)) {
        return 'Invalid characters in puzzle'
      }
      if(puzzleString.length !== 81) {
        return 'Expected puzzle to be 81 characters long'
      }
      return ''
    }

    checkRowPlacement(puzzleString, row, column, value) {
      for(let i = 0; i < 9; i++ ) {
        if(puzzleString[((row - 1) * 9) + i] === value) return false
      }
      return true
    }

    checkColPlacement(puzzleString, row, column, value) {
      for (let i = 0; i < 9; i++) { 
          if (puzzleString[(column - 1) + (i * 9)] === value) return false;
      }
      return true;
    }

    // This also works
    // checkColPlacement(puzzleString, row, column, value) {
    //   for(let i = 0; i < 81; i += 9 ) {
    //     if(puzzleString[(column - 1) + i] === value) return false
    //   }
    //   return true
    // }

    checkRegionPlacement(puzzleString, row, column, value) {
      let startRow = Math.floor((row - 1) / 3) * 3;
      let startCol = Math.floor((column - 1) / 3) * 3;
  
      for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
              let index = (startRow + i) * 9 + (startCol + j);
              if (puzzleString[index] === value) return false;
          }
      }
      return true;
  }
  
  solve(puzzleString) {
    let puzzleArray = puzzleString.split(""); 

    const solveHelper = () => {
        for (let i = 0; i < puzzleArray.length; i++) {
            if (puzzleArray[i] === ".") {
                let row = Math.floor(i / 9) + 1;
                let column = (i % 9) + 1;

                for (let num = 1; num <= 9; num++) {  // Try numbers 1-9
                    let value = num.toString();

                    if (
                        this.checkRowPlacement(puzzleArray, row, column, value) &&
                        this.checkColPlacement(puzzleArray, row, column, value) &&
                        this.checkRegionPlacement(puzzleArray, row, column, value)
                    ) {
                        puzzleArray[i] = value;  

                        if (solveHelper()) return true;  // Recursive call

                        puzzleArray[i] = ".";  // Backtrack
                    }
                }
                return false;  // No valid number found, trigger backtracking or finally return false
            }
        }
        return true;  // Solution found
    };

    if (!solveHelper()) return "Puzzle cannot be solved";

    return puzzleArray.join("");
}

  
  }

  module.exports = SudokuSolver;

