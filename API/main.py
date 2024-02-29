# TO RUN FILE:
# uvicorn main:app --reload

from fastapi import FastAPI
from routes.scores import app as scores_router
from routes.users import app as users_router
from utils.database_connector import db, cursor

app = FastAPI()

app.include_router(scores_router, prefix="/scores")
app.include_router(user_router, prefix="/users")