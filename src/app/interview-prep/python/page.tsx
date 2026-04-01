"use client";
import { useState, useMemo } from "react";

const QUESTIONS = [
  {
    id: 1, cat: "core", label: "Core",
    title: "What are Python's mutable vs immutable types?",
    simple: "Think of immutable as a locked box — once you put something in, you can't change the contents, only replace the whole box. Mutable is an open box where you can freely add/remove items.",
    detail: `Immutable objects (int, str, tuple, frozenset, bytes) cannot be changed after creation — any "modification" creates a new object in memory. Mutable objects (list, dict, set) can be modified in-place, which means the same object at the same memory address gets updated.

This distinction matters in three real-world areas:
• Memory: immutable objects can be interned/cached (Python caches small ints -5 to 256)
• Function arguments: mutable defaults persist across calls (classic bug)
• Dict keys: must be hashable (immutable), so lists/dicts can't be keys`,
    code: `x = "hello"
print(id(x))        # memory address, e.g. 140234567
x += " world"
print(id(x))        # DIFFERENT — new object created

lst = [1, 2, 3]
print(id(lst))
lst.append(4)
print(id(lst))      # SAME — modified in-place

# ✗ Classic gotcha — mutable default argument
def add_item(item, lst=[]):
    lst.append(item)
    return lst

add_item(1)   # [1]
add_item(2)   # [1, 2]  ← same list! Bug!

# ✓ Correct pattern
def add_item(item, lst=None):
    if lst is None:
        lst = []
    lst.append(item)
    return lst`,
    tip: "Mutable objects as default args persist across calls. Always use None and create the object inside the function body."
  },
  {
    id: 2, cat: "core", label: "Core",
    title: "Explain Python's GIL (Global Interpreter Lock)",
    simple: "Imagine a single-lane bridge. Even if many cars (threads) want to cross, only one can at a time. The GIL is that bridge — only one thread runs Python bytecode at any moment.",
    detail: `The GIL is a mutex in CPython that allows only one thread to execute Python bytecode at a time, even on multi-core machines.

Why it exists: CPython's memory management uses reference counting, which isn't thread-safe. The GIL prevents race conditions on Python objects without needing fine-grained locking on every object.

Impact by task type:
• I/O-bound tasks (network, file reads): threads work great — GIL is released during I/O waits
• CPU-bound tasks (number crunching): threads give zero speedup — use multiprocessing

Important nuance: Libraries like NumPy, Pandas, and most C extensions release the GIL internally during heavy computation, which is why they perform well with threads despite CPython's limitation.`,
    code: `import threading, multiprocessing

# ✓ I/O-bound — threads work fine, GIL released during I/O
def download(url):
    import requests
    return requests.get(url).content   # GIL released here

threads = [threading.Thread(target=download, args=(u,)) for u in urls]
[t.start() for t in threads]; [t.join() for t in threads]

# ✗ CPU-bound — threads don't help, GIL blocks them
def count(n):
    while n > 0: n -= 1

# ✓ CPU-bound — use processes (each has its own GIL)
with multiprocessing.Pool(4) as pool:
    pool.map(count, [10**7, 10**7, 10**7, 10**7])`,
    tip: "NumPy releases the GIL internally — that's why vectorized operations are fast even with threads. For pure Python CPU work, always use multiprocessing."
  },
  {
    id: 3, cat: "adv", label: "Advanced",
    title: "What are decorators and how do they work internally?",
    simple: "A decorator is giftwrap — the gift (function) is the same inside, but the outside (behavior) changes. You add features without touching the original code.",
    detail: `Decorators are higher-order functions: they take a function, wrap it with extra behavior, and return the new function. The @syntax is pure syntactic sugar.

@my_decorator
def greet(): ...
↑ is exactly the same as: greet = my_decorator(greet)

Key concepts:
• Closures: the wrapper captures the original function in its scope
• *args/**kwargs: forward all arguments unchanged to the original
• @functools.wraps: preserves __name__, __doc__, __module__ of the original
• Stacking: @decorator_a @decorator_b func → a(b(func)) — innermost applied first`,
    code: `import functools, time

def timer(func):
    @functools.wraps(func)     # preserves metadata
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper

# Decorator with arguments (factory pattern)
def repeat(n):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(n):
                func(*args, **kwargs)
        return wrapper
    return decorator

@timer
@repeat(3)
def say_hi(name):
    print(f"Hi, {name}!")

say_hi("Alice")   # prints 3x, then shows total time`,
    tip: "Always use @functools.wraps inside your decorator — without it, the wrapped function loses __name__ and __doc__, which breaks debugging, Sphinx docs, and introspection tools."
  },
  {
    id: 4, cat: "adv", label: "Advanced",
    title: "Explain generators and the yield keyword",
    simple: "A generator is a lazy chef — instead of cooking the entire meal upfront, it prepares each dish only when you ask. Saves memory with huge datasets.",
    detail: `A generator function uses yield instead of return. When called, it returns a generator object (an iterator) that produces values on demand — it doesn't run until you call next() or iterate over it.

Execution model:
1. Call squares(5) → returns a generator object, NO code runs yet
2. Call next(gen) → runs until the first yield, returns that value, PAUSES
3. Call next(gen) again → resumes from the pause, runs to the next yield
4. StopIteration raised when the function exits

Memory advantage: a generator for 10 million items uses ~200 bytes vs ~400MB for a list comprehension.`,
    code: `def squares(n):
    for i in range(n):
        yield i * i    # pauses here each call

gen = squares(10_000_000)
print(next(gen))    # 0   — only one value computed
print(next(gen))    # 1

# Generator pipeline — entire chain is lazy
def read_lines(filepath):
    with open(filepath) as f:
        for line in f: yield line.strip()

def filter_errors(lines):
    return (l for l in lines if "ERROR" in l)

def parse(lines):
    for line in lines: yield line.split(" | ")

# Processes one line at a time — constant memory regardless of file size
pipeline = parse(filter_errors(read_lines("server.log")))
for record in pipeline:
    process(record)`,
    tip: "Use generators for large files, infinite sequences, and data pipelines. yield from delegates to another iterable — great for recursive generators."
  },
  {
    id: 5, cat: "perf", label: "Performance",
    title: "List comprehensions vs generator expressions — when to use which?",
    simple: "List comp prints all photos at once. Generator scrolls one at a time. Need all at once? List. Processing one at a time? Generator.",
    detail: `Both create iterables from existing sequences, but they differ fundamentally:

List comprehension []: evaluates eagerly — all values computed and stored in memory immediately.
Generator expression (): evaluates lazily — values computed one at a time, on demand.

Choose a list when you need: indexing (result[5]), len(), multiple iterations, or random access.
Choose a generator when you need: sum/any/all/max/min with a single pass, feeding into another iterator, or when the dataset might be huge.

Performance nuance: for small datasets (<1000 items), list comprehensions are often faster due to lower overhead per-item. Generators shine at scale.`,
    code: `data = range(10_000_000)

# List comprehension — builds ~400MB in RAM immediately
squares_list = [x*x for x in data]
print(squares_list[100])   # ✓ indexing works
print(len(squares_list))   # ✓ length works

# Generator expression — ~200 bytes regardless of size
squares_gen = (x*x for x in data)
# print(squares_gen[100])  # ✗ TypeError — no indexing

# When generator is always better:
total    = sum(x*x for x in data)
any_big  = any(x > 9_999_999 for x in data)  # short-circuits!
first    = next(x for x in data if x % 7 == 0 and x > 1000)

# Real-world: feeding into functions that take iterables
with open("huge.csv") as f:
    lines = (line.strip() for line in f)   # lazy read
    headers = next(lines)
    for row in lines: process(row)`,
    tip: "If you're wrapping it in sum(), any(), all(), max(), min(), or a for loop — always prefer a generator expression. The parentheses in sum(x*x for x in data) are the generator, not extra parens."
  },
  {
    id: 6, cat: "core", label: "Core",
    title: "How does Python manage memory? Reference counting and GC.",
    simple: "Python keeps a sticky note on every object counting how many people are using it. When the count hits zero, Python throws it away. For circular references a separate GC cycle handles cleanup.",
    detail: `Python uses two mechanisms working in tandem:

1. Reference counting (primary): every object stores a counter of how many references point to it. When the counter reaches zero, the object is immediately freed and its memory returned.

2. Cyclic garbage collector (secondary): reference counting fails for circular references (A → B → A). Neither object's count reaches zero even after del. The gc module periodically scans for unreachable cycles and frees them.

Three generations: young objects (gen 0) collected most often, old objects (gen 2) rarely. Based on the generational hypothesis: most objects die young.`,
    code: `import sys, gc

x = [1, 2, 3]
y = x
print(sys.getrefcount(x))   # 3 (x + y + getrefcount arg itself)

del y
print(sys.getrefcount(x))   # 2 (x + getrefcount arg)

del x                        # ref count → 0, freed immediately

# Cyclic reference — reference counting fails here
class Node: pass
a, b = Node(), Node()
a.ref = b     # a → b
b.ref = a     # b → a  (cycle)

del a, b      # ref counts → 1, not 0. Memory NOT freed yet!
gc.collect()  # explicit cycle collection → memory freed

# Disabling GC for performance (use carefully)
gc.disable()
# ...long-running tight loop...
gc.enable()
gc.collect()`,
    tip: "Use context managers (with) for files/connections — they release resources at __exit__ regardless of exceptions. Use del + gc.collect() for large temporary objects in memory-intensive code."
  },
  {
    id: 7, cat: "core", label: "Core",
    title: "Explain *args and **kwargs with real use cases",
    simple: "*args is an unlabeled bag for any number of items. **kwargs is a labeled bag — each item has a name. Together they let functions accept any arguments.",
    detail: `*args collects extra positional arguments into a tuple. **kwargs collects extra keyword arguments into a dict. The names args and kwargs are convention only.

Argument ordering rule (strict):
def f(required, /, positional, *args, keyword_only, **kwargs)

From left to right:
1. Positional-only (before /)
2. Normal positional-or-keyword
3. *args (variadic positional)
4. Keyword-only (after *args)
5. **kwargs (variadic keyword)`,
    code: `# Flexible API — accepts any extra fields
def create_user(name, email, **extras):
    return {"name": name, "email": email, **extras}

create_user("Alice", "a@x.com", role="admin", team="backend")

# Decorator forwarding — must capture and forward everything
def log(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print(f"→ {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

# Keyword-only enforcement
def connect(host, port, *, timeout=30, retries=3):
    pass

connect("localhost", 5432, timeout=10)  # ✓
connect("localhost", 5432, 10)          # ✗ TypeError

# Unpacking when calling
def add(a, b, c): return a + b + c
nums = [1, 2, 3]
opts = {"a": 1, "b": 2, "c": 3}
add(*nums)   # unpack list as positional
add(**opts)  # unpack dict as keyword`,
    tip: "The / and * in function signatures are Python 3.8+ features heavily used in stdlib. Understanding them helps when reading CPython source and writing robust public APIs."
  },
  {
    id: 8, cat: "adv", label: "Advanced",
    title: "What is a metaclass in Python?",
    simple: "If a class is a blueprint for objects, a metaclass is a blueprint for classes. It controls how classes are created, just like a class controls how instances are created.",
    detail: `Everything in Python is an object — including classes themselves. A metaclass is the class of a class. type is the default metaclass for all classes.

When Python executes class Foo: ..., it calls type(name, bases, namespace) to create the class object. You can override this by specifying metaclass=YourMeta.

When to use metaclasses (rare but powerful):
• Enforcing interfaces/APIs across all subclasses
• Auto-registering subclasses (plugin systems)
• Adding/modifying class attributes during definition
• ORM-style column descriptors (Django models work this way)

Modern alternatives: __init_subclass__, class decorators, and dataclasses solve 90% of metaclass use cases more simply.`,
    code: `# Auto-register all subclasses (plugin pattern)
class PluginMeta(type):
    registry = {}
    def __new__(mcs, name, bases, namespace):
        cls = super().__new__(mcs, name, bases, namespace)
        if bases:  # skip the base class itself
            mcs.registry[name] = cls
        return cls

class BasePlugin(metaclass=PluginMeta): pass
class PDFPlugin(BasePlugin): pass
class CSVPlugin(BasePlugin): pass

print(PluginMeta.registry)
# {'PDFPlugin': <class>, 'CSVPlugin': <class>}

# Modern alternative: __init_subclass__ (Python 3.6+)
class BasePlugin:
    _registry = {}
    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        BasePlugin._registry[cls.__name__] = cls

class JSONPlugin(BasePlugin): pass`,
    tip: "Before reaching for metaclasses, ask: can __init_subclass__ or a class decorator solve this? They almost always can, and they're far more readable."
  },
  {
    id: 9, cat: "async", label: "Async",
    title: "Explain async/await and the event loop",
    simple: "A single waiter instead of standing at one table takes an order, moves to the next table, and comes back when food is ready. That's async — one thread doing many things by never blocking.",
    detail: `asyncio provides cooperative concurrency — one thread, many tasks, no blocking. Instead of OS-level thread switching (preemptive), coroutines voluntarily yield control at await points.

Key components:
• Event loop: the scheduler — runs coroutines, handles I/O callbacks, manages timers
• Coroutine (async def): a function that can pause at await and resume later
• Task (asyncio.create_task): wraps a coroutine and schedules it on the loop
• asyncio.gather: runs multiple coroutines concurrently, waits for all`,
    code: `import asyncio, aiohttp

async def fetch(session, url):
    async with session.get(url) as r:
        return await r.json()

async def main():
    async with aiohttp.ClientSession() as session:
        # Fire all 3 requests simultaneously
        results = await asyncio.gather(
            fetch(session, "https://api.example.com/users"),
            fetch(session, "https://api.example.com/posts"),
            fetch(session, "https://api.example.com/tags"),
        )
    return results

asyncio.run(main())

# ✗ WRONG — blocks the entire event loop
async def bad():
    time.sleep(2)

# ✓ CORRECT — yields control to the loop
async def good():
    await asyncio.sleep(2)

# For unavoidable blocking calls
async def safe_blocking():
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, blocking_sync_function)`,
    tip: "Never call time.sleep() inside async code — it blocks the entire event loop. Use await asyncio.sleep(). For blocking DB drivers or CPU work, use run_in_executor() to offload to a thread/process pool."
  },
  {
    id: 10, cat: "core", label: "Core",
    title: "How do Python's dunder (magic) methods work?",
    simple: "Dunder methods let your class speak Python's built-in language. len(obj) secretly calls obj.__len__(). You're teaching your object to behave like a native Python type.",
    detail: `Python's data model is built on dunder methods. When you use an operator, call a built-in function, or use a protocol (iteration, context management), Python routes that operation through a specific dunder method.

Key categories:
• Object lifecycle: __new__, __init__, __del__
• Representation: __repr__, __str__, __format__
• Comparison: __eq__, __lt__, __hash__
• Arithmetic: __add__, __mul__, __sub__
• Container: __len__, __getitem__, __contains__, __iter__
• Context manager: __enter__, __exit__
• Callable: __call__`,
    code: `class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __mul__(self, scalar):
        return Vector(self.x * scalar, self.y * scalar)

    def __rmul__(self, scalar):   # 3 * v (reflected)
        return self.__mul__(scalar)

    def __len__(self):
        return 2

    def __iter__(self):
        yield self.x
        yield self.y

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

    def __hash__(self):
        return hash((self.x, self.y))

v1, v2 = Vector(1, 2), Vector(3, 4)
print(v1 + v2)    # Vector(4, 6)
print(3 * v1)     # Vector(3, 6)
print(list(v1))   # [1, 2]`,
    tip: "__repr__ is for developers (unambiguous), __str__ is for end users (readable). When only __repr__ is defined, print() falls back to it. Always implement __repr__ at minimum."
  },
  {
    id: 11, cat: "perf", label: "Performance",
    title: "What are Python's built-in profiling tools?",
    simple: "Profiling is finding which part of your code is slowest — like checking which leg of a road trip takes the most time. Python gives you built-in tools to measure exactly where time is spent.",
    detail: `Python ships with several profiling tools in the standard library:

cProfile (recommended): C-implemented profiler, low overhead. Measures: number of calls, total time, cumulative time per function. Best for finding bottlenecks at the function level.

timeit: benchmarks small code snippets. Runs the snippet many times and returns total time. Best for comparing micro-optimizations.

Third-party production tools: line_profiler (line-by-line timing), memory_profiler (RAM usage per line), py-spy (sampling profiler, zero overhead — attaches to live processes).`,
    code: `import cProfile, pstats, io

# Profile a function call
pr = cProfile.Profile()
pr.enable()
my_expensive_function()
pr.disable()

# Print top 10 by cumulative time
s = io.StringIO()
ps = pstats.Stats(pr, stream=s).sort_stats("cumulative")
ps.print_stats(10)
print(s.getvalue())

# Command-line profiling (no code changes)
# python -m cProfile -s cumulative my_script.py

# Benchmark small snippets
import timeit

t1 = timeit.timeit('[x*x for x in range(1000)]', number=10_000)
t2 = timeit.timeit('list(x*x for x in range(1000))', number=10_000)
print(f"List comp: {t1:.3f}s | Gen+list(): {t2:.3f}s")`,
    tip: "In production, use py-spy for sampling-based profiling with zero code changes. It attaches to a running PID: py-spy record -o profile.svg --pid 12345. This is safe for live traffic."
  },
  {
    id: 12, cat: "ds", label: "Data Structures",
    title: "Explain Python's dataclasses (@dataclass)",
    simple: "A dataclass is a shortcut to avoid writing repetitive __init__, __repr__, __eq__ boilerplate. Declare the fields, Python generates the methods.",
    detail: `Introduced in Python 3.7 (PEP 557), @dataclass inspects class-level annotations and auto-generates dunder methods.

Auto-generated by default: __init__, __repr__, __eq__
Optional: __hash__ (with frozen=True), ordering methods (with order=True), __post_init__ for custom initialization logic.

field() gives fine-grained control: default_factory for mutable defaults, init=False to exclude from __init__, repr=False to hide from repr, compare=False to exclude from __eq__.`,
    code: `from dataclasses import dataclass, field
from typing import List, Optional
import uuid

@dataclass
class User:
    name: str
    email: str
    age: int
    tags: List[str] = field(default_factory=list)
    id: str = field(default_factory=lambda: str(uuid.uuid4()), repr=False)

    def __post_init__(self):
        self.email = self.email.lower()
        if self.age < 0:
            raise ValueError("Age must be non-negative")

@dataclass(frozen=True, order=True)   # immutable + sortable
class Point:
    x: float
    y: float

u = User("Alice", "ALICE@X.COM", 30, ["admin"])
print(u)   # User(name='Alice', email='alice@x.com', age=30, tags=['admin'])

p1, p2 = Point(1.0, 2.0), Point(3.0, 4.0)
points = sorted([p2, p1])    # ✓ order=True enables comparison
d = {p1: "origin"}           # ✓ frozen=True enables __hash__`,
    tip: "frozen=True makes the dataclass immutable AND auto-generates __hash__ — use it when you need instances as dict keys or set members. Without frozen=True, __hash__ is set to None if you define __eq__."
  },
  {
    id: 13, cat: "adv", label: "Advanced",
    title: "What is the difference between __new__ and __init__?",
    simple: "__new__ creates the empty shell of an object. __init__ fills it with data. __new__ runs first, __init__ runs after.",
    detail: `The full object creation sequence when you call MyClass(args):
1. Python calls MyClass.__new__(MyClass, *args, **kwargs)
2. __new__ allocates memory and returns the new instance
3. If the returned object is an instance of MyClass, Python calls instance.__init__(*args)
4. __init__ initializes the instance's attributes

99% of Python code only needs __init__. You need __new__ when:
• Subclassing immutable types (int, str, tuple) — can't set their value in __init__
• Implementing the Singleton pattern
• Custom metaclass behavior`,
    code: `# Subclassing immutable type — MUST use __new__
class EvenInt(int):
    def __new__(cls, value):
        if value % 2 != 0:
            raise ValueError(f"{value} is not even")
        return super().__new__(cls, value)

x = EvenInt(4)    # ✓
y = EvenInt(3)    # ✗ ValueError

# Singleton via __new__
class Config:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized: return
        self.settings = {}
        self._initialized = True

a = Config()
b = Config()
print(a is b)    # True — same object always`,
    tip: "If __new__ returns an instance that is NOT an instance of the class, __init__ is NOT called. This subtle behavior matters when __new__ returns a cached/existing object."
  },
  {
    id: 14, cat: "perf", label: "Performance",
    title: "Explain shallow vs deep copy",
    simple: "Shallow copy photocopies a folder — the folder is new but documents inside still point to originals. Deep copy photocopies everything including every document inside.",
    detail: `Python has three levels of copying:

Assignment (=): not a copy at all. Both names point to the exact same object.

Shallow copy (copy.copy()): creates a new container object, but the elements inside still reference the same objects. For nested structures, mutations in nested objects affect both copies.

Deep copy (copy.deepcopy()): recursively copies the entire object graph — every nested object gets a new copy. Changes to the copy never affect the original.`,
    code: `import copy

original = {
    "name": "Alice",
    "scores": [90, 85, 92],
    "address": {"city": "NYC"}
}

alias   = original
shallow = copy.copy(original)
deep    = copy.deepcopy(original)

original["name"] = "Bob"
print(shallow["name"])   # "Alice" — top-level independent
print(alias["name"])     # "Bob"   — alias tracks everything

original["scores"].append(100)
original["address"]["city"] = "LA"

print(shallow["scores"])          # [90,85,92,100] — shared!
print(shallow["address"]["city"]) # "LA"           — shared!
print(deep["scores"])             # [90,85,92]     — safe
print(deep["address"]["city"])    # "NYC"          — safe

# Performance trick for JSON-serializable data
import json
fast_deep = json.loads(json.dumps(original))  # 3-5x faster than deepcopy`,
    tip: "For performance-critical code with JSON-serializable data, json.loads(json.dumps(obj)) is a fast deep copy alternative. For complex objects with custom types, stick to deepcopy."
  },
  {
    id: 15, cat: "core", label: "Core",
    title: "What are context managers and how do you create one?",
    simple: "A context manager is a responsible manager — sets things up before you start, cleans up after you're done, even if something goes wrong in between.",
    detail: `Context managers implement the context manager protocol: __enter__ and __exit__ dunder methods. The with statement calls __enter__ at the start and __exit__ at the end — even if an exception is raised.

__exit__ receives: exc_type, exc_val, exc_tb (all None if no exception occurred).
Return True from __exit__ to suppress the exception. Return False/None to propagate it.

Two ways to create:
1. Class-based: implement __enter__ and __exit__ directly
2. Generator-based with @contextmanager: cleaner for simple cases, uses try/finally`,
    code: `from contextlib import contextmanager
import time

@contextmanager
def timer(label=""):
    start = time.perf_counter()
    try:
        yield
    finally:
        elapsed = time.perf_counter() - start
        print(f"{label}: {elapsed:.4f}s")

@contextmanager
def transaction(conn):
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise

# Class-based — when you need more control
class TempEnv:
    def __init__(self, **env_vars):
        self.env_vars = env_vars
        self.original = {}

    def __enter__(self):
        import os
        for k, v in self.env_vars.items():
            self.original[k] = os.environ.get(k)
            os.environ[k] = v
        return self

    def __exit__(self, *_):
        import os
        for k, v in self.original.items():
            if v is None: del os.environ[k]
            else: os.environ[k] = v

with timer("query"):
    with transaction(db) as conn:
        conn.execute("INSERT INTO users VALUES (?)", ("Alice",))`,
    tip: "contextlib.suppress(ExceptionType) silently suppresses specific exceptions. contextlib.ExitStack lets you dynamically manage a variable number of context managers."
  },
  {
    id: 16, cat: "adv", label: "Advanced",
    title: "Explain Python's descriptor protocol",
    simple: "Descriptors let you control what happens when you get, set, or delete an attribute — like a bouncer for your class attributes that intercepts and validates every access.",
    detail: `A descriptor is any object that defines at least one of: __get__, __set__, __delete__, or __set_name__. When such an object is assigned as a CLASS attribute, Python routes attribute access through those methods.

Types:
• Data descriptor: defines __set__ or __delete__ (takes priority over instance __dict__)
• Non-data descriptor: only defines __get__ (instance __dict__ takes priority)

Python's built-in property, classmethod, staticmethod, and functions themselves are all descriptors. Django's ORM fields and SQLAlchemy's columns are descriptors.`,
    code: `class ValidatedField:
    def __set_name__(self, owner, name):
        self.public_name = name
        self.private_name = f"_{name}"

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return getattr(obj, self.private_name, None)

    def __set__(self, obj, value):
        self.validate(value)
        setattr(obj, self.private_name, value)

    def validate(self, value): pass

class PositiveInt(ValidatedField):
    def validate(self, value):
        if not isinstance(value, int) or value <= 0:
            raise ValueError(f"{self.public_name} must be a positive integer")

class NonEmptyStr(ValidatedField):
    def validate(self, value):
        if not isinstance(value, str) or not value.strip():
            raise ValueError(f"{self.public_name} must be a non-empty string")

class Product:
    name  = NonEmptyStr()
    price = PositiveInt()
    stock = PositiveInt()

p = Product()
p.name  = "Widget"   # ✓
p.price = 100        # ✓
p.stock = -5         # ✗ ValueError`,
    tip: "Django model fields (CharField, IntegerField) and SQLAlchemy Column() are implemented as descriptors. Understanding the protocol helps you debug framework behavior at the source level."
  },
  {
    id: 17, cat: "async", label: "Async",
    title: "Difference between threading, multiprocessing, and asyncio",
    simple: "Threading: workers sharing one office (GIL limits them). Multiprocessing: workers in separate offices (truly parallel). Asyncio: one very fast worker switching tasks cooperatively.",
    detail: `The right choice depends on your bottleneck:

threading: multiple OS threads sharing memory. GIL prevents true parallelism for CPU work, but I/O releases the GIL — effective for I/O-bound tasks.

multiprocessing: separate OS processes, each with its own Python interpreter and GIL. True CPU parallelism. Higher overhead. Best for CPU-heavy computation.

asyncio: single-threaded cooperative concurrency. Extremely low overhead per task. Best for massive I/O concurrency (thousands of simultaneous connections). Requires async-compatible libraries.`,
    code: `from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
import asyncio

# I/O bound with blocking library → ThreadPoolExecutor
def download(url):
    import requests
    return requests.get(url).content

with ThreadPoolExecutor(max_workers=20) as executor:
    results = list(executor.map(download, urls))

# CPU bound → ProcessPoolExecutor
def transform_image(path):
    from PIL import Image
    img = Image.open(path)
    return img.rotate(90).save(f"out_{path}")

with ProcessPoolExecutor(max_workers=8) as executor:
    executor.map(transform_image, image_paths)

# High-concurrency I/O → asyncio
async def fetch(session, url):
    async with session.get(url) as r:
        return await r.json()

async def main():
    async with aiohttp.ClientSession() as s:
        tasks = [fetch(s, url) for url in urls]
        return await asyncio.gather(*tasks)`,
    tip: "FastAPI is async. Django ORM is sync. Mixing them requires loop.run_in_executor() to avoid blocking the event loop."
  },
  {
    id: 18, cat: "ds", label: "Data Structures",
    title: "Explain Python's collections module — when to use what",
    simple: "The collections module is a toolbox of specialized containers. Use the right tool instead of hacking plain lists/dicts — each one solves a common pattern more efficiently.",
    detail: `Key containers:

defaultdict: eliminates KeyError for missing keys — auto-initializes with a factory. Use for grouping, counting, building adjacency lists.

Counter: optimized frequency counter with arithmetic, most_common(), and zero-return for missing keys.

deque: doubly-ended queue with O(1) append/pop from both ends. Use when list.pop(0) or list.insert(0, x) appears — those are O(n).

namedtuple: memory-efficient immutable record with named attribute access.

ChainMap: layered lookup — perfect for config systems (CLI args > env vars > defaults).`,
    code: `from collections import defaultdict, Counter, deque, namedtuple, ChainMap

# defaultdict — grouping pattern
groups = defaultdict(list)
for item in data:
    groups[item["category"]].append(item["name"])

# Counter — frequency + set operations
votes = Counter(["alice","bob","alice","charlie","alice"])
print(votes.most_common(2))  # [('alice',3),('bob',1)]

# deque — efficient queue/circular buffer
recent = deque(maxlen=5)       # auto-evicts oldest when full
recent.append("event1")
recent.appendleft("urgent")    # O(1) prepend
recent.popleft()               # O(1) vs list.pop(0) which is O(n)

# namedtuple — readable lightweight records
HTTPResponse = namedtuple("HTTPResponse", ["status", "headers", "body"])
r = HTTPResponse(200, {"Content-Type": "application/json"}, '{"ok":true}')
print(r.status)

# ChainMap — layered config
defaults = {"debug": False, "port": 8000}
env_vars = {"port": 9000}
config = ChainMap(env_vars, defaults)
print(config["port"])   # 9000  (env_vars wins)`,
    tip: "Counter is your go-to for any frequency/histogram problem. deque beats list for queue operations. ChainMap is perfect for layered config (CLI args > env vars > defaults)."
  },
  {
    id: 19, cat: "adv", label: "Advanced",
    title: "What are Python's __slots__?",
    simple: "By default each Python object carries a big __dict__ to store attributes. __slots__ replaces that bag with specific labeled pockets — less memory, faster access.",
    detail: `By default, every instance stores its attributes in __dict__ (a hash map), which has overhead per-instance. For a class with millions of instances, this accumulates.

__slots__ declares a fixed set of attributes at the class level. Python allocates a compact struct instead of a dict — saving 40-60% memory per instance.

Additional effects:
• Attribute access is slightly faster
• Cannot add arbitrary attributes (AttributeError on undeclared attrs)
• Instances don't have __dict__ or __weakref__ by default
• With inheritance: only declare NEW slots in each subclass`,
    code: `import sys

class Point:
    def __init__(self, x, y, z):
        self.x = x; self.y = y; self.z = z

class SlottedPoint:
    __slots__ = ("x", "y", "z")
    def __init__(self, x, y, z):
        self.x = x; self.y = y; self.z = z

p  = Point(1, 2, 3)
sp = SlottedPoint(1, 2, 3)

print(sys.getsizeof(p) + sys.getsizeof(p.__dict__))  # ~360 bytes
print(sys.getsizeof(sp))                              # ~72 bytes

# 1 million instances comparison
import tracemalloc
tracemalloc.start()
points = [Point(i, i, i) for i in range(1_000_000)]
print(tracemalloc.get_traced_memory()[1] // 1024**2, "MB")  # ~160MB

tracemalloc.clear_traces()
slotted = [SlottedPoint(i, i, i) for i in range(1_000_000)]
print(tracemalloc.get_traced_memory()[1] // 1024**2, "MB")  # ~56MB

sp.w = 4   # AttributeError: 'SlottedPoint' has no attribute 'w'

# Inheritance — only new slots in subclass
class Point3D(SlottedPoint):
    __slots__ = ("label",)`,
    tip: "Use __slots__ when you have classes with millions of instances. Avoid it for classes others will subclass freely, or when you need dynamic attributes, pickle, or copy support without extra work."
  },
  {
    id: 20, cat: "perf", label: "Performance",
    title: "Explain Python's functools module",
    simple: "functools is a toolkit for working with functions as objects. lru_cache memorizes expensive results. partial pre-fills arguments. reduce folds a list into one value.",
    detail: `Key utilities:

lru_cache / cache: memoization via Least Recently Used cache. Arguments must be hashable. Cache info accessible via .cache_info(). Python 3.9+ has @cache as unlimited-size shorthand.

partial: creates a new callable with some arguments pre-filled.

reduce: folds an iterable into a single value by applying a binary function cumulatively.

total_ordering: define __eq__ and one comparison (__lt__), get all six comparison methods generated for free.

wraps: copies __name__, __doc__, and other metadata from the wrapped function to the wrapper.`,
    code: `from functools import lru_cache, cache, partial, reduce, total_ordering

@lru_cache(maxsize=None)
def fibonacci(n: int) -> int:
    if n < 2: return n
    return fibonacci(n-1) + fibonacci(n-2)

fibonacci(50)
print(fibonacci.cache_info())   # hits=48, misses=51
fibonacci.cache_clear()

@cache  # Python 3.9+ shorthand
def factorial(n): return 1 if n == 0 else n * factorial(n-1)

# partial — specialize a generic function
import json
compact  = partial(json.dumps, separators=(",", ":"), sort_keys=True)
readable = partial(json.dumps, indent=2, sort_keys=True)

# total_ordering — define 2 methods, get all 6
@total_ordering
class Version:
    def __init__(self, major, minor): self.major, self.minor = major, minor
    def __eq__(self, o): return (self.major, self.minor) == (o.major, o.minor)
    def __lt__(self, o): return (self.major, self.minor) < (o.major, o.minor)

print(Version(2,0) > Version(1,9))   # True — __gt__ auto-generated`,
    tip: "lru_cache requires hashable arguments — it fails silently with unhashable types like lists or dicts. Serialize them to a string key or use a custom cache dict if needed."
  },
  {
    id: 21, cat: "practical", label: "Practical",
    title: "Implement a thread-safe singleton with double-checked locking",
    simple: "You need ONE database connection pool shared across your entire app — even when multiple threads try to create it simultaneously. How do you guarantee only one is ever created?",
    detail: `The problem: a naive singleton breaks under concurrency. Two threads both check if _instance is None simultaneously — both see None, both create an instance.

Double-checked locking pattern:
1. First check (no lock): fast path for the 99% case — no lock overhead
2. Acquire lock: only one thread can proceed
3. Second check (inside lock): another thread may have created the instance while we waited

The _initialized flag: Python still calls __init__ on every MyClass(...) call even if __new__ returns the same instance. Without this guard, you'd reset state on every access.`,
    code: `import threading

class ConnectionPool:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:     # second check inside lock
                    cls._instance = super().__new__(cls)
                    cls._instance._initialized = False
        return cls._instance

    def __init__(self, dsn=None):
        if self._initialized:
            return
        self.dsn = dsn
        self.connections = []
        self._initialized = True

# Simulate concurrent access
import concurrent.futures

def get_pool(dsn):
    return ConnectionPool(dsn)

with concurrent.futures.ThreadPoolExecutor(max_workers=10) as ex:
    pools = list(ex.map(get_pool, [f"dsn_{i}" for i in range(10)]))

print(all(p is pools[0] for p in pools))  # True — always same instance`,
    tip: "The outer check avoids lock acquisition overhead on every call (locks are expensive in tight loops). The inner check closes the race window between the outer check and lock acquisition."
  },
  {
    id: 22, cat: "practical", label: "Practical",
    title: "Build a rate limiter decorator using a sliding window",
    simple: "You have an API endpoint that costs money to hit. Allow only N calls per time window and block the rest with a meaningful error message.",
    detail: `Two approaches:

Fixed window: count calls within fixed buckets. Simple but has a burst vulnerability — calls at the edge of two windows can double your limit.

Sliding window (correct): count calls within the last N seconds from now. No burst problem. Implemented with a deque of timestamps — popleft() evicts expired timestamps in O(1).

Why deque over list: list.pop(0) is O(n). deque.popleft() is O(1).
Why time.monotonic(): never goes backward — immune to DST changes and NTP adjustments.`,
    code: `import time
from collections import deque
from functools import wraps

def rate_limit(max_calls: int, period: float):
    def decorator(func):
        call_times = deque()

        @wraps(func)
        def wrapper(*args, **kwargs):
            now = time.monotonic()

            while call_times and call_times[0] < now - period:
                call_times.popleft()

            if len(call_times) >= max_calls:
                oldest = call_times[0]
                retry_in = period - (now - oldest)
                raise Exception(
                    f"Rate limit: {max_calls} calls/{period}s exceeded. "
                    f"Retry in {retry_in:.2f}s"
                )

            call_times.append(now)
            return func(*args, **kwargs)
        return wrapper
    return decorator

@rate_limit(max_calls=3, period=5)
def call_api(endpoint):
    return f"Response from {endpoint}"`,
    tip: "In distributed systems, per-instance deques don't share state across servers. Use Redis with the sliding window log algorithm (ZADD + ZREMRANGEBYSCORE + ZCARD) for distributed rate limiting."
  },
  {
    id: 23, cat: "practical", label: "Practical",
    title: "Implement an LRU cache from scratch without functools",
    simple: "Build a cache storing the last N results. When full, evict the least recently used item. This is exactly what functools.lru_cache does internally.",
    detail: `The constraint: O(1) for both get() and put().

Optimal data structure: doubly linked list + hashmap
• Hash map: O(1) lookup by key
• Doubly linked list: O(1) insertion/deletion anywhere (no shifting)
• Most-recently-used at tail, least-recently-used at head

Python shortcut: OrderedDict already implements this internally. move_to_end() and popitem(last=False) are both O(1) operations.`,
    code: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)   # mark as most recently used
        return self.cache[key]

    def put(self, key, value) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)   # evict LRU (first item)

# Manual doubly linked list implementation (for interviews)
class Node:
    def __init__(self, key=0, val=0):
        self.key, self.val = key, val
        self.prev = self.next = None

class LRUCacheManual:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.map = {}
        self.head, self.tail = Node(), Node()   # sentinels
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev

    def _insert(self, node):   # insert at tail (most recent)
        self.tail.prev.next = node
        node.prev = self.tail.prev
        node.next = self.tail
        self.tail.prev = node`,
    tip: "This is a classic FAANG interview question. Know both the OrderedDict version (fast to write) and the manual doubly-linked-list version (shows you understand internals). Start with OrderedDict, offer to implement manually if asked."
  },
];

const CATS = [
  { key: "all",       label: "All" },
  { key: "core",      label: "Core" },
  { key: "adv",       label: "Advanced" },
  { key: "perf",      label: "Performance" },
  { key: "async",     label: "Async" },
  { key: "ds",        label: "Data Structures" },
  { key: "practical", label: "Practical" },
];

type Tab = "simple" | "detail" | "code" | "tip";

export default function PythonInterviewPage() {
  const [activeCat, setActiveCat]     = useState("all");
  const [search, setSearch]           = useState("");
  const [openId, setOpenId]           = useState<number | null>(null);
  const [activeTab, setActiveTab]     = useState<Tab>("simple");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return QUESTIONS.filter((item) => {
      const matchCat  = activeCat === "all" || item.cat === activeCat;
      const matchText = !q || item.title.toLowerCase().includes(q);
      return matchCat && matchText;
    });
  }, [activeCat, search]);

  function toggle(id: number) {
    if (openId === id) {
      setOpenId(null);
    } else {
      setOpenId(id);
      setActiveTab("simple");
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      {/* Header */}
      <div className="mb-10">
        <a
          href="/interview-prep"
          className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
        >
          ← Interview Prep
        </a>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
          Python Interview Questions
        </h1>
        <p className="mt-3 text-gray-500">
          {QUESTIONS.length} questions · Core · Advanced · Performance · Async ·
          Data Structures · Practical
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {CATS.map((c) => (
          <button
            key={c.key}
            onClick={() => setActiveCat(c.key)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              activeCat === c.key
                ? "bg-gray-900 text-white"
                : "border border-gray-200 text-gray-600 hover:border-gray-400"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search questions…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
        />
      </div>

      {/* Question list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-gray-400">
            No questions match your filter.
          </p>
        )}
        {filtered.map((q) => {
          const isOpen = openId === q.id;
          return (
            <div
              key={q.id}
              className="rounded-xl border border-gray-200 overflow-hidden"
            >
              {/* Question row */}
              <button
                onClick={() => toggle(q.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="shrink-0 rounded-full border border-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                    {q.label}
                  </span>
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {q.title}
                  </span>
                </div>
                <span className="shrink-0 text-gray-400 text-sm">
                  {isOpen ? "▲" : "▼"}
                </span>
              </button>

              {/* Expanded panel */}
              {isOpen && (
                <div className="border-t border-gray-100">
                  {/* Tab bar */}
                  <div className="flex border-b border-gray-100 bg-gray-50 px-5">
                    {(["simple", "detail", "code", "tip"] as Tab[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setActiveTab(t)}
                        className={`px-3 py-2.5 text-xs font-medium capitalize transition-colors border-b-2 -mb-px ${
                          activeTab === t
                            ? "border-gray-900 text-gray-900"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {t === "simple" ? "Simple" :
                         t === "detail" ? "Detail" :
                         t === "code"   ? "Code"   : "Tip"}
                      </button>
                    ))}
                  </div>

                  {/* Tab content */}
                  <div className="px-5 py-5">
                    {activeTab === "simple" && (
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {q.simple}
                      </p>
                    )}
                    {activeTab === "detail" && (
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-sans">
                        {q.detail}
                      </pre>
                    )}
                    {activeTab === "code" && (
                      <pre className="overflow-x-auto rounded-lg bg-gray-950 p-4 text-xs leading-relaxed text-gray-100">
                        <code>{q.code}</code>
                      </pre>
                    )}
                    {activeTab === "tip" && (
                      <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                        <span className="text-base">💡</span>
                        <p className="text-sm text-amber-900 leading-relaxed">
                          {q.tip}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
