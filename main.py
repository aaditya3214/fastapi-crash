from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from auth_logic import check_user_credentials 

app = FastAPI()

# --- TEA MODELS & DATA (Purana logic) ---
class Tea(BaseModel):
    id: int 
    name: str
    origin: str

teas: List[Tea] = []

# --- AUTH MODEL (Naya frame) ---
class LoginRequest(BaseModel):
    username: str
    password: str

# --- TEA ROUTES (CRUD) ---
@app.get("/")
def read_root():
    return {"message": "Welcome to chai code"}

@app.get("/teas")
def get_teas():
    return teas

@app.post("/teas")
def add_tea(tea: Tea):
    teas.append(tea)
    return tea

@app.put("/teas/{tea_id}")
def update_tea(tea_id: int, updated_tea: Tea):
    for index, tea in enumerate(teas):
        if tea.id == tea_id:
            teas[index] = updated_tea
            return updated_tea
    return {"error": "Tea not found"}

@app.delete("/teas/{tea_id}")
def delete_tea(tea_id: int):
    for index, tea in enumerate(teas):
        if tea.id == tea_id:
            deleted = teas.pop(index)
            return deleted
    return {"error":"Tea not found"}

# --- AUTH ROUTES (Login with JSON Body) ---
@app.post("/login")
def login(request: LoginRequest): # Ab ye JSON body accept karega
    if check_user_credentials(request.username, request.password):
        return {"message": "Login successful"}
    return {"error": "Invalid login"}

@app.post("/logout")
def logout():
    return {"message": "Logged out successfully"}

@app.get("/profile")
def get_profile():
    return {"username": "admin", "bio": "BCA Student & Developer"}