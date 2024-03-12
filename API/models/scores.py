from pydantic import BaseModel

class Score(BaseModel):
    scoreID: int
    score: int
    difficulty: str
    userID: int

class CreateScore(BaseModel):
    score: int
    difficulty: str
    sessionToken: str