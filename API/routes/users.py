from fastapi import APIRouter, Response, status, HTTPException

from utils.database_connector import db, cursor

app = APIRouter()

@app.get("")