# TO RUN FILE:
# uvicorn main:app --reload

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.scores import app as scores_router
from routes.users import app as users_router
from utils.database_connector import db, cursor

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

app.include_router(scores_router, prefix="/scores")
app.include_router(users_router, prefix="/users")