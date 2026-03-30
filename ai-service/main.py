import uvicorn
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv
 
from ingest import ingest_file
from chat import chat_with_notes


load_dotenv()



app = FastAPI(title="AI Interviewer Microservice", version="2.0")

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.post("/ingest")
async def ingest(data:dict):
    return await ingest_file(data)

@app.post("/ask")
async def chat(data:dict):
    return await chat_with_notes(data)



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)