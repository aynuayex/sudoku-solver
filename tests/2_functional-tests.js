const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const puzzleString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
const puzzleSolutionString = "769235418851496372432178956174569283395842761628713549283657194516924837947381625"

suite('Functional Tests', () => {

  suite("POST request to /api/solve", () => {
    
    test("Solve a puzzle with valid puzzle string", function (done) {
        chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .send({
          "puzzle": puzzleString
        })
        .end(function (err, res) {
          assert.equal(res.status,200);
          assert.equal(res.type,"application/json");
          assert.equal(res.body.solution, puzzleSolutionString);

          done();
        });
    })

    test("Solve a puzzle with missing puzzle string", function (done) {
        chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .send({
          "puzzle": ""
        })
        .end(function (err, res) {
          assert.equal(res.status,200);
          assert.equal(res.type,"application/json");
          assert.equal(res.body.error,"Required field missing");

          done();
        });
    })

    test("Solve a puzzle with invalid characters", function (done) {
      let InvalidPuzzleArray = puzzleString.split("");
          InvalidPuzzleArray[6] = "p"
        
        chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .send({
          "puzzle": InvalidPuzzleArray.join("")
        })
        .end(function (err, res) {
          assert.equal(res.status,200);
          assert.equal(res.type,"application/json");
          assert.equal(res.body.error,"Invalid characters in puzzle");

          done();
        });
    })
    
    test("Solve a puzzle with incorrect length", function (done) {
        chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .send({
          "puzzle": `${puzzleString}7777777`
        })
        .end(function (err, res) {
          assert.equal(res.status,200);
          assert.equal(res.type,"application/json");
          assert.equal(res.body.error,"Expected puzzle to be 81 characters long");

          done();
        });
    })

    test("Solve a puzzle that cannot be solved", function (done) {
      let InvalidPuzzleArray = puzzleString.split("");
          InvalidPuzzleArray[6] = "5"

        chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .send({
          "puzzle": InvalidPuzzleArray.join("")
        })
        .end(function (err, res) {
          assert.equal(res.status,200);
          assert.equal(res.type,"application/json");
          assert.equal(res.body.error,"Puzzle cannot be solved");

          done();
        });
    })
  })


suite("POST request to /api/check", () => {

  test("Check a puzzle placement with all fields", function (done) {
      chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        "puzzle": puzzleString,
        "coordinate": "a1",
        "value": "7",
      })
      .end(function (err, res) {
        assert.equal(res.status,200);
        assert.equal(res.type,"application/json");
        assert.equal(res.body.valid,true);
  
        done();
      });
  })
  
  test("Check a puzzle placement with single placement conflict", function (done) {
      chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        "puzzle": puzzleString,
        "coordinate": "a1",
        "value": "6"
      })
      .end(function (err, res) {
        assert.equal(res.status,200);
        assert.equal(res.type,"application/json");
        assert.equal(res.body.valid, false);
        assert.include(res.body.conflict, "column");
  
        done();
      });
  })
  
  test("Check a puzzle placement with multiple placement conflicts", function (done) {
      chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        "puzzle": puzzleString,
        "coordinate": "a1",
        "value": "1",
      })
      .end(function (err, res) {
        assert.equal(res.status,200);
        assert.equal(res.type,"application/json");
        assert.equal(res.body.valid, false);
        assert.include(res.body.conflict, "row");
        assert.include(res.body.conflict, "column");
  
        done();
      });
  })
  
  test("Check a puzzle placement with all placement conflicts", function (done) {
      chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        "puzzle": puzzleString,
        "coordinate": "B3",
        "value": "2"
      })
      .end(function (err, res) {
        assert.equal(res.status,200);
        assert.equal(res.type,"application/json");
        assert.equal(res.body.valid, false);
        assert.include(res.body.conflict, "row");
        assert.include(res.body.conflict, "column");
        assert.include(res.body.conflict, "region");
  
        done();
      });
  })
  
  test("Check a puzzle placement with missing required fields", function (done) {
      chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        "puzzle": puzzleString
      })
      .end(function (err, res) {
        assert.equal(res.status,200);
        assert.equal(res.type,"application/json");
        assert.equal(res.body.error,"Required field(s) missing");
  
        done();
      });
  })
  
  test("Check a puzzle placement with invalid characters", function (done) {
    let InvalidPuzzleArray = puzzleString.split("");
        InvalidPuzzleArray[6] = "p"
        
      chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        "puzzle": InvalidPuzzleArray.join(""),
        "coordinate": "a1",
        "value": "7"
      })
      .end(function (err, res) {
        assert.equal(res.status,200);
        assert.equal(res.type,"application/json");
        assert.equal(res.body.error,"Invalid characters in puzzle");
  
        done();
      });
  })
  
  test("Check a puzzle placement with incorrect length", function (done) {
      chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        "puzzle": `${puzzleString}7777777`,
        "coordinate": "a1",
        "value": "7"
      })
      .end(function (err, res) {
        assert.equal(res.status,200);
        assert.equal(res.type,"application/json");
        assert.equal(res.body.error,"Expected puzzle to be 81 characters long");
  
        done();
      });
  })
  
  test("Check a puzzle placement with invalid placement coordinate", function (done) {
      chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        "puzzle": puzzleString,
        "coordinate": "z1",
        "value": "7"
      })
      .end(function (err, res) {
        assert.equal(res.status,200);
        assert.equal(res.type,"application/json");
        assert.equal(res.body.error,"Invalid coordinate");
  
        done();
      });
  })
  
  test("Check a puzzle placement with invalid placement value", function (done) {
      chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        "puzzle": puzzleString,
        "coordinate": "a1",
        "value": "10"
      })
      .end(function (err, res) {
        assert.equal(res.status,200);
        assert.equal(res.type,"application/json");
        assert.equal(res.body.error,"Invalid value");
  
        done();
      });
  })

})


});

