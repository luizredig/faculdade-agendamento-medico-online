from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

class Medico(BaseModel):
    id: int
    nome: str
    especialidade: str

medicos = []

@app.get("/medicos")
def listar_medicos():
    return medicos

@app.post("/medicos")
def cadastrar_medico(medico: Medico):
    medicos.append(medico)
    return medico

if __name__ == "__main__":
    port = int(os.getenv("PORT", 3002))
    uvicorn.run(app, host="0.0.0.0", port=port)
