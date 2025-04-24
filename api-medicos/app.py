from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import os
import json
import redis
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

class Medico(BaseModel):
    id: int
    nome: str
    especialidade: str

medicos = [
    Medico(id=1, nome="Dr. João", especialidade="Cardiologia"),
    Medico(id=2, nome="Dra. Maria", especialidade="Pediatria"),
    Medico(id=3, nome="Dr. Pedro", especialidade="Ortopedia"),
    Medico(id=4, nome="Dra. Ana", especialidade="Dermatologia"),
    Medico(id=5, nome="Dr. Carlos", especialidade="Neurologia"),
]

redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST"),
    port=os.getenv("REDIS_PORT"),
    decode_responses=True
)

@app.get("/medicos")
def listar_medicos():
    cache_key = "medicos:listar"
    
    if redis_client.exists(cache_key):
        return json.loads(redis_client.get(cache_key))

    redis_client.setex(cache_key, 60, json.dumps([medico.dict() for medico in medicos]))
    return medicos

@app.get("/medicos/{id}")
def get_medico_por_id(id: int):
    cache_key = f"medicos:{id}"

    if redis_client.exists(cache_key):
        return json.loads(redis_client.get(cache_key))

    medico = next((m for m in medicos if m.id == id), None)
    if not medico:
        raise HTTPException(status_code=404, detail="Médico não encontrado")

    redis_client.setex(cache_key, 60, json.dumps(medico.dict()))
    return medico


@app.post("/medicos")
def cadastrar_medico(medico: Medico):
    medicos.append(medico)

    redis_client.delete("medicos:listar")

    return medico

if __name__ == "__main__":
    port = int(os.getenv("PORT", 3001))
    uvicorn.run(app, host="0.0.0.0", port=port)
