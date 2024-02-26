from fastapi import FastAPI
from routes.scores import app as scores_router

app = FastAPI()

app.include_router(scores_router, prefix="/scores")