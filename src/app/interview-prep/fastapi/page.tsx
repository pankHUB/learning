"use client";
import { useState } from "react";

const palette = [
  { color: "#60A5FA", bg: "rgba(96,165,250,0.06)",   border: "rgba(96,165,250,0.2)"   },
  { color: "#34D399", bg: "rgba(52,211,153,0.06)",   border: "rgba(52,211,153,0.2)"   },
  { color: "#F59E0B", bg: "rgba(245,158,11,0.06)",   border: "rgba(245,158,11,0.2)"   },
  { color: "#A78BFA", bg: "rgba(167,139,250,0.06)",  border: "rgba(167,139,250,0.2)"  },
  { color: "#F472B6", bg: "rgba(244,114,182,0.06)",  border: "rgba(244,114,182,0.2)"  },
  { color: "#38BDF8", bg: "rgba(56,189,248,0.06)",   border: "rgba(56,189,248,0.2)"   },
  { color: "#FB923C", bg: "rgba(251,146,60,0.06)",   border: "rgba(251,146,60,0.2)"   },
];
const p = (i: number) => palette[i % palette.length];

type Section = {
  label: string;
  content?: string;
  code?: string;
  tip?: string;
  warn?: string;
  compare?: { bad: { label: string; points: string[] }; good: { label: string; points: string[] } };
  bars?: { label: string; pct: number; color: string }[];
};

type Question = {
  id: string;
  cat: string;
  color: string;
  bg: string;
  border: string;
  title: string;
  subtitle: string;
  tags: string[];
  sections: Section[];
};

const coreQuestions: Question[] = [
  {
    id:"c1", cat:"Core", ...p(0),
    title:"What is FastAPI and how is it different from Flask or Django?",
    subtitle:"ASGI vs WSGI, auto-docs, type hints",
    tags:["Basics","ASGI","vs Flask"],
    sections:[
      { label:"What FastAPI is", content:`FastAPI is a modern Python web framework for building APIs. Built on Starlette (ASGI) and Pydantic, it offers native async support, automatic Swagger/ReDoc docs, and data validation via Python type hints — none of which Flask or Django provide out of the box.` },
      { label:"Key differences", compare:{
        bad:{ label:"Flask / Django", points:["WSGI — synchronous by default","No auto-generated API docs","Manual input validation","Multiple worker processes to scale"] },
        good:{ label:"FastAPI", points:["ASGI — async-first","Swagger UI at /docs, ReDoc at /redoc","Pydantic validates automatically","Single process handles concurrent requests"] },
      }},
      { label:"Interview tip", tip:`"FastAPI is ASGI-based (Starlette), Flask is WSGI-based — that fundamental difference is why FastAPI handles concurrent requests better without needing multiple workers."` },
    ],
  },
  {
    id:"c2", cat:"Core", ...p(1),
    title:"Explain how Pydantic models work and why they matter.",
    subtitle:"Your data contract — validation, coercion, docs",
    tags:["Pydantic","Validation","Core"],
    sections:[
      { label:"What Pydantic does", content:`Pydantic is a validation library FastAPI uses to define what request/response data must look like. Declare a class extending BaseModel, annotate fields with types, and FastAPI handles validation, coercion, and error responses automatically.` },
      { label:"Example", code:`from pydantic import BaseModel

class User(BaseModel):
    name: str
    age: int
    email: str

@app.post("/users")
def create_user(user: User):
    return user
# age="25" string → auto-converted to int
# Missing required field → 422 Unprocessable Entity` },
      { label:"Performance note", tip:`Pydantic V2 (used in modern FastAPI) rewrote its core in Rust — making it 5–50× faster than V1. You get runtime safety without writing a single line of validation code.` },
    ],
  },
  {
    id:"c3", cat:"Core", ...p(2),
    title:"What are path, query, and body parameters — how does FastAPI tell them apart?",
    subtitle:"Declaration position determines source",
    tags:["Core","Parameters","Routing"],
    sections:[
      { label:"The simple rule", content:`FastAPI figures out where data comes from based purely on how you declare it in the function signature. In curly braces in the path → path param. Simple type not in path → query param. Pydantic model → request body.` },
      { label:"Three patterns", code:`# Path param — part of the URL
@app.get("/users/{user_id}")
def get_user(user_id: int): ...

# Query param — comes after ? in the URL
@app.get("/users")
def list_users(skip: int = 0, limit: int = 10): ...

# Request body — Pydantic model → JSON
@app.post("/users")
def create_user(user: UserCreate): ...` },
    ],
  },
  {
    id:"c4", cat:"Core", ...p(3),
    title:"How does dependency injection work in FastAPI?",
    subtitle:"Depends() — reusable, testable, composable",
    tags:["Dependency Injection","Core","Testability"],
    sections:[
      { label:"The problem it solves", content:`Instead of manually creating shared resources (DB sessions, auth tokens, config) inside every route, you define them once and FastAPI injects them wherever needed. Think Spring's @Autowired or Angular's DI, but as a simple Python function.` },
      { label:"Pattern", code:`from fastapi import Depends

def get_db():
    db = SessionLocal()
    try:
        yield db       # Request uses this session
    finally:
        db.close()     # Returns connection to pool

@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()

# Dependencies can have their own dependencies (nested DI)
def get_current_user(db=Depends(get_db), token=Depends(oauth2)):
    ...` },
      { label:"Why it's powerful", tip:`Reusability — define once, use anywhere. Testability — swap real DB for a mock via app.dependency_overrides. FastAPI handles the lifecycle (open/close) automatically.` },
    ],
  },
  {
    id:"c5", cat:"Core", ...p(4),
    title:"What is the difference between async def and def in route handlers?",
    subtitle:"Event loop vs threadpool — knowing when to use each",
    tags:["Async","Core","Performance"],
    sections:[
      { label:"The rule", content:`async def is for non-blocking I/O operations (DB calls, HTTP requests, file I/O). def is for CPU-bound or blocking code. If you use def, FastAPI automatically runs it in a threadpool to avoid blocking the event loop.` },
      { label:"Code", code:`# Use async def for I/O-bound work
@app.get("/data")
async def fetch_data():
    result = await some_async_db_call()
    return result

# Use def for CPU-heavy tasks — FastAPI runs in threadpool
@app.get("/compute")
def heavy_computation():
    return run_expensive_calculation()` },
      { label:"Common mistake", warn:`Never use requests.get() inside async def — it blocks the event loop. Use httpx with await instead. Similarly, time.sleep() in async context blocks everything; use await asyncio.sleep() instead.` },
    ],
  },
  {
    id:"c6", cat:"Architecture", ...p(5),
    title:"How do you handle database connections in FastAPI? Explain connection pooling.",
    subtitle:"SQLAlchemy engine, pool_size, and the yield pattern",
    tags:["Database","Architecture","Pooling"],
    sections:[
      { label:"Why pooling matters", content:`Opening a new DB connection on every request is slow and expensive. Connection pooling keeps a set of open connections ready and reuses them. A pool of 10 connections can serve hundreds of requests per second without reconnecting each time.` },
      { label:"SQLAlchemy setup", code:`from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine(
    DATABASE_URL,
    pool_size=10,        # Keep 10 connections open
    max_overflow=20,     # Allow 20 extra under burst load
    pool_pre_ping=True   # Test connection health before use
)

SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db       # Lends a connection from the pool
    finally:
        db.close()     # Returns it to the pool (not actually closed)` },
    ],
  },
  {
    id:"c7", cat:"Architecture", ...p(6),
    title:"What are FastAPI routers and how do you structure a large application?",
    subtitle:"APIRouter, include_router, and clean folder structure",
    tags:["Architecture","Routers","Structure"],
    sections:[
      { label:"Why routers", content:`Putting all routes in main.py becomes unmanageable for large apps. APIRouter lets you define routes in separate modules and assemble them in main.py — same pattern as Express Router in Node.js.` },
      { label:"Pattern", code:`# routers/users.py
from fastapi import APIRouter
router = APIRouter(prefix="/users", tags=["users"])

@router.get("/")
def list_users(): ...

@router.post("/")
def create_user(): ...

# main.py
app.include_router(users.router)
app.include_router(products.router)` },
      { label:"Recommended folder layout", code:`app/
├── main.py
├── routers/
│   ├── users.py
│   └── products.py
├── models/        # DB ORM models
├── schemas/       # Pydantic schemas
├── services/      # Business logic
└── dependencies/  # Shared DI functions` },
    ],
  },
  {
    id:"c8", cat:"Core", ...p(0),
    title:"How does FastAPI handle request validation errors?",
    subtitle:"422 Unprocessable Entity and custom exception handlers",
    tags:["Validation","Error handling","Core"],
    sections:[
      { label:"Default behaviour", content:`When validation fails, FastAPI automatically returns a 422 Unprocessable Entity with a structured JSON body explaining exactly what was wrong and where. You write zero error-handling code for this.` },
      { label:"Auto error response shape", code:`// Auto-generated 422 response
{
  "detail": [
    {
      "loc": ["body", "age"],
      "msg": "value is not a valid integer",
      "type": "type_error.integer"
    }
  ]
}` },
      { label:"Customising the error", code:`from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

@app.exception_handler(RequestValidationError)
async def validation_handler(request, exc):
    return JSONResponse(
        status_code=400,
        content={"error": "Bad input", "details": str(exc)}
    )` },
    ],
  },
  {
    id:"c9", cat:"Security", ...p(1),
    title:"How do you implement JWT authentication in FastAPI?",
    subtitle:"OAuth2PasswordBearer + jose + Depends()",
    tags:["Security","JWT","Auth"],
    sections:[
      { label:"The flow", content:`User logs in → server returns a signed JWT token → client sends that token in the Authorization: Bearer header on every protected request → server verifies and extracts the user.` },
      { label:"Implementation", code:`from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("sub")
        return get_user(user_id)
    except JWTError:
        raise HTTPException(401, "Invalid token")

# Protected route — just add the dependency
@app.get("/profile")
def get_profile(user = Depends(get_current_user)):
    return user` },
      { label:"Bonus", tip:`OAuth2PasswordBearer auto-adds a login button in Swagger UI so you can test protected routes directly from /docs without a separate HTTP client.` },
    ],
  },
  {
    id:"c10", cat:"Performance", ...p(2),
    title:"What is middleware in FastAPI and when do you use it?",
    subtitle:"Runs on every request — CORS, logging, rate limiting",
    tags:["Middleware","Performance","CORS"],
    sections:[
      { label:"What middleware is", content:`Middleware is code that runs on every request before it hits your route, and on every response before it returns to the client. It's the right place for cross-cutting concerns: logging, CORS headers, request ID injection, timing.` },
      { label:"Built-in + custom middleware", code:`from fastapi.middleware.cors import CORSMiddleware
import time

# Built-in CORS middleware
app.add_middleware(CORSMiddleware, allow_origins=["*"])

# Custom timing middleware
@app.middleware("http")
async def add_timing(request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = time.time() - start
    response.headers["X-Process-Time"] = str(duration)
    return response` },
      { label:"Key distinction", tip:`Middleware runs for ALL routes automatically. Depends() is opt-in per-route. Use middleware for truly global concerns; use Depends() for per-route auth/logic.` },
    ],
  },
  {
    id:"c11", cat:"Performance", ...p(3),
    title:"How does FastAPI achieve high performance? What is ASGI?",
    subtitle:"Uvicorn + Starlette + Pydantic v2 (Rust core)",
    tags:["Performance","ASGI","Internals"],
    sections:[
      { label:"ASGI explained simply", content:`ASGI (Asynchronous Server Gateway Interface) is the async version of WSGI. Instead of one thread per request, a single event loop switches between thousands of concurrent connections, pausing wherever it's waiting for I/O. This is how Node.js scales — FastAPI brings the same model to Python.` },
      { label:"The performance stack", code:`# Layer 1: Uvicorn — ASGI server
#   Built on uvloop (C-based event loop, 2-4× faster than asyncio)
# Layer 2: Starlette — ASGI framework FastAPI sits on
# Layer 3: Pydantic v2 — validation core written in Rust

# Run in production:
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
#                                                  ^ one per CPU core` },
    ],
  },
  {
    id:"c12", cat:"Architecture", ...p(4),
    title:"What are background tasks, and when should you use Celery instead?",
    subtitle:"BackgroundTasks vs distributed task queue",
    tags:["Background tasks","Celery","Architecture"],
    sections:[
      { label:"Background tasks — built-in, lightweight", code:`from fastapi import BackgroundTasks

def send_welcome_email(email: str):
    send_email(email, "Welcome!")   # Runs after response is sent

@app.post("/register")
def register(user: UserCreate, bg: BackgroundTasks):
    create_user(user)
    bg.add_task(send_welcome_email, user.email)
    return {"msg": "Registered"}   # Client gets this immediately` },
      { label:"When to use each", compare:{
        bad:{ label:"BackgroundTasks — use for...", points:["Send one email post-signup","Log an analytics event","Update a counter","Small, fast, fire-and-forget"] },
        good:{ label:"Celery / ARQ — use for...", points:["Video encoding (minutes-long)","Bulk email campaigns","Tasks that need retries","Work that survives server restart"] },
      }},
    ],
  },
  {
    id:"c13", cat:"Core", ...p(5),
    title:"How do you handle file uploads in FastAPI?",
    subtitle:"UploadFile, File(), streaming large files",
    tags:["File upload","Core","Multipart"],
    sections:[
      { label:"Single and multiple file upload", code:`from fastapi import UploadFile, File

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()

    with open(f"uploads/{file.filename}", "wb") as f:
        f.write(contents)

    return {
        "filename": file.filename,
        "size": len(contents),
        "content_type": file.content_type
    }

# Multiple files
@app.post("/upload-many")
async def upload_many(files: list[UploadFile] = File(...)):
    return [f.filename for f in files]` },
      { label:"Best practices", tip:`For large files, stream instead of file.read() (which buffers everything in RAM). Always validate file.content_type before processing. Set a max file size limit via a dependency or middleware.` },
    ],
  },
  {
    id:"c14", cat:"Architecture", ...p(6),
    title:"Explain FastAPI's response_model and how it controls output.",
    subtitle:"Filter, validate, and document your API responses",
    tags:["response_model","Architecture","Security"],
    sections:[
      { label:"Why response_model matters", content:`Your DB model might have hashed_password, internal IDs, or audit fields. Without response_model, you might accidentally expose them. response_model acts as a whitelist — only the fields you declare get serialised into the response.` },
      { label:"Pattern", code:`class UserInDB(BaseModel):
    id: int
    email: str
    hashed_password: str   # Must NOT be exposed

class UserPublic(BaseModel):
    id: int
    email: str             # Only safe fields

@app.get("/users/{id}", response_model=UserPublic)
def get_user(id: int):
    return db.get(User, id)
    # FastAPI filters hashed_password out automatically

# Hide None fields from response
@app.get("/users/{id}", response_model=UserPublic,
         response_model_exclude_none=True)` },
    ],
  },
  {
    id:"c15", cat:"Security", ...p(0),
    title:"How do you implement rate limiting in FastAPI?",
    subtitle:"slowapi + Redis for distributed limits",
    tags:["Security","Rate limiting","Redis"],
    sections:[
      { label:"Using slowapi", code:`from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.get("/search")
@limiter.limit("10/minute")   # 10 requests per minute per IP
async def search(request: Request, q: str):
    return {"results": []}` },
      { label:"Production approach", content:`Store rate limit counters in Redis so limits are shared across multiple server instances. A counter stored in process memory only limits that one server — if you have 4 replicas, users get 4× the quota. Return 429 Too Many Requests with a Retry-After header so clients know when to back off.` },
    ],
  },
  {
    id:"c16", cat:"Performance", ...p(1),
    title:"How do you write tests for FastAPI applications?",
    subtitle:"TestClient, dependency_overrides, and isolation",
    tags:["Testing","Performance","TestClient"],
    sections:[
      { label:"TestClient — no running server needed", code:`from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_create_user():
    response = client.post("/users", json={
        "name": "Alice",
        "email": "alice@example.com"
    })
    assert response.status_code == 201
    assert response.json()["name"] == "Alice"` },
      { label:"Mocking dependencies", code:`def override_get_db():
    yield fake_test_db   # Use test DB, not real DB

app.dependency_overrides[get_db] = override_get_db

def teardown():
    app.dependency_overrides = {}`,
        tip:`app.dependency_overrides is one of FastAPI's most powerful testing features — swap real services (DB, email, auth) with mocks without changing any production code.` },
    ],
  },
  {
    id:"c17", cat:"Architecture", ...p(2),
    title:"What is the lifespan context manager and how does it replace on_event?",
    subtitle:"Startup + shutdown in one place",
    tags:["Lifespan","Architecture","Startup"],
    sections:[
      { label:"Old way vs new way", code:`# OLD (deprecated) — two separate decorators
@app.on_event("startup")
async def startup():
    await db.connect()

@app.on_event("shutdown")
async def shutdown():
    await db.disconnect()

# NEW — single lifespan function (FastAPI 0.93+)
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.connect()    # Startup
    yield                 # App runs here
    await db.disconnect() # Shutdown

app = FastAPI(lifespan=lifespan)` },
      { label:"Why lifespan is better", tip:`Single function instead of two handlers. Easier to test (run the async context manager directly). Resources created in startup are in scope during shutdown — no global variable workarounds.` },
    ],
  },
  {
    id:"c18", cat:"Security", ...p(3),
    title:"How do you handle CORS in FastAPI and why is it needed?",
    subtitle:"CORSMiddleware — allow_origins, credentials, methods",
    tags:["Security","CORS","Middleware"],
    sections:[
      { label:"What CORS is", content:`Browsers block JavaScript from calling an API on a different domain by default. CORS headers tell the browser the API permits cross-origin requests. Without it, your React frontend on localhost:3000 can't call your FastAPI backend on localhost:8000.` },
      { label:"Setup", code:`from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://myfrontend.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)`,
        warn:`Never combine allow_origins=["*"] with allow_credentials=True — this causes an error. If you need credentials (cookies, Authorization headers), specify exact origins.` },
    ],
  },
  {
    id:"c19", cat:"Performance", ...p(4),
    title:"How do you deploy FastAPI in production?",
    subtitle:"Gunicorn + Uvicorn workers + Nginx reverse proxy",
    tags:["Deployment","Performance","Production"],
    sections:[
      { label:"Never use --reload in production", content:`The --reload flag watches for file changes and restarts the server — significant overhead, development-only. In production, use Gunicorn as the process manager with Uvicorn workers.` },
      { label:"Production commands", code:`# Option 1 — Gunicorn + Uvicorn workers (bare metal / VM)
gunicorn main:app \\
  -w 4 \\                           # workers = (2 × CPU cores) + 1
  -k uvicorn.workers.UvicornWorker \\
  --bind 0.0.0.0:8000

# Option 2 — Docker / Kubernetes
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4

# Full production stack:
# Nginx → Gunicorn → Uvicorn workers → FastAPI` },
    ],
  },
  {
    id:"c20", cat:"Architecture", ...p(5),
    title:"How do you use WebSockets in FastAPI?",
    subtitle:"Real-time chat, notifications, live dashboards",
    tags:["WebSockets","Architecture","Real-time"],
    sections:[
      { label:"Basic WebSocket endpoint", code:`from fastapi import WebSocket, WebSocketDisconnect

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(ws: WebSocket, client_id: str):
    await ws.accept()
    try:
        while True:
            data = await ws.receive_text()
            await ws.send_text(f"Echo: {data}")
    except WebSocketDisconnect:
        print(f"Client {client_id} disconnected")` },
      { label:"Broadcasting to all clients", code:`class ConnectionManager:
    def __init__(self):
        self.active: list[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active.append(ws)

    async def broadcast(self, msg: str):
        for ws in self.active:
            await ws.send_text(msg)`,
        tip:`For production with multiple server instances, use Redis Pub/Sub so all instances can broadcast to all clients — in-process lists only reach connections on that one server.` },
    ],
  },
];

const aimlQuestions: Question[] = [
  {
    id:"m1", cat:"AI/ML", ...p(0),
    title:"Why is FastAPI preferred over Flask for serving ML models?",
    subtitle:"Async advantage in inference pipelines",
    tags:["Async I/O","Concurrency","vs Flask"],
    sections:[
      { label:"The core problem with Flask", content:`Flask is WSGI-based and synchronous — it handles one request at a time per thread. When you serve a heavy ML model (say, a large transformer), inference can take 200ms–2s. Every other request just waits. To scale Flask, you need many worker processes, each loading the model separately. A 7B parameter model in 4 workers = 4× the VRAM/RAM cost.

FastAPI is ASGI-based — the event loop can pause one request while waiting for I/O (GPU compute, external embedding API, DB lookup) and serve other requests in that gap. One process, one model in memory, many concurrent callers.`,
        compare:{
          bad:{ label:"Flask — 4 workers", points:["4 model copies in memory","4 × 2GB = 8GB RAM","Max 4 concurrent requests","Worker crash = lost capacity"] },
          good:{ label:"FastAPI — 1 worker", points:["1 model copy in memory","1 × 2GB = 2GB RAM","Hundreds of concurrent requests","Graceful degradation"] },
        },
      },
      { label:"Where async helps in ML", code:`@app.post("/predict")
async def predict(request: InferenceRequest):
    # Async: fetch feature data from DB
    features = await feature_store.get(request.user_id)

    # GPU inference in threadpool (non-blocking)
    prediction = await asyncio.get_event_loop().run_in_executor(
        None, model.predict, features
    )

    # Async: log result without blocking response
    background_tasks.add_task(log_prediction, request, prediction)
    return {"score": prediction}`,
        tip:`"Flask's threading model makes horizontal scaling expensive because each worker independently loads the model. FastAPI's async model lets you share one model instance across all concurrent requests — which matters enormously when model size is in GBs."` },
    ],
  },
  {
    id:"m2", cat:"AI/ML", ...p(1),
    title:"How do you build a streaming LLM response endpoint?",
    subtitle:"ChatGPT-style token-by-token output with SSE",
    tags:["Streaming","SSE","LLM serving","Generator"],
    sections:[
      { label:"Why streaming matters for LLMs", content:`An LLM generating a 500-token response at 30 tokens/second takes ~16 seconds. Without streaming, the user stares at a blank screen. With streaming, the first token appears in ~100ms and tokens arrive continuously. Same total latency — dramatically better perceived experience. This is why every LLM product (ChatGPT, Claude, Copilot) streams.` },
      { label:"StreamingResponse and SSE", code:`# Approach 1 — StreamingResponse
from fastapi.responses import StreamingResponse

def token_generator(prompt: str):
    for token in model.stream(prompt):
        yield token

@app.post("/generate")
def generate(req: PromptRequest):
    return StreamingResponse(token_generator(req.prompt), media_type="text/plain")

# Approach 2 — Server-Sent Events (SSE) — used by OpenAI's API
from sse_starlette.sse import EventSourceResponse

async def sse_generator(prompt: str, request: Request):
    async for token in model.astream(prompt):
        if await request.is_disconnected():
            break    # Stop wasting GPU if client disconnected
        yield {"data": token}
    yield {"data": "[DONE]"}

@app.post("/generate-sse")
async def generate_sse(req: PromptRequest, request: Request):
    return EventSourceResponse(sse_generator(req.prompt, request))`,
        warn:`Always check request.is_disconnected() in streaming routes. Inference is expensive — if the user closes the tab, stop generating immediately.` },
    ],
  },
  {
    id:"m3", cat:"AI/ML", ...p(2),
    title:"How do you handle model loading and prevent cold-start latency?",
    subtitle:"Lifespan + GPU kernel warm-up",
    tags:["Model lifecycle","Cold start","Production","GPU"],
    sections:[
      { label:"The cold-start problem", compare:{
        bad:{ label:"Wrong — load on first request", points:["model = None at module level","First caller waits 20–60 seconds","Race condition under parallel traffic","Every new container instance stalls"] },
        good:{ label:"Right — load at startup", points:["Model loaded before first request","CUDA kernels warmed on dummy input","All callers get stable low latency","Graceful cleanup on shutdown"] },
      }},
      { label:"Full production pattern", code:`from contextlib import asynccontextmanager
import torch

@asynccontextmanager
async def lifespan(app: FastAPI):
    # STARTUP
    app.state.model = torch.load("model.pt").eval()

    # Warm-up: compile CUDA kernels on dummy input
    dummy = torch.zeros(1, 768)
    with torch.no_grad():
        app.state.model(dummy)   # First run compiles kernels

    yield   # App serves requests

    # SHUTDOWN
    del app.state.model
    torch.cuda.empty_cache()

app = FastAPI(lifespan=lifespan)`,
        tip:`The warm-up run is critical. CUDA kernels are JIT-compiled on first use — without it, your first real request is 10–20× slower. After warm-up, p99 latency stabilises dramatically.` },
    ],
  },
  {
    id:"m4", cat:"AI/ML", ...p(3),
    title:"How do you implement dynamic batching for GPU efficiency?",
    subtitle:"asyncio.Queue + batch worker — the core pattern behind Triton",
    tags:["Batching","GPU efficiency","Throughput","asyncio"],
    sections:[
      { label:"Why per-request inference wastes GPU", content:`A GPU is a massively parallel processor — it processes a batch of 32 inputs almost as fast as 1 input. Naive per-request inference uses ~3–8% of GPU capacity even under high traffic. Dynamic batching collects requests arriving within a short time window, batches them together, runs one GPU pass, and returns results individually.`,
        bars:[
          { label:"Batch size 1",  pct:8,  color:"#EF4444" },
          { label:"Batch size 8",  pct:42, color:"#F59E0B" },
          { label:"Batch size 32", pct:85, color:"#34D399" },
        ],
      },
      { label:"asyncio.Queue batch worker pattern", code:`import asyncio

queue: asyncio.Queue = asyncio.Queue()

async def batch_worker():
    while True:
        batch, futures = [], []
        item, fut = await queue.get()          # Wait for first item
        batch.append(item); futures.append(fut)

        try:                                    # Collect up to 32 more
            while len(batch) < 32:
                item, fut = queue.get_nowait()
                batch.append(item); futures.append(fut)
        except asyncio.QueueEmpty:
            pass

        results = model.predict_batch(batch)    # One GPU pass

        for fut, result in zip(futures, results):
            fut.set_result(result)              # Resolve each caller

@app.post("/predict")
async def predict(data: InputData):
    future = asyncio.get_event_loop().create_future()
    await queue.put((data.features, future))
    return await future   # Suspends until batch worker resolves

@asynccontextmanager
async def lifespan(app: FastAPI):
    asyncio.create_task(batch_worker())
    yield`,
        tip:`This is the core pattern behind NVIDIA Triton and TorchServe. For multi-model pipelines, FastAPI works best as the API gateway — handling auth, validation, routing — and proxying to Triton/Ray Serve for inference.` },
    ],
  },
  {
    id:"m5", cat:"AI/ML", ...p(4),
    title:"How do you handle multimodal inputs and version the ML API?",
    subtitle:"Form + File uploads, schema evolution, v1/v2 routers",
    tags:["Multimodal","File uploads","API versioning","Pydantic"],
    sections:[
      { label:"Mixed content types — Form + File", content:`Multimodal models like CLIP or LLaVA take both image and text. You can't send JSON and file uploads in the same request body — they use different content types. Solution: use Form() for text and File() for images together in the same endpoint.`,
        code:`from fastapi import Form, File, UploadFile
import io
from PIL import Image

@app.post("/v1/analyze")
async def analyze(
    prompt: str = Form(...),
    image: UploadFile = File(...),
    temperature: float = Form(0.7),
):
    if image.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(400, "Unsupported image format")

    img_bytes = await image.read()
    pil_image = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    result = await run_in_executor(None, vision_model.infer, pil_image, prompt)
    return {"response": result}`,
      },
      { label:"API versioning + safe schema evolution", code:`router_v1 = APIRouter(prefix="/v1")
router_v2 = APIRouter(prefix="/v2")

@router_v1.post("/predict", response_model=PredictionV1)
async def predict_v1(data: InputV1):
    return legacy_model.predict(data)

@router_v2.post("/predict", response_model=PredictionV2)
async def predict_v2(data: InputV2):
    return new_model.predict_with_explanation(data)

# Safe evolution — only add optional fields, never remove
class PredictionV2(BaseModel):
    label: str                        # Existed in v1
    confidence: float                 # Existed in v1
    explanation: str | None = None    # New in v2.1, optional
    model_config = ConfigDict(extra="ignore")`,
        warn:`Never remove a field from a response model in a minor version bump. Only add optional fields in minor versions. Remove fields only in a major version (v2 → v3).` },
    ],
  },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const lines = code.split("\n").map((line, i) => {
    const c = line
      .replace(/(#[^\n]*)/g, '<span style="color:#475569;font-style:italic">$1</span>')
      .replace(/\b(async|await|def|return|from|import|with|if|while|try|except|pass|del|None|True|False|yield|for|in|break|class|raise)\b/g,
        '<span style="color:#93C5FD">$1</span>')
      .replace(/(@\w+)/g, '<span style="color:#F472B6">$1</span>')
      .replace(/("[^"]*"|'[^']*')/g, '<span style="color:#86EFAC">$1</span>');
    return <span key={i} dangerouslySetInnerHTML={{ __html: c + "\n" }} />;
  });
  return (
    <div style={{ position:"relative", marginTop:12 }}>
      <button onClick={copy} style={{
        position:"absolute", top:10, right:10, zIndex:1,
        background: copied ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.05)",
        border:`1px solid ${copied ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.08)"}`,
        color: copied ? "#34D399" : "#475569",
        padding:"3px 10px", borderRadius:6, fontSize:11,
        cursor:"pointer", fontFamily:"monospace", transition:"all 0.2s",
      }}>{copied ? "copied!" : "copy"}</button>
      <pre style={{
        background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.06)",
        borderRadius:10, padding:"14px 16px", paddingRight:64,
        fontSize:12, lineHeight:1.7, fontFamily:"'JetBrains Mono','Fira Code',monospace",
        color:"#CBD5E1", overflowX:"auto", margin:0, whiteSpace:"pre",
      }}>{lines}</pre>
    </div>
  );
}

function CompareBox({ compare }: { compare: { bad: { label: string; points: string[] }; good: { label: string; points: string[] } } }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:12 }}>
      {[
        { data:compare.bad,  color:"#EF4444", bg:"rgba(239,68,68,0.07)",  border:"rgba(239,68,68,0.2)",  icon:"✕" },
        { data:compare.good, color:"#34D399", bg:"rgba(52,211,153,0.07)", border:"rgba(52,211,153,0.2)", icon:"✓" },
      ].map(({ data, color, bg, border, icon }) => (
        <div key={data.label} style={{ background:bg, border:`1px solid ${border}`, borderRadius:10, padding:"12px 14px" }}>
          <div style={{ fontSize:11, fontWeight:600, color, marginBottom:8, display:"flex", gap:6, alignItems:"center" }}>
            <span style={{ width:15, height:15, borderRadius:"50%", background:color, color:"#0F172A", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, flexShrink:0 }}>{icon}</span>
            {data.label}
          </div>
          {data.points.map((pt, i) => <div key={i} style={{ fontSize:12, color:"#94A3B8", lineHeight:1.6, paddingLeft:4 }}>— {pt}</div>)}
        </div>
      ))}
    </div>
  );
}

function BarChart({ bars }: { bars: { label: string; pct: number; color: string }[] }) {
  return (
    <div style={{ marginTop:12, display:"flex", flexDirection:"column", gap:8 }}>
      {bars.map(bar => (
        <div key={bar.label} style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:90, fontSize:12, color:"#64748B", fontFamily:"monospace", flexShrink:0 }}>{bar.label}</div>
          <div style={{ flex:1, height:7, background:"rgba(255,255,255,0.05)", borderRadius:4, overflow:"hidden" }}>
            <div style={{ width:`${bar.pct}%`, height:"100%", background:bar.color, borderRadius:4 }} />
          </div>
          <div style={{ fontSize:11, color:bar.color, fontFamily:"monospace", width:36, textAlign:"right" }}>{bar.pct}%</div>
        </div>
      ))}
      <div style={{ fontSize:11, color:"#334155", marginTop:2 }}>approximate GPU utilisation by batch size</div>
    </div>
  );
}

const catMeta: Record<string, { color: string; bg: string }> = {
  "Core":         { color:"#60A5FA", bg:"rgba(96,165,250,0.12)"  },
  "Architecture": { color:"#34D399", bg:"rgba(52,211,153,0.12)"  },
  "Performance":  { color:"#F59E0B", bg:"rgba(245,158,11,0.12)"  },
  "Security":     { color:"#F472B6", bg:"rgba(244,114,182,0.12)" },
  "AI/ML":        { color:"#A78BFA", bg:"rgba(167,139,250,0.12)" },
};

function CatBadge({ cat }: { cat: string }) {
  const c = catMeta[cat] || { color:"#94A3B8", bg:"rgba(148,163,184,0.1)" };
  return <span style={{ fontSize:10, padding:"2px 8px", borderRadius:20, background:c.bg, color:c.color, fontFamily:"monospace", fontWeight:600 }}>{cat}</span>;
}

function QuestionCard({ q, num }: { q: Question; num: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      border:`1px solid ${open ? q.border : "rgba(255,255,255,0.05)"}`,
      borderRadius:14, overflow:"hidden", transition:"border-color 0.2s",
      background: open ? q.bg : "rgba(255,255,255,0.015)",
    }}>
      <div onClick={() => setOpen(!open)} style={{ display:"flex", alignItems:"flex-start", gap:14, padding:"16px 18px", cursor:"pointer" }}>
        <div style={{
          width:34, height:34, borderRadius:9,
          background: open ? `${q.color}1a` : "rgba(255,255,255,0.04)",
          border:`1px solid ${open ? q.color+"44" : "rgba(255,255,255,0.07)"}`,
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.2s",
        }}>
          <span style={{ fontFamily:"monospace", fontSize:11, color: open ? q.color : "#334155", fontWeight:700 }}>
            {String(num).padStart(2,"0")}
          </span>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:14, fontWeight:600, color:"#E2E8F0", lineHeight:1.35, letterSpacing:"-0.01em", marginBottom:5 }}>{q.title}</div>
          <div style={{ fontSize:12, color:"#475569", marginBottom:7 }}>{q.subtitle}</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:5, alignItems:"center" }}>
            <CatBadge cat={q.cat} />
            {q.tags.map(t => (
              <span key={t} style={{ fontSize:10, padding:"2px 7px", borderRadius:20, background:"rgba(255,255,255,0.04)", color:"#334155", border:"1px solid rgba(255,255,255,0.06)", fontFamily:"monospace" }}>{t}</span>
            ))}
          </div>
        </div>
        <div style={{ color: open ? q.color : "#1E293B", fontSize:11, transition:"transform 0.25s, color 0.25s", transform: open ? "rotate(180deg)" : "none", marginTop:6, flexShrink:0 }}>▼</div>
      </div>

      {open && (
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.04)" }}>
          {q.sections.map((sec, si) => (
            <div key={si} style={{ padding:"16px 18px", borderBottom: si < q.sections.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:q.color, opacity:0.7, marginBottom:10, fontFamily:"monospace" }}>{sec.label}</div>
              {sec.content && <p style={{ fontSize:13, color:"#94A3B8", lineHeight:1.75, margin:0, whiteSpace:"pre-line" }}>{sec.content}</p>}
              {sec.bars && <BarChart bars={sec.bars} />}
              {sec.compare && <CompareBox compare={sec.compare} />}
              {sec.code && <CodeBlock code={sec.code} />}
              {sec.tip && <div style={{ marginTop:10, padding:"10px 13px", background:"rgba(96,165,250,0.07)", borderLeft:"3px solid rgba(96,165,250,0.5)", borderRadius:"0 8px 8px 0", fontSize:12, color:"#93C5FD", lineHeight:1.65 }}>💡 {sec.tip}</div>}
              {sec.warn && <div style={{ marginTop:10, padding:"10px 13px", background:"rgba(245,158,11,0.07)", borderLeft:"3px solid rgba(245,158,11,0.5)", borderRadius:"0 8px 8px 0", fontSize:12, color:"#FCD34D", lineHeight:1.65 }}>⚠️ {sec.warn}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

const TABS = [
  { id:"all",  label:"All 25",        count:25 },
  { id:"core", label:"Core FastAPI",  count:20 },
  { id:"aiml", label:"AI/ML Systems", count:5  },
];

export default function FastAPIInterviewPage() {
  const [tab, setTab]           = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [search, setSearch]     = useState("");

  const baseList  = tab === "core" ? coreQuestions : tab === "aiml" ? aimlQuestions : [...coreQuestions, ...aimlQuestions];
  const allCats   = tab === "core" ? ["Core","Architecture","Performance","Security"] : tab === "aiml" ? ["AI/ML"] : ["Core","Architecture","Performance","Security","AI/ML"];
  const globalAll = [...coreQuestions, ...aimlQuestions];

  const filtered = baseList.filter(q => {
    const matchCat    = catFilter === "all" || q.cat === catFilter;
    const matchSearch = !search || q.title.toLowerCase().includes(search.toLowerCase()) || q.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div style={{ minHeight:"100vh", background:"#080C14", fontFamily:"'Sora','DM Sans',sans-serif", padding:"0 0 80px" }}>
      {/* Grid bg */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0,
        backgroundImage:`linear-gradient(rgba(96,165,250,0.025) 1px, transparent 1px),linear-gradient(90deg, rgba(96,165,250,0.025) 1px, transparent 1px)`,
        backgroundSize:"48px 48px" }} />
      <div style={{ position:"fixed", top:-180, left:"50%", transform:"translateX(-50%)",
        width:700, height:380, borderRadius:"50%",
        background:"radial-gradient(ellipse, rgba(96,165,250,0.06) 0%, transparent 70%)",
        pointerEvents:"none", zIndex:0 }} />

      <div style={{ position:"relative", zIndex:1, maxWidth:840, margin:"0 auto", padding:"0 20px" }}>
        {/* Back */}
        <div style={{ paddingTop:36 }}>
          <a href="/interview-prep" style={{ fontSize:12, color:"#334155", textDecoration:"none", fontFamily:"monospace" }}>← interview prep</a>
        </div>

        {/* Header */}
        <div style={{ paddingTop:28, paddingBottom:32 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(96,165,250,0.08)", border:"1px solid rgba(96,165,250,0.2)", borderRadius:20, padding:"5px 14px", marginBottom:20 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#60A5FA", boxShadow:"0 0 8px #60A5FA" }} />
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:"#60A5FA", textTransform:"uppercase", fontFamily:"monospace" }}>FastAPI Interview Prep — 3yr Experience</span>
          </div>

          <h1 style={{ fontSize:"clamp(24px,4vw,36px)", fontWeight:700, color:"#F1F5F9", letterSpacing:"-0.03em", lineHeight:1.15, margin:"0 0 12px" }}>
            25 Interview Questions<br />
            <span style={{ background:"linear-gradient(135deg, #60A5FA, #A78BFA)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              Core FastAPI + AI/ML Systems
            </span>
          </h1>

          <p style={{ fontSize:14, color:"#475569", lineHeight:1.7, maxWidth:560, margin:"0 0 28px" }}>
            20 core FastAPI questions every developer should know — plus 5 deep-dive questions on why FastAPI is the go-to framework for production ML services.
          </p>

          <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
            {[{ n:"25", l:"Total questions" },{ n:"20", l:"Core FastAPI" },{ n:"5", l:"AI/ML deep dives" },{ n:"3yr", l:"Exp. level" }].map(({ n, l }) => (
              <div key={l} style={{ padding:"8px 16px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10 }}>
                <div style={{ fontSize:17, fontWeight:700, color:"#E2E8F0", fontFamily:"monospace" }}>{n}</div>
                <div style={{ fontSize:11, color:"#475569" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:4, marginBottom:16, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:4, width:"fit-content" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setCatFilter("all"); setSearch(""); }} style={{
              padding:"7px 16px", borderRadius:9, fontSize:13, cursor:"pointer",
              border:"none", fontFamily:"sans-serif",
              background: tab === t.id ? "rgba(96,165,250,0.15)" : "transparent",
              color: tab === t.id ? "#60A5FA" : "#475569",
              fontWeight: tab === t.id ? 600 : 400, transition:"all 0.2s",
            }}>
              {t.label}
              <span style={{ marginLeft:6, fontSize:11, fontFamily:"monospace", color: tab === t.id ? "#60A5FA" : "#334155" }}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* Search + category filters */}
        <div style={{ display:"flex", gap:10, marginBottom:12, alignItems:"center", flexWrap:"wrap" }}>
          <input
            placeholder="Search questions or tags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding:"7px 14px", borderRadius:10, fontSize:13, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"#E2E8F0", fontFamily:"sans-serif", outline:"none", width:230 }}
          />
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            <button onClick={() => setCatFilter("all")} style={{ padding:"5px 12px", borderRadius:20, fontSize:11, cursor:"pointer", border:`1px solid ${catFilter === "all" ? "rgba(96,165,250,0.5)" : "rgba(255,255,255,0.07)"}`, background: catFilter === "all" ? "rgba(96,165,250,0.1)" : "rgba(255,255,255,0.02)", color: catFilter === "all" ? "#60A5FA" : "#475569", fontFamily:"monospace" }}>all</button>
            {allCats.map(c => {
              const cc = catMeta[c];
              const active = catFilter === c;
              return (
                <button key={c} onClick={() => setCatFilter(active ? "all" : c)} style={{ padding:"5px 12px", borderRadius:20, fontSize:11, cursor:"pointer", border:`1px solid ${active ? cc.color+"80" : "rgba(255,255,255,0.07)"}`, background: active ? cc.bg : "rgba(255,255,255,0.02)", color: active ? cc.color : "#475569", fontFamily:"monospace", transition:"all 0.2s" }}>{c}</button>
              );
            })}
          </div>
        </div>

        <div style={{ fontSize:11, color:"#1E293B", marginBottom:12, fontFamily:"monospace" }}>
          showing {filtered.length} of {baseList.length} questions
        </div>

        {/* Question list */}
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {filtered.map(q => <QuestionCard key={q.id} q={q} num={globalAll.indexOf(q) + 1} />)}
          {filtered.length === 0 && (
            <div style={{ textAlign:"center", padding:"48px 0", color:"#334155", fontSize:13, fontFamily:"monospace" }}>
              no questions match &quot;{search}&quot;
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ marginTop:52, paddingTop:20, borderTop:"1px solid rgba(255,255,255,0.04)", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <span style={{ fontSize:11, color:"#1E293B", fontFamily:"monospace" }}>fastapi interview prep — 25 questions</span>
          <div style={{ display:"flex", gap:14 }}>
            {["async","pydantic","starlette","uvicorn","ml-serving"].map(tag => (
              <span key={tag} style={{ fontSize:10, color:"#1E293B", fontFamily:"monospace" }}>#{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
