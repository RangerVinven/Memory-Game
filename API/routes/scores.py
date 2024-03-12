from fastapi import APIRouter, Response, status, HTTPException

from models.scores import CreateScore, SessionTokenScore

from utils.database_connector import db, cursor

app = APIRouter()

# Gets the userID for a user given the session token
def getUserIDFromSessionToken(sessionToken: str):
    # Gets all IDs with a matchin session token
    cursor.execute("SELECT userID FROM Users WHERE session_token=%s", (sessionToken,))
    ids = cursor.fetchall()

    # If no userID exists with that session token
    if len(ids) == 0:
        return ""
    
    return ids[0]["userID"]

# Lists all the scores in the database
@app.get("/all")
def listScores():
    cursor.execute("SELECT * FROM Scores;")
    return cursor.fetchall()

# Gets the highscores for either the Easy, Medium or Hard scores
# If the user passes in their session token, it shows just their scores
# If not, then it gets the scores from all the users
@app.get("/highscores")
def getHighScores(sessionToken: SessionTokenScore | None = None, difficulty: str = "Easy"):

    # Ensures difficulty is either Easy, Medium or Hard
    if difficulty not in ["Easy", "Medium", "Hard"]:
        return HTTPException(status_code=400, detail="Difficulty must be Easy, Medium or Hard")

    # Defines the query so far
    query = "SELECT score, userID FROM Scores WHERE difficulty=%s "
    variables = [difficulty]

    # If the user is wants to see their personal scores
    if sessionToken:
        userID = getUserIDFromSessionToken(sessionToken.sessionToken)

        # Returns an error 400 if the user enters an invalid session token
        if userID == "":
            return HTTPException(status_code=400, detail="Invalid session token")
        
        query += "AND userID=%s"
        variables.append(userID)

    # Gets and returns the userID
    cursor.execute(query + " ORDER BY score asc LIMIT 10;", tuple(variables))

    # TODO: Change userID to the username
    return cursor.fetchall()

# Creates a score
@app.post("/")
def createScore(score: CreateScore):
    userID = getUserIDFromSessionToken(score.sessionToken)

    # Ensures the user has a valid session token
    if userID == "":
        return HTTPException(status_code=401, detail="Invalid session token")

    # Ensures difficulty is either Easy, Medium or Hard
    if score.difficulty not in ["Easy", "Medium", "Hard"]:
        return HTTPException(status_code=400, detail="Difficulty must be Easy, Medium or Hard")

    # Adds the scores
    cursor.execute("INSERT INTO Scores (score, difficulty, userID) VALUES (%s, %s, %s);", (score.score, score.difficulty, userID))
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