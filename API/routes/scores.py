from fastapi import APIRouter, Response, status, HTTPException

from models.scores import CreateScore

from utils.database_connector import db, cursor

app = APIRouter()

# TODO:
# [ ] - Add function to get the userID from the session token
# [ ] - Add function that gets the username from the userID 

# Lists all the scores in the database
@app.get("/all")
def listScores():
    cursor.execute("SELECT * FROM Scores;")
    return cursor.fetchall()

# Gets the highscores for either the Easy, Medium or Hard scores
@app.get("/highscores")
def getHighScores(difficulty: str = "Easy"):

    # Ensures difficulty is either Easy, Medium or Hard
    if difficulty not in ["Easy", "Medium", "Hard"]:
        return HTTPException(status_code=400, detail="Difficulty must be Easy, Medium or Hard")

    # Gets and returns the userID
    cursor.execute("SELECT score, userID FROM Scores WHERE difficulty=%s ORDER BY score asc LIMIT 10;", (difficulty,))

    # TODO: Change userID to the username
    return cursor.fetchall()

# Creates a score
@app.post("/")
def createScore(score: CreateScore):
    # TODO:
    # Add a function that finds the userID from the session token

    # Ensures difficulty is either Easy, Medium or Hard
    if score.difficulty not in ["Easy", "Medium", "Hard"]:
        return HTTPException(status_code=400, detail="Difficulty must be Easy, Medium or Hard")

    # Adds the scores
    cursor.execute("INSERT INTO Scores (score, difficulty, userID) VALUES (%s, %s, %s);", (score.score, score.difficulty, 1234))
    db.commit()

# Returns the data for a specifc score, given the scoreID
@app.get("/{scoreID}")
def getScore(scoreID, response: Response):

    # Gets the data of the score
    cursor.execute("SELECT * FROM Scores WHERE scoreID=%s", (scoreID,))
    score = cursor.fetchone()

    # If the cursor returned nothing (if the score doesn't exist)
    if not score:
        response.status_code = status.HTTP_404_NOT_FOUND
        return
    
    return score