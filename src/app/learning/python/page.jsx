"use client";
import { useState } from "react";

const C = {
  bg: "#0a0a0f",
  surface: "#111118",
  surfaceHigh: "#1a1a24",
  border: "#1e1e2e",
  borderHigh: "#2a2a3a",
  yellow: "#fbbf24",
  blue: "#60a5fa",
  purple: "#a78bfa",
  green: "#4ade80",
  red: "#f87171",
  cyan: "#22d3ee",
  orange: "#fb923c",
  text: "#e2e8f0",
  muted: "#8888aa",
  dim: "#555570",
};

const Code = ({ code, color }) => (
  <pre style={{
    background: "#080810", border: `1px solid ${C.border}`, borderRadius: 8,
    padding: "14px 16px", overflowX: "auto", fontSize: 12, lineHeight: 1.75,
    color: color || C.blue, fontFamily: "'JetBrains Mono','Fira Code',monospace",
    margin: "10px 0",
  }}>
    <code>{code.trim()}</code>
  </pre>
);

const Tag = ({ label, color }) => (
  <span style={{
    fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
    padding: "2px 7px", borderRadius: 3,
    background: `${color}20`, color, border: `1px solid ${color}40`,
  }}>{label}</span>
);

const Table = ({ headers, rows }) => (
  <div style={{ overflowX: "auto", margin: "12px 0" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
      <thead>
        <tr>
          {headers.map(h => (
            <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: C.dim, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", borderBottom: `1px solid ${C.border}` }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j} style={{ padding: "8px 12px", borderBottom: `1px solid ${C.surfaceHigh}`, color: j === 0 ? C.yellow : C.muted, lineHeight: 1.5 }}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Section = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 10, overflow: "hidden" }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", textAlign: "left", background: C.surfaceHigh, border: "none",
        padding: "12px 16px", cursor: "pointer", display: "flex", alignItems: "center",
        justifyContent: "space-between", fontFamily: "inherit",
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{title}</span>
        <span style={{ fontSize: 11, color: C.dim }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && <div style={{ padding: "16px", background: C.surface }}>{children}</div>}
    </div>
  );
};

const Callout = ({ children, color }) => (
  <div style={{
    borderLeft: `3px solid ${color || C.yellow}`, background: `${color || C.yellow}10`,
    padding: "10px 14px", borderRadius: "0 6px 6px 0", fontSize: 12,
    color: C.muted, lineHeight: 1.7, margin: "10px 0",
  }}>{children}</div>
);

const P = ({ children }) => (
  <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.75, margin: "8px 0" }}>{children}</p>
);

const H = ({ children, color }) => (
  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: color || C.yellow, margin: "16px 0 8px" }}>
    {children}
  </div>
);

// ─── Topic Data ────────────────────────────────────────────────────────────────

const TOPICS = [
  { id: "meta", label: "Metaprogramming", tag: "Advanced", tagColor: C.purple },
  { id: "decorators", label: "Decorators", tag: "Core", tagColor: C.yellow },
  { id: "introspection", label: "Introspection", tag: "Core", tagColor: C.blue },
  { id: "iterators", label: "Iterators", tag: "Core", tagColor: C.cyan },
  { id: "generators", label: "Generators", tag: "Core", tagColor: C.green },
  { id: "context", label: "Context Managers", tag: "Core", tagColor: C.orange },
  { id: "magic", label: "Magic Methods", tag: "Core", tagColor: C.red },
  { id: "args", label: "*args & **kwargs", tag: "Basics", tagColor: C.blue },
  { id: "async", label: "Async & Concurrency", tag: "Advanced", tagColor: C.cyan },
  { id: "interview", label: "Interview Q&A", tag: "Interview", tagColor: C.green },
  { id: "slots", label: "__slots__", tag: "Optimization", tagColor: C.orange },
  { id: "oop", label: "OOP & Access Modifiers", tag: "OOP", tagColor: C.green },
  { id: "pillars", label: "OOP Four Pillars", tag: "OOP", tagColor: C.cyan },
  { id: "fastapi", label: "FastAPI", tag: "Framework", tagColor: C.blue },
  { id: "db-interview", label: "DB Interview Q&A", tag: "Interview", tagColor: C.green },
];

// ─── Content Components ────────────────────────────────────────────────────────

function MetaContent() {
  return (
    <div>
      <P>Metaprogramming is the technique of writing code that manipulates other code — modifying classes, functions, or behavior at runtime.</P>
      <Callout color={C.purple}>The 3 Pillars: Decorators · Metaclasses · Introspection</Callout>

      <H>Class-Creation Lifecycle</H>
      <P><code style={{color:C.yellow}}>__prepare__</code> → body executes → <code style={{color:C.yellow}}>__new__</code> → <code style={{color:C.yellow}}>__init__</code></P>

      <Section title="Metaclass — Basic Structure" defaultOpen>
        <P>A metaclass is a class whose instances are classes. Subclass <code style={{color:C.yellow}}>type</code> to create one.</P>
        <Code code={`class M(type):
    def __new__(mcls, name, bases, namespace, **kwargs):
        namespace.setdefault("__doc__", f"Auto doc for {name}")
        cls = super().__new__(mcls, name, bases, namespace)
        return cls

    def __init__(cls, name, bases, namespace, **kwargs):
        super().__init__(name, bases, namespace)

class MyClass(metaclass=M):
    pass`} color={C.purple} />
      </Section>

      <Section title="__call__ — Singleton Pattern">
        <Code code={`class SingletonMeta(type):
    _instances = {}
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

class A(metaclass=SingletonMeta):
    pass

a1, a2 = A(), A()
assert a1 is a2  # True`} color={C.purple} />
      </Section>

      <Section title="Mini ORM with Metaclass">
        <Code code={`class Field:
    def __init__(self, type_, primary=False):
        self.type_ = type_
        self.primary = primary

    def __set_name__(self, owner, name):
        self.name = name

class ModelMeta(type):
    def __new__(mcls, name, bases, ns):
        fields = {k: v for k, v in ns.items() if isinstance(v, Field)}
        for b in bases:
            if hasattr(b, "_fields"):
                fields = {**b._fields, **fields}
        ns["_fields"] = fields
        cls = super().__new__(mcls, name, bases, ns)
        cls._table_name = name.lower()
        return cls

class Model(metaclass=ModelMeta):
    def to_dict(self):
        return {name: getattr(self, name, None) for name in self._fields}

class User(Model):
    id = Field(int, primary=True)
    name = Field(str)

u = User()
u.name = "Alice"
print(u.to_dict())  # {'id': None, 'name': 'Alice'}`} color={C.purple} />
      </Section>
    </div>
  );
}

function DecoratorsContent() {
  return (
    <div>
      <P>Decorators are functions that modify other functions or classes without changing their actual code. Applied using <code style={{color:C.yellow}}>@syntax</code>.</P>
      <Callout color={C.yellow}>Closest decorator to the function runs first at definition time. Always use <code>functools.wraps</code>.</Callout>

      <H color={C.yellow}>Decorator Rules</H>
      <Table
        headers={["Rule", "Explanation", "Example"]}
        rows={[
          ["Rule 1", "Closest to function → modify logic", "@wraps, @retry, @logger"],
          ["Rule 2", "Outer decorators → broad / metadata", "@classmethod, @staticmethod, @property"],
          ["Rule 3", "Never put @staticmethod/@property at top", "They should wrap custom decorators"],
          ["Rule 4", "Always use functools.wraps", "Preserves __name__, __doc__, annotations"],
        ]}
      />

      <Section title="Memoize (Caching with Closures)" defaultOpen>
        <Code code={`import functools

def memoize(func):
    cache = {}
    @functools.wraps(func)
    def wrapper(*args):
        if args in cache:
            return cache[args]
        res = func(*args)
        cache[args] = res
        return res
    return wrapper

@memoize
def fib(n):
    if n < 2: return n
    return fib(n-1) + fib(n-2)

print(fib(6))  # 8`} />
      </Section>

      <Section title="Decorator with Arguments">
        <Code code={`import functools

def repeat(n):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(n):
                func(*args, **kwargs)
        return wrapper
    return decorator

@repeat(3)
def greet():
    print("Hello!")

greet()  # Hello! x3`} />
      </Section>

      <Section title="Role-Based Authorization">
        <Code code={`def allowed_roles(roles):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(user, *args, **kwargs):
            if user.role not in roles:
                raise PermissionError('User not allowed')
            return func(user, *args, **kwargs)
        return wrapper
    return decorator

@allowed_roles(["admin", "moderator"])
def delete_post(user, post_id):
    print(f"{user.name} deleted post {post_id}")`} />
      </Section>

      <Section title="Retry with Exponential Backoff">
        <Code code={`import time, functools, random

def retry(exceptions=(Exception,), max_retries=3, initial_delay=1.0,
          backoff_factor=2.0, max_delay=30.0, jitter=True):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            delay = initial_delay
            attempt = 0
            while True:
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    attempt += 1
                    if attempt > max_retries:
                        raise
                    sleep_time = min(delay, max_delay)
                    if jitter:
                        sleep_time += random.uniform(0, sleep_time * 0.1)
                    time.sleep(sleep_time)
                    delay *= backoff_factor
        return wrapper
    return decorator`} />
      </Section>

      <Section title="@classmethod · @staticmethod · @property">
        <H>@classmethod — receives cls, not self</H>
        <Code code={`class Pizza:
    base_price = 10

    @classmethod
    def from_ingredients(cls, *ingredients):
        pizza = cls()
        pizza.ingredients = ingredients
        return pizza

    @classmethod
    def set_base_price(cls, price):
        cls.base_price = price`} color={C.green} />

        <H>@staticmethod — receives neither</H>
        <Code code={`class MathOperations:
    @staticmethod
    def add(x, y): return x + y

    @staticmethod
    def is_even(num): return num % 2 == 0

MathOperations.add(5, 3)   # 8`} color={C.green} />

        <H>@property — controlled attribute access</H>
        <Code code={`class Temperature:
    def __init__(self, celsius): self._celsius = celsius

    @property
    def celsius(self): return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15: raise ValueError("Below absolute zero!")
        self._celsius = value

    @property
    def fahrenheit(self): return self._celsius * 9/5 + 32

temp = Temperature(25)
print(temp.fahrenheit)  # 77.0
temp.celsius = 30`} color={C.green} />

        <Table
          headers={["Decorator", "First Arg", "Instance?", "Class?", "Use"]}
          rows={[
            ["@classmethod", "cls", "No", "Yes", "Factory methods, modify class state"],
            ["@staticmethod", "None", "No", "No", "Utility functions"],
            ["@property", "self", "Yes", "Yes", "Controlled attribute access"],
          ]}
        />
      </Section>

      <Section title="Class Decorator">
        <Code code={`def add_method(cls):
    cls.extra = lambda self: "extra method"
    return cls

@add_method
class A: pass

print(A().extra())  # "extra method"`} />
      </Section>
    </div>
  );
}

function IntrospectionContent() {
  return (
    <div>
      <P>The ability of a program to examine the type, attributes, metadata, and internal structure of objects at runtime.</P>
      <Callout color={C.blue}>Introspection + Reflection = Dynamic behavior. Powers ORMs, DI frameworks, decorators, and plugin systems.</Callout>
      <Table
        headers={["Task", "Tool", "Example"]}
        rows={[
          ["Exact type", "type(obj)", "type(x)"],
          ["Inheritance-aware type", "isinstance(obj, cls)", "isinstance(x, int)"],
          ["List all attributes", "dir(obj)", "dir(user)"],
          ["Instance attributes", "vars(obj)", "vars(user)"],
          ["Internal storage", "obj.__dict__", "obj.__dict__['x']"],
          ["Is callable?", "callable(obj)", "callable(func)"],
          ["Identify kind", "inspect.is*()", "inspect.isfunction(f)"],
          ["Function signature", "inspect.signature", "inspect.signature(fn)"],
          ["Source code", "inspect.getsource", "inspect.getsource(fn)"],
          ["Docstring", "inspect.getdoc", "inspect.getdoc(fn)"],
          ["Annotations", "__annotations__", "fn.__annotations__"],
          ["MRO", "__mro__", "Class.__mro__"],
          ["Dynamic read", "getattr(obj, name)", "getattr(o, 'x', None)"],
          ["Dynamic write", "setattr(obj, name, val)", "setattr(o, 'age', 30)"],
          ["Dynamic import", "__import__()", "__import__('math')"],
        ]}
      />
    </div>
  );
}

function IteratorsContent() {
  return (
    <div>
      <P>An iterator is an object that maintains state, produces values one at a time, and implements <code style={{color:C.cyan}}>__iter__()</code> and <code style={{color:C.cyan}}>__next__()</code>.</P>
      <Callout color={C.cyan}>Iterators do not load all data into memory. They power for loops, map(), filter(), zip(), enumerate(), reversed().</Callout>

      <Section title="Iterator Protocol" defaultOpen>
        <Code code={`a = ['1', '2', '3']
it = iter(a)
print(next(it))  # 1
print(next(it))  # 2
print(next(it))  # 3
print(next(it))  # StopIteration

# Under the hood of a for loop:
it = iter([1, 2, 3])
while True:
    try:
        print(next(it))
    except StopIteration:
        break`} color={C.cyan} />
      </Section>

      <Section title="Custom Iterator">
        <Code code={`class Countup:
    def __init__(self, limit):
        self.limit = limit
        self.current = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self.current > self.limit:
            raise StopIteration
        self.current += 1
        return self.current

for x in Countup(4):
    print(x)  # 1 2 3 4`} color={C.cyan} />
      </Section>
    </div>
  );
}

function GeneratorsContent() {
  return (
    <div>
      <P>A generator produces values lazily (on demand) using <code style={{color:C.green}}>yield</code> — values generated one at a time, ideal for streaming and infinite sequences.</P>
      <Callout color={C.green}>"yield pauses a function, returns a value, preserves execution state, and resumes from the same point on next call."</Callout>

      <Section title="Basic Generator" defaultOpen>
        <Code code={`def custom_count_upto(n):
    for i in range(1, n+1):
        yield i

gen = custom_count_upto(5)
print(next(gen))  # 1
print(next(gen))  # 2`} color={C.green} />
      </Section>

      <Section title="Generator Expression vs List">
        <Code code={`# List comprehension — stores all values in memory
numbers = [i for i in range(10_000_000)]  # BAD for large data

# Generator expression — lazy evaluation
numbers = (i for i in range(10_000_000))  # GOOD

squares = (x * x for x in range(5))
for i in squares:
    print(i)`} color={C.green} />
      </Section>

      <Section title="Infinite Generator">
        <Code code={`def infinite_counter():
    n = 0
    while True:
        yield n
        n += 1

# Use with itertools.islice to limit`} color={C.green} />
      </Section>

      <Section title="send() — Two-way Communication">
        <Code code={`def accumulator():
    total = 0
    while True:
        value = yield total
        total += value

gen = accumulator()
next(gen)        # start generator
gen.send(10)     # 10
gen.send(5)      # 15

# yield from — generator delegation
def sub_gen():
    yield 1
    yield 2

def main_gen():
    yield from sub_gen()
    yield 3`} color={C.green} />
      </Section>

      <Section title="Real-World Use Cases">
        <Code code={`# File processing — never loads whole file
def read_large_file(path):
    with open(path) as f:
        for line in f:
            yield line

# Data pipeline
def filter_even(nums):
    for n in nums:
        if n % 2 == 0:
            yield n

nums = (i for i in range(10))
evens = filter_even(nums)`} color={C.green} />
      </Section>

      <Table
        headers={["Feature", "Generator", "Iterator"]}
        rows={[
          ["Syntax", "yield", "__iter__, __next__"],
          ["Boilerplate", "Minimal", "More"],
          ["Use case", "Most loops", "Custom behavior"],
        ]}
      />
      <Callout color={C.green}>Use generators when: data is large/infinite, you need lazy evaluation, building streaming pipelines.</Callout>
    </div>
  );
}

function ContextContent() {
  return (
    <div>
      <P>A context manager ensures setup and cleanup logic using <code style={{color:C.orange}}>__enter__</code> and <code style={{color:C.orange}}>__exit__</code>, guaranteeing resource safety even during exceptions.</P>

      <Section title="How with Works" defaultOpen>
        <Code code={`# Under the hood:
value = context_manager.__enter__()
try:
    # body
finally:
    context_manager.__exit__(exc_type, exc_value, traceback)

# Without context manager:
f = open("data.txt")
try:
    data = f.read()
finally:
    f.close()

# With context manager:
with open("data.txt") as f:
    data = f.read()  # always closed`} color={C.orange} />
      </Section>

      <Section title="Custom Class-Based Context Manager">
        <Code code={`class FileManager:
    def __init__(self, filename, mode):
        self.filename = filename
        self.mode = mode
        self.file = None

    def __enter__(self):
        self.file = open(self.filename, self.mode)
        return self.file

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.file:
            self.file.close()
        return False  # don't suppress exceptions

with FileManager("test.txt", "w") as f:
    f.write("Hello")`} color={C.orange} />
      </Section>

      <Section title="contextlib — Generator-Based">
        <Code code={`from contextlib import contextmanager

@contextmanager
def file_manager(filename, mode):
    f = open(filename, mode)
    try:
        yield f
    finally:
        f.close()

with file_manager("test.txt", "w") as f:
    f.write("Hello")`} color={C.orange} />
      </Section>

      <Section title="State Management — Temporary Settings">
        <Code code={`GLOBAL_CONFIG = {"DEBUG": False, "LOG_LEVEL": "INFO"}

class TemporarySetting:
    def __init__(self, config, key, new_value):
        self.config = config
        self.key = key
        self.new_value = new_value

    def __enter__(self):
        self.old_value = self.config.get(self.key)
        self.config[self.key] = self.new_value

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.config[self.key] = self.old_value
        return False

with TemporarySetting(GLOBAL_CONFIG, "DEBUG", True):
    print("Inside:", GLOBAL_CONFIG)  # DEBUG: True
print("Outside:", GLOBAL_CONFIG)      # DEBUG: False`} color={C.orange} />
      </Section>

      <Table
        headers={["Principle", "Explanation"]}
        rows={[
          ["Snapshot state", "Save old value before change"],
          ["Atomic change", "Apply new value in __enter__"],
          ["Guaranteed restore", "Restore in finally / __exit__"],
          ["Exception safety", "Never skip cleanup"],
          ["Scope-limited", "State changes only inside with"],
        ]}
      />
    </div>
  );
}

function MagicContent() {
  return (
    <div>
      <P>Magic (dunder) methods let your class work with operators, be printable, iterable, support <code style={{color:C.red}}>len()</code>, work with <code style={{color:C.red}}>with</code>, and behave like built-ins.</P>

      <H color={C.red}>Object Lifecycle</H>
      <Table
        headers={["Method", "When it runs"]}
        rows={[
          ["__new__", "Object creation (before init)"],
          ["__init__", "Object initialization"],
          ["__del__", "Object deletion"],
        ]}
      />
      <Table
        headers={["Feature", "__new__", "__init__"]}
        rows={[
          ["Creates object", "✅", "❌"],
          ["Initializes object", "❌", "✅"],
          ["Returns instance", "✅ (required)", "❌"],
          ["Common usage", "Rare", "Very common"],
          ["Used in immutability", "✅", "❌"],
        ]}
      />

      <Section title="String Representation" defaultOpen>
        <Code code={`class User:
    def __init__(self, name):
        self.name = name

    def __str__(self):
        return f"User: {self.name}"   # user-friendly

    def __repr__(self):
        return f"User(name={self.name!r})"  # developer-friendly`} color={C.red} />
        <Callout color={C.red}>__repr__ → Unambiguous, ideally re-creatable. __str__ → Readable, user-facing.</Callout>
      </Section>

      <Section title="Arithmetic Operators">
        <Code code={`class Vector:
    def __init__(self, x): self.x = x
    def __add__(self, other): return Vector(self.x + other.x)
    def __sub__(self, other): return Vector(self.x - other.x)
    def __mul__(self, scalar): return Vector(self.x * scalar)
    def __repr__(self): return f"Vector({self.x})"

v1 = Vector(2)
v2 = Vector(3)
print(v1 + v2)  # Vector(5)`} color={C.red} />
      </Section>

      <Section title="Attribute Access (Advanced)">
        <Code code={`class SmartObject:
    def __getattribute__(self, name):
        print("GET:", name)
        return object.__getattribute__(self, name)  # avoid recursion!

    def __getattr__(self, name):
        print("FALLBACK:", name)
        return "default"

    def __setattr__(self, name, value):
        print("SET:", name, value)
        self.__dict__[name] = value

    def __delattr__(self, name):
        print("DEL:", name)
        object.__delattr__(self, name)

# __getattribute__ always runs first
# __getattr__ is fallback only`} color={C.red} />
      </Section>

      <Table
        headers={["Category", "Method", "Usage"]}
        rows={[
          ["Lifecycle", "__new__, __init__, __del__", "Object creation / deletion"],
          ["String", "__str__, __repr__", "print(obj), debugging"],
          ["Length", "__len__, __bool__", "len(obj), bool(obj)"],
          ["Arithmetic", "__add__, __sub__, __mul__", "obj1 + obj2"],
          ["Comparison", "__eq__, __lt__, __gt__", "obj1 == obj2"],
          ["Iteration", "__iter__, __next__", "for x in obj"],
          ["Container", "__getitem__, __setitem__", "obj[key]"],
          ["Context", "__enter__, __exit__", "with obj as x"],
          ["Attributes", "__getattr__, __setattr__", "obj.x = 10"],
        ]}
      />
    </div>
  );
}

function ArgsContent() {
  return (
    <div>
      <P><code style={{color:C.blue}}>*args</code> collects extra positional arguments into a tuple. <code style={{color:C.blue}}>**kwargs</code> collects extra keyword arguments into a dictionary.</P>

      <Section title="*args — Variable Positional" defaultOpen>
        <Code code={`def add_all(*args):
    print("type:", type(args))  # tuple
    return sum(args)

print(add_all(1, 2, 3, 4))  # 10`} />
      </Section>

      <Section title="**kwargs — Variable Keyword">
        <Code code={`def print_user(**kwargs):
    print("type:", type(kwargs))  # dict
    for key, value in kwargs.items():
        print(f"{key} = {value}")

print_user(name="Pankul", role="Backend Engineer", experience=3.2)`} />
      </Section>

      <Section title="Combined Pattern">
        <Code code={`def demo_function(a, b, *args, **kwargs):
    print("Fixed:", a, b)
    print("*args:", args)
    print("**kwargs:", kwargs)

demo_function(10, 20, 30, 40, name="Pankul", tech="Python")
# Fixed: 10 20
# *args: (30, 40)
# **kwargs: {'name': 'Pankul', 'tech': 'Python'}`} />
      </Section>

      <Table
        headers={["Use Case", "Why"]}
        rows={[
          ["Logging utilities", "Different message formats"],
          ["Decorators", "Forward unknown arguments"],
          ["API wrappers", "Optional query parameters"],
          ["Frameworks (FastAPI, Django)", "Flexible handler signatures"],
        ]}
      />
    </div>
  );
}

function AsyncEventLoopViz() {
  const [activeTask, setActiveTask] = useState(null);
  const tasks = [
    { id: 0, label: "fetch api1", color: C.green },
    { id: 1, label: "fetch api2", color: C.cyan },
    { id: 2, label: "fetch api3", color: C.yellow },
  ];
  return (
    <div style={{ background: "#080810", border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, margin: "12px 0" }}>
      <div style={{ fontSize: 10, color: C.dim, fontFamily: "monospace", marginBottom: 12 }}>// event loop — single thread, cooperative switching at every await</div>
      <div style={{ display: "flex", gap: 10 }}>
        {tasks.map(t => (
          <div key={t.id}
            onMouseEnter={() => setActiveTask(t.id)}
            onMouseLeave={() => setActiveTask(null)}
            style={{
              flex: 1, background: activeTask === t.id ? `${t.color}12` : C.surfaceHigh,
              border: `1px solid ${activeTask === t.id ? t.color : C.border}`,
              borderRadius: 8, padding: "10px 12px", cursor: "pointer", transition: "all 0.2s",
            }}>
            <div style={{ color: t.color, fontSize: 10, fontFamily: "monospace" }}>Task {t.id + 1}</div>
            <div style={{ color: C.muted, fontSize: 11, marginTop: 3 }}>{t.label}</div>
            <div style={{ marginTop: 8, height: 3, borderRadius: 2, background: C.border }}>
              <div style={{ height: "100%", borderRadius: 2, background: t.color, width: activeTask === t.id ? "100%" : "25%", transition: "width 0.6s ease" }} />
            </div>
            <div style={{ color: C.dim, fontSize: 9, marginTop: 5, fontFamily: "monospace" }}>
              {activeTask === t.id ? "▶ running" : "⏸ awaiting"}
            </div>
          </div>
        ))}
      </div>
      <div style={{ color: C.dim, fontSize: 10, fontFamily: "monospace", marginTop: 10 }}>hover a task → while it awaits I/O, others continue</div>
    </div>
  );
}

function AsyncContent() {
  return (
    <div>
      <P>Single-threaded cooperative multitasking. While one task waits on I/O, the event loop switches to another — no threads, no shared memory issues.</P>
      <Callout color={C.cyan}>❌ Not for CPU-heavy work (use multiprocessing instead). ✅ Best for: network calls, DB queries, file I/O, high-concurrency APIs (FastAPI, aiohttp).</Callout>

      <Table
        headers={["Model", "Best For", "Parallel?", "Memory", "Overhead"]}
        rows={[
          ["asyncio", "High I/O, 1000s tasks", "❌ No", "Low", "Very low"],
          ["Threading", "I/O + legacy libs", "❌ No (GIL)", "Medium", "Medium"],
          ["Multiprocessing", "CPU heavy", "✅ Yes", "High", "High"],
        ]}
      />

      <Section title="Core Concept — Blocking vs Async" defaultOpen>
        <AsyncEventLoopViz />
        <Code code={`# Blocking — each sleep blocks the thread
time.sleep(1)  # waits
time.sleep(1)  # waits
time.sleep(1)  # waits
# total: 3 seconds

# Async — each sleep suspends (yields control)
await asyncio.sleep(1)  # suspends
await asyncio.sleep(1)  # suspends
await asyncio.sleep(1)  # suspends
# total: ~1 second (run concurrently)`} color={C.cyan} />
      </Section>

      <Section title="Entry Point — asyncio.run() and async def">
        <Table
          headers={["Keyword", "Meaning"]}
          rows={[
            ["async def", "Defines a coroutine function"],
            ["await", "Pause until awaited coroutine completes"],
            ["asyncio.run()", "Creates event loop, runs coroutine, closes loop"],
            ["Coroutine", "A function that can be paused & resumed"],
          ]}
        />
        <Code code={`async def fetch(url):
    await asyncio.sleep(1)        # simulates I/O
    return f"data from {url}"

coro = fetch("api.com")           # not running yet — just a coroutine object
result = await coro               # runs now

asyncio.run(main())               # entry point`} color={C.cyan} />
      </Section>

      <Section title="Tasks — Concurrent Scheduling">
        <P><code style={{color:C.yellow}}>create_task()</code> schedules a coroutine to run concurrently. Unlike <code style={{color:C.yellow}}>await</code>, it doesn't block the current coroutine.</P>
        <Code code={`t1 = asyncio.create_task(fetch("api1.com"))
t2 = asyncio.create_task(fetch("api2.com"))
t3 = asyncio.create_task(fetch("api3.com"))

r1 = await t1  # ~1 sec total (all 3 run in parallel)`} color={C.cyan} />
        <H>Task Control API</H>
        <Code code={`task.cancel()     # sends CancelledError into the coroutine
task.done()       # True if finished (success, error, or cancelled)
task.result()     # returns value (raises if not done or errored)
task.exception()  # returns exception or None
task.cancelled()  # True if cancelled`} color={C.muted} />
      </Section>

      <Section title="Waiting — gather, wait, wait_for">
        <Code code={`# gather() — run all, collect results in order
results = await asyncio.gather(
    fetch("api1.com"),
    fetch("api2.com"),
    return_exceptions=True     # don't raise, include errors in results
)

# wait() — fine-grained control over completion
done, pending = await asyncio.wait(
    [t1, t2, t3],
    return_when=asyncio.FIRST_COMPLETED   # or ALL_COMPLETED, FIRST_EXCEPTION
)

# wait_for() — timeout on a single coroutine
try:
    result = await asyncio.wait_for(fetch("slow.com"), timeout=3.0)
except asyncio.TimeoutError:
    print("Timed out")`} color={C.cyan} />
      </Section>

      <Section title="Sync Primitives — Lock, Semaphore, Queue, Event">
        <H>Lock — mutual exclusion</H>
        <Code code={`lock = asyncio.Lock()

async def safe_write():
    async with lock:
        await db.write(data)    # only one task at a time`} color={C.cyan} />
        <H>Semaphore — limit concurrency</H>
        <Code code={`sem = asyncio.Semaphore(10)

async def limited(url):
    async with sem:
        return await fetch(url)   # max 10 concurrent`} color={C.cyan} />
        <H>Queue — producer / consumer</H>
        <Code code={`queue = asyncio.Queue(maxsize=10)

async def producer():
    await queue.put(item)

async def consumer():
    item = await queue.get()
    queue.task_done()`} color={C.cyan} />
        <H>Event — signal between tasks</H>
        <Code code={`event = asyncio.Event()

async def waiter():
    await event.wait()   # blocks until event is set

async def setter():
    event.set()          # unblocks all waiters`} color={C.cyan} />
      </Section>

      <Section title="Blocking Code — run_in_executor">
        <P>Run synchronous/blocking code without freezing the event loop.</P>
        <Code code={`loop = asyncio.get_event_loop()

# Thread pool (I/O-bound blocking code)
result = await loop.run_in_executor(None, blocking_db_call)

# Process pool (CPU-bound)
with ProcessPoolExecutor() as pool:
    result = await loop.run_in_executor(pool, cpu_heavy_fn, data)`} color={C.cyan} />
      </Section>

      <Section title="Real-world Patterns">
        <H>Limit concurrency with Semaphore</H>
        <Code code={`sem = asyncio.Semaphore(10)

async def main():
    async def limited(url):
        async with sem:
            return await fetch(url)

    tasks = [limited(url) for url in urls]
    await asyncio.gather(*tasks)   # 10 at a time`} color={C.cyan} />
        <H>FastAPI streaming response</H>
        <Code code={`async def generate_csv(query):
    yield "id,name\\n"
    for row in db.execute(query):
        yield f"{row.id},{row.name}\\n"

@app.get("/export")
def export():
    return StreamingResponse(generate_csv(q))`} color={C.cyan} />
      </Section>

      <Section title="asyncio vs Node.js Equivalent">
        <Table
          headers={["asyncio (Python)", "Node.js"]}
          rows={[
            ["asyncio.run()", "app.listen()"],
            ["async def", "async function"],
            ["await", "await"],
            ["asyncio.gather()", "Promise.all()"],
            ["asyncio.wait()", "Promise.allSettled()"],
            ["asyncio.create_task()", "new Promise() (eager)"],
            ["asyncio.Semaphore", "p-limit"],
            ["asyncio.Queue", "stream.Transform"],
          ]}
        />
      </Section>
    </div>
  );
}

function InterviewContent() {
  return (
    <div>
      <Section title="is vs == — Identity vs Equality" defaultOpen>
        <P><code style={{color:C.yellow}}>==</code> checks value equality using <code>__eq__()</code>. <code style={{color:C.yellow}}>is</code> checks memory identity (same object).</P>
        <Code code={`a = [1, 2, 3]
b = [1, 2, 3]
print(a == b)   # True  — same values
print(a is b)   # False — different objects in memory

# is is for singletons
x = None
if x is None:   # correct
    pass

# Small integers are cached:
x = 256; y = 256
print(x is y)   # True  (CPython caches -5 to 256)

x = 257; y = 257
print(x is y)   # False (above cache range)`} />
      </Section>

      <Section title="Mutable vs Immutable">
        <Table
          headers={["Type", "Mutable?", "Modified in place?", "New object created?"]}
          rows={[
            ["list", "✅", "✅", "❌"],
            ["dict", "✅", "✅", "❌"],
            ["set", "✅", "✅", "❌"],
            ["int", "❌", "❌", "✅"],
            ["str", "❌", "❌", "✅"],
            ["tuple", "❌", "❌", "✅"],
          ]}
        />
        <Callout color={C.yellow}>Only immutable types can be dictionary keys — their hash must never change.</Callout>
        <Code code={`cache = {}
cache[(1, 2, 3)] = "result"   # ✅ tuple — hashable
cache[[1, 2, 3]] = "result"   # ❌ TypeError — list not hashable`} />
      </Section>

      <Section title="Closures">
        <P>A closure is created when a nested function captures and retains access to variables from its enclosing scope.</P>
        <Code code={`def counter():
    count = 0

    def increment():
        nonlocal count
        count += 1
        return count

    return increment

c1 = counter()
c2 = counter()
print(c1())  # 1
print(c1())  # 2
print(c2())  # 1  — independent state

# Factory pattern
def multiplier(factor):
    def multiply(x): return x * factor
    return multiply

double = multiplier(2)
triple = multiplier(3)
print(double(5))  # 10`} />
        <Table
          headers={["", "Closure", "Class"]}
          rows={[
            ["Style", "Functional", "OOP"],
            ["Boilerplate", "Minimal", "More"],
            ["State", "Encapsulated", "Explicit (self)"],
          ]}
        />
      </Section>

      <Section title="Garbage Collection">
        <P>Python uses two layers: Reference Counting (primary, immediate) + Cyclic GC (handles circular references).</P>
        <Code code={`import sys, gc

a = []
print(sys.getrefcount(a))  # 2 (a + temp ref)
b = a
print(sys.getrefcount(a))  # 3
del b
del a  # count = 0 → immediately deallocated

# Cyclic GC — handles circular refs
gc.disable()
gc.enable()
gc.collect()  # force collection`} color={C.blue} />
        <Table
          headers={["Generation", "Description", "Collected"]}
          rows={[
            ["Gen 0", "New objects", "Frequently"],
            ["Gen 1", "Survived once", "Less often"],
            ["Gen 2", "Long-lived objects", "Rarely"],
          ]}
        />
        <Callout color={C.blue}>Memory leaks in long-running services: global references, unbounded caches, circular refs with destructors, closures capturing large objects.</Callout>
      </Section>
    </div>
  );
}

function SlotsContent() {
  return (
    <div>
      <P><code style={{color:C.orange}}>__slots__</code> reduces memory usage by preventing per-instance dictionaries and restricting instances to a fixed set of attributes.</P>
      <Callout color={C.orange}>For millions of objects, __slots__ can save hundreds of MBs — ideal for data objects and hot paths.</Callout>

      <Table
        headers={["Feature", "Normal Class", "With __slots__"]}
        rows={[
          ["__dict__ per instance", "✅ Yes", "❌ No"],
          ["Memory per instance", "High", "Much lower"],
          ["Attribute lookup", "Dict-based", "Faster / direct"],
          ["Dynamic attributes", "Allowed", "❌ Disallowed"],
        ]}
      />

      <Section title="Usage" defaultOpen>
        <Code code={`class Point:
    __slots__ = ('x', 'y')  # only these attrs allowed

    def __init__(self, x, y):
        self.x = x
        self.y = y

p = Point(1, 2)
p.x = 10    # ✅ OK
p.z = 5     # ❌ AttributeError

# Inheritance with __slots__
class Point3D(Point):
    __slots__ = ('z',)  # add z to parent's x, y

    def __init__(self, x, y, z):
        super().__init__(x, y)
        self.z = z`} color={C.orange} />
      </Section>

      <Callout color={C.orange}>
        When to use: ✅ Classes with many instances · ✅ Data objects / DTOs · ✅ Hot paths · ✅ Models with fixed schema
      </Callout>
    </div>
  );
}

// ─── OOP & Access Modifiers ───────────────────────────────────────────────────

const OOP_MODIFIERS = [
  {
    id: "public", syntax: "name", label: "Public", icon: "🌐", color: C.green,
    enforced: "No",
    purpose: "Open access — anyone can read or write",
    description: "Default for everything. No restriction, no convention warning. Accessible from anywhere.",
    code: `class BankAccount:
    def __init__(self):
        self.balance = 1000   # public

acc = BankAccount()
print(acc.balance)    # ✅ works
acc.balance = 9999    # ✅ works — anyone can modify`,
  },
  {
    id: "protected", syntax: "_name", label: "Protected", icon: "🔔", color: C.yellow,
    enforced: "Convention only",
    purpose: "Internal / subclass use — don't touch from outside",
    description: "Single underscore. Not enforced by Python — just a signal to other developers. Common in base classes meant for subclasses.",
    code: `class Animal:
    def __init__(self):
        self._sound = "..."    # for subclasses

class Dog(Animal):
    def speak(self):
        return self._sound     # ✅ subclass access fine

d = Dog()
d._sound = "woof"  # ✅ works — Python won't stop you
                   # ⚠️  but convention says don't`,
  },
  {
    id: "private", syntax: "__name", label: "Private", icon: "🔒", color: C.red,
    enforced: "Name mangling",
    purpose: "Prevent accidental override in subclasses",
    description: "Double underscore. Python renames __pin to _ClassName__pin internally — called name mangling. Prevents subclass collisions.",
    code: `class BankAccount:
    def __init__(self):
        self.__pin = 1234   # stored as _BankAccount__pin

acc = BankAccount()
acc.__pin               # ❌ AttributeError
acc._BankAccount__pin   # ✅ 1234 — mangled name

class Sub(BankAccount):
    def __init__(self):
        super().__init__()
        self.__pin = 9999  # stored as _Sub__pin — different!`,
  },
  {
    id: "dunder", syntax: "__name__", label: "Dunder", icon: "⚙️", color: C.purple,
    enforced: "Reserved by Python",
    purpose: "Python built-in hooks — never create your own",
    description: "Double underscore on both sides. Reserved for Python internals. These are hooks Python calls automatically — no name mangling.",
    code: `class Cart:
    def __init__(self):
        self.items = []

    def __len__(self):
        return len(self.items)    # called by len(cart)

    def __str__(self):
        return f"Cart: {len(self.items)} items"  # print(cart)

    def __repr__(self):
        return f"Cart({self.items})"

cart = Cart()
len(cart)    # → calls __len__
print(cart)  # → calls __str__`,
  },
  {
    id: "property", syntax: "@property", label: "Property", icon: "🛡️", color: C.blue,
    enforced: "Yes (via setter)",
    purpose: "Controlled get/set with validation",
    description: "The Pythonic way to protect attributes. Looks like plain attribute access from outside — but validation runs internally.",
    code: `class BankAccount:
    def __init__(self):
        self.__balance = 0

    @property
    def balance(self):           # getter
        return self.__balance

    @balance.setter
    def balance(self, value):    # setter with validation
        if value < 0:
            raise ValueError("Balance cannot be negative")
        self.__balance = value

    @balance.deleter
    def balance(self):
        del self.__balance

acc = BankAccount()
acc.balance = 1000   # calls setter
print(acc.balance)   # calls getter
acc.balance = -500   # ❌ ValueError`,
  },
  {
    id: "classmethod", syntax: "@classmethod", label: "Class Method", icon: "🏛️", color: C.orange,
    enforced: "Yes",
    purpose: "Access class state — receives cls not self",
    description: "Receives the class as first argument instead of the instance. Can access and modify class-level state. Common in factory patterns.",
    code: `class Connection:
    _pool_size = 5             # class state

    @classmethod
    def set_pool(cls, size):   # cls = Connection
        cls._pool_size = size

    @classmethod
    def from_url(cls, url):    # factory pattern
        instance = cls()
        instance.url = url
        return instance

Connection.set_pool(10)
conn = Connection.from_url("db://localhost")`,
  },
  {
    id: "staticmethod", syntax: "@staticmethod", label: "Static Method", icon: "🔧", color: C.cyan,
    enforced: "Yes",
    purpose: "Pure utility — no class or instance state",
    description: "No self, no cls. Completely independent of class state. Just a function namespaced inside a class for organization.",
    code: `class MathUtils:
    multiplier = 2

    @staticmethod
    def add(x, y):          # no cls, no self
        return x + y        # pure utility

    @staticmethod
    def is_valid_age(age):
        return 0 < age < 150

MathUtils.add(3, 4)          # 7
MathUtils.is_valid_age(25)   # True`,
  },
  {
    id: "abstract", syntax: "@abstractmethod", label: "Abstract", icon: "📐", color: C.purple,
    enforced: "Yes (at instantiation)",
    purpose: "Force subclasses to implement — closest to interface",
    description: "From abc module. Unlike Protocol (duck typing), ABC enforces implementation at class instantiation. TypeError if subclass doesn't implement.",
    code: `from abc import ABC, abstractmethod

class Notifier(ABC):
    @abstractmethod
    def send(self, message):     # must implement
        pass

class EmailNotifier(Notifier):
    def send(self, message):     # ✅ implemented
        print(f"Email: {message}")

class BrokenNotifier(Notifier):
    pass                         # ❌ forgot send

n = EmailNotifier()              # ✅ works
n = BrokenNotifier()             # ❌ TypeError
n = Notifier()                   # ❌ TypeError`,
  },
];

const OOP_COMPARISON = [
  { syntax: "name",            self: "✅", cls: "❌", classState: "✅", instanceState: "✅", enforced: "No" },
  { syntax: "_name",           self: "✅", cls: "❌", classState: "✅", instanceState: "✅", enforced: "Convention" },
  { syntax: "__name",          self: "✅", cls: "❌", classState: "✅", instanceState: "✅", enforced: "Mangling" },
  { syntax: "@property",       self: "✅", cls: "❌", classState: "❌", instanceState: "✅", enforced: "Yes" },
  { syntax: "@classmethod",    self: "❌", cls: "✅", classState: "✅", instanceState: "❌", enforced: "Yes" },
  { syntax: "@staticmethod",   self: "❌", cls: "❌", classState: "❌", instanceState: "❌", enforced: "Yes" },
  { syntax: "@abstractmethod", self: "✅", cls: "❌", classState: "✅", instanceState: "✅", enforced: "At init" },
];

function OopContent() {
  const [activeMod, setActiveMod] = useState("public");
  const mod = OOP_MODIFIERS.find(m => m.id === activeMod);

  return (
    <div>
      <P>Python has no strict access control — it's all naming conventions and decorator hooks. Unlike Java/C++ where <code style={{color:C.red}}>private</code> is compiler-enforced.</P>
      <Callout color={C.green}>Python philosophy: <span style={{color:C.blue}}>"we're all consenting adults"</span> — conventions are respected by the community, not enforced by the runtime. Use <code style={{color:C.purple}}>@abstractmethod</code> + <code style={{color:C.purple}}>ABC</code> when you need real enforcement.</Callout>

      {/* Modifier pills */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "16px 0 12px" }}>
        {OOP_MODIFIERS.map(m => (
          <button key={m.id} onClick={() => setActiveMod(m.id)} style={{
            background: activeMod === m.id ? `${m.color}20` : C.surfaceHigh,
            border: `1px solid ${activeMod === m.id ? m.color : C.border}`,
            borderRadius: 20, padding: "4px 12px",
            color: activeMod === m.id ? m.color : C.muted,
            fontFamily: "'JetBrains Mono','Fira Code',monospace", fontSize: 11,
            cursor: "pointer", transition: "all 0.15s",
          }}>{m.syntax}</button>
        ))}
      </div>

      {/* Detail card */}
      <div style={{
        background: C.surfaceHigh, border: `1px solid ${C.border}`,
        borderTop: `3px solid ${mod.color}`, borderRadius: 10,
        padding: "16px 20px", marginBottom: 12,
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>{mod.icon}</span>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: mod.color }}>{mod.label}</span>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 3, background: `${mod.color}20`, color: mod.color, border: `1px solid ${mod.color}40` }}>
                  Enforced: {mod.enforced}
                </span>
              </div>
              <code style={{ fontSize: 11, color: C.dim }}>{mod.syntax}</code>
            </div>
          </div>
          <div style={{ background: `${mod.color}0c`, border: `1px solid ${mod.color}25`, borderLeft: `3px solid ${mod.color}`, borderRadius: 6, padding: "8px 12px", maxWidth: 260 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: mod.color, marginBottom: 4 }}>purpose</div>
            <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{mod.purpose}</div>
          </div>
        </div>
        <P>{mod.description}</P>
        <Code code={mod.code} color={mod.color === C.green ? C.green : mod.color === C.yellow ? C.yellow : C.blue} />
      </div>

      {/* Comparison table */}
      <H>Comparison Table</H>
      <div style={{ overflowX: "auto", margin: "10px 0 16px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr>
              {["Syntax", "self", "cls", "Class State", "Instance State", "Enforced"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: C.dim, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", borderBottom: `1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {OOP_COMPARISON.map((row, i) => {
              const m = OOP_MODIFIERS.find(x => x.syntax === row.syntax);
              const isActive = mod.syntax === row.syntax;
              return (
                <tr key={i} onClick={() => m && setActiveMod(m.id)} style={{ cursor: "pointer", background: isActive ? `${m?.color}10` : "transparent", borderBottom: `1px solid ${C.surfaceHigh}`, transition: "background 0.15s" }}>
                  <td style={{ padding: "9px 12px" }}>
                    <code style={{ fontSize: 11, color: isActive ? m?.color : C.yellow }}>{row.syntax}</code>
                  </td>
                  {[row.self, row.cls, row.classState, row.instanceState].map((v, j) => (
                    <td key={j} style={{ padding: "9px 12px", textAlign: "center", fontSize: 13 }}>{v}</td>
                  ))}
                  <td style={{ padding: "9px 12px", fontSize: 11, color: row.enforced === "No" ? C.dim : row.enforced === "Convention" ? C.yellow : C.green, fontFamily: "monospace" }}>
                    {row.enforced}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── OOP Four Pillars ─────────────────────────────────────────────────────────

const PILLARS_DATA = [
  {
    id: "encapsulation", num: "01", label: "Encapsulation",
    icon: "⬡", color: C.cyan, mechanism: "__private, @property",
    tagline: "Bundle data + behavior. Hide internals.",
    description: "Keep related data and functions in one place. Control what's exposed to the outside world. Outside code never touches internal state directly.",
    keyIdea: "Data is protected from accidental corruption — only methods can modify it.",
    code: `class BankAccount:
    def __init__(self, owner, balance):
        self.owner     = owner          # public
        self.__balance = balance        # private

    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount    # only method can modify

    def withdraw(self, amount):
        if amount > self.__balance:
            raise ValueError("Insufficient funds")
        self.__balance -= amount

    @property
    def balance(self):
        return self.__balance           # controlled read

acc = BankAccount("Alice", 1000)
acc.deposit(500)
print(acc.balance)    # 1500
acc.__balance         # ❌ AttributeError`,
  },
  {
    id: "inheritance", num: "02", label: "Inheritance",
    icon: "⬢", color: C.green, mechanism: "class Child(Parent), super()",
    tagline: "Reuse and extend parent behavior.",
    description: "Child class gets everything from parent, then adds or overrides. Avoids duplicating code across related classes.",
    keyIdea: "super() calls the parent's method — always call it in __init__ to properly initialize the chain.",
    code: `class Animal:
    def __init__(self, name, sound):
        self.name  = name
        self.sound = sound

    def speak(self):
        return f"{self.name} says {self.sound}"

    def eat(self):
        return f"{self.name} is eating"

class Dog(Animal):
    def __init__(self, name):
        super().__init__(name, "Woof")  # parent init
        self.tricks = []

    def learn(self, trick):             # new behavior
        self.tricks.append(trick)

    def speak(self):                    # override parent
        return f"{self.name} barks: WOOF!"

dog = Dog("Rex")
dog.eat()     # ✅ inherited — "Rex is eating"
dog.speak()   # ✅ overridden — "Rex barks: WOOF!"

# MRO — Method Resolution Order
class Duck(Animal, Flyable, Swimmable): ...
print(Duck.__mro__)
# [Duck → Animal → Flyable → Swimmable → object]`,
  },
  {
    id: "polymorphism", num: "03", label: "Polymorphism",
    icon: "◈", color: C.yellow, mechanism: "method overriding, duck typing",
    tagline: "Same interface, different behavior.",
    description: "One function works on different types as long as they share the interface. Python uses duck typing — no inheritance required.",
    keyIdea: '"If it has a .move() method, it\'s good enough" — that\'s duck typing.',
    code: `class Circle:
    def __init__(self, r): self.r = r
    def area(self): return 3.14 * self.r ** 2

class Rectangle:
    def __init__(self, w, h): self.w, self.h = w, h
    def area(self): return self.w * self.h

class Triangle:
    def __init__(self, b, h): self.b, self.h = b, h
    def area(self): return 0.5 * self.b * self.h

# Same function — works on any shape
def print_area(shape):
    print(f"Area: {shape.area()}")

shapes = [Circle(5), Rectangle(4, 6), Triangle(3, 8)]
for s in shapes:
    print_area(s)   # each calls own area()

# Duck typing — no inheritance needed
class Car:
    def move(self): return "drives"

class Boat:
    def move(self): return "sails"

def go(vehicle):
    print(vehicle.move())  # just needs .move()`,
  },
  {
    id: "abstraction", num: "04", label: "Abstraction",
    icon: "◇", color: C.purple, mechanism: "ABC, @abstractmethod",
    tagline: "Hide complexity. Enforce contracts.",
    description: "Force a contract — subclasses must implement specific methods. Hide implementation details. Expose only what's necessary.",
    keyIdea: "Unlike Protocol (duck typing), ABC enforces at instantiation — TypeError if not implemented.",
    code: `from abc import ABC, abstractmethod

class PaymentProcessor(ABC):

    @abstractmethod
    def charge(self, amount):      # must implement
        pass

    @abstractmethod
    def refund(self, amount):      # must implement
        pass

    def receipt(self, amount):     # concrete — shared
        return f"Receipt: \${amount}"

class StripeProcessor(PaymentProcessor):
    def charge(self, amount):
        return f"Stripe charged \${amount}"
    def refund(self, amount):
        return f"Stripe refunded \${amount}"

class BrokenProcessor(PaymentProcessor):
    pass                           # forgot to implement

stripe = StripeProcessor()         # ✅
stripe.receipt(100)                # ✅ inherited

p = BrokenProcessor()              # ❌ TypeError
p = PaymentProcessor()             # ❌ TypeError`,
  },
];

const DUNDERS_DATA = [
  { method: "__init__",     trigger: "ClassName()",   desc: "constructor" },
  { method: "__repr__",     trigger: "print(obj)",    desc: "string representation" },
  { method: "__str__",      trigger: "str(obj)",      desc: "human-readable string" },
  { method: "__add__",      trigger: "a + b",         desc: "addition operator" },
  { method: "__len__",      trigger: "len(obj)",      desc: "length" },
  { method: "__eq__",       trigger: "a == b",        desc: "equality check" },
  { method: "__getitem__",  trigger: "obj[0]",        desc: "index access" },
  { method: "__contains__", trigger: "x in obj",      desc: "membership test" },
  { method: "__call__",     trigger: "obj()",         desc: "callable instance" },
  { method: "__enter__",    trigger: "with obj:",     desc: "context manager enter" },
];

function PillarsContent() {
  const [activePillar, setActivePillar] = useState("encapsulation");
  const [showAllDunders, setShowAllDunders] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const current = PILLARS_DATA.find(p => p.id === activePillar);

  const copyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const PillarCode = ({ code, color, id }) => (
    <div style={{ position: "relative" }}>
      <pre style={{
        margin: 0, padding: "14px 16px",
        background: "#080810", border: `1px solid ${C.border}`,
        borderLeft: `3px solid ${color}50`, borderRadius: "0 8px 8px 0",
        fontSize: 12, lineHeight: 1.75, color: C.blue,
        fontFamily: "'JetBrains Mono','Fira Code',monospace",
        overflowX: "auto", whiteSpace: "pre",
      }}><code>{code}</code></pre>
      <button onClick={() => copyCode(code, id)} style={{
        position: "absolute", top: 8, right: 8,
        background: copiedId === id ? `${color}20` : "#ffffff0a",
        border: `1px solid ${copiedId === id ? color : C.border}`,
        borderRadius: 4, padding: "2px 8px",
        color: copiedId === id ? color : C.dim,
        fontSize: 10, cursor: "pointer", fontFamily: "monospace", transition: "all 0.2s",
      }}>{copiedId === id ? "✓" : "copy"}</button>
    </div>
  );

  return (
    <div>
      <P>The four fundamental concepts of Object-Oriented Programming. Python implements all of them — some via naming conventions, some via decorators, some via the ABC module.</P>

      {/* Pillar pills */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "14px 0" }}>
        {PILLARS_DATA.map(p => (
          <button key={p.id} onClick={() => setActivePillar(p.id)} style={{
            background: activePillar === p.id ? `${p.color}18` : C.surfaceHigh,
            border: `1px solid ${activePillar === p.id ? p.color : C.border}`,
            borderRadius: 20, padding: "5px 14px", cursor: "pointer",
            color: activePillar === p.id ? p.color : C.muted,
            fontFamily: "'JetBrains Mono','Fira Code',monospace",
            fontSize: 11, transition: "all 0.15s",
          }}>{p.num} {p.label}</button>
        ))}
      </div>

      {/* Active pillar detail */}
      <div style={{
        background: C.surfaceHigh, border: `1px solid ${C.border}`,
        borderTop: `3px solid ${current.color}`, borderRadius: 10,
        padding: "18px 20px", marginBottom: 16,
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 48, height: 48, background: `${current.color}10`,
              border: `1px solid ${current.color}30`, borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, color: current.color, flexShrink: 0,
            }}>{current.icon}</div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: current.color }}>{current.label}</span>
                <span style={{ fontSize: 9, color: current.color, opacity: 0.5, fontFamily: "monospace", letterSpacing: 2 }}>PILLAR {current.num}</span>
              </div>
              <code style={{ fontSize: 10, color: C.dim }}>{current.mechanism}</code>
            </div>
          </div>
          <div style={{
            background: `${current.color}0c`, border: `1px solid ${current.color}25`,
            borderLeft: `3px solid ${current.color}`, borderRadius: "0 6px 6px 0",
            padding: "8px 12px", maxWidth: 260,
          }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: current.color, marginBottom: 4 }}>key idea</div>
            <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5, fontStyle: "italic" }}>"{current.keyIdea}"</div>
          </div>
        </div>
        <P>{current.description}</P>
        <div style={{ marginTop: 12 }}>
          <PillarCode code={current.code} color={current.color} id={current.id} />
        </div>
      </div>

      {/* All 4 at a glance grid */}
      <H>All 4 Pillars at a Glance</H>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10, marginBottom: 20 }}>
        {PILLARS_DATA.map(p => (
          <div key={p.id} onClick={() => setActivePillar(p.id)} style={{
            background: activePillar === p.id ? `${p.color}10` : C.surface,
            border: `1px solid ${activePillar === p.id ? p.color + "40" : C.border}`,
            borderRadius: 8, padding: "12px 14px", cursor: "pointer", transition: "all 0.15s",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ color: p.color, fontSize: 16 }}>{p.icon}</span>
              <span style={{ fontFamily: "monospace", fontSize: 9, color: p.color, opacity: 0.5, letterSpacing: 2 }}>{p.num}</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: p.color, marginBottom: 3 }}>{p.label}</div>
            <div style={{ fontSize: 10, color: C.dim, fontFamily: "monospace", marginBottom: 4 }}>{p.mechanism}</div>
            <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.4 }}>{p.tagline}</div>
          </div>
        ))}
      </div>

      {/* Dunder methods */}
      <H>Dunder / Magic Methods</H>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 8, marginBottom: 8 }}>
        {(showAllDunders ? DUNDERS_DATA : DUNDERS_DATA.slice(0, 6)).map((d, i) => (
          <div key={i} style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 8, padding: "10px 12px",
          }}>
            <code style={{ color: C.purple, fontSize: 12, display: "block", marginBottom: 4 }}>{d.method}</code>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: C.dim, fontFamily: "monospace", fontSize: 10 }}>{d.trigger}</span>
              <span style={{ color: C.muted, fontSize: 10 }}>{d.desc}</span>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => setShowAllDunders(s => !s)} style={{
        background: "transparent", border: `1px solid ${C.border}`, borderRadius: 4,
        padding: "4px 12px", color: C.dim, fontFamily: "monospace", fontSize: 10,
        cursor: "pointer", marginBottom: 20, transition: "all 0.15s",
      }}>{showAllDunders ? "show less ▲" : "show all ▼"}</button>

      {/* Combined example */}
      <H color={C.blue}>All 4 Pillars Combined</H>
      <PillarCode id="combined" color={C.blue} code={`from abc import ABC, abstractmethod

# Abstraction — defines contract
class Vehicle(ABC):
    def __init__(self, brand, speed):
        self.brand   = brand
        self.__speed = speed          # Encapsulation — private

    @property
    def speed(self):                  # Encapsulation — controlled access
        return self.__speed

    @speed.setter
    def speed(self, value):
        if value < 0:
            raise ValueError("Speed can't be negative")
        self.__speed = value

    @abstractmethod
    def move(self):                   # Abstraction — must implement
        pass

    def describe(self):
        return f"{self.brand} at {self.__speed}km/h"

# Inheritance — reuse Vehicle
class Car(Vehicle):
    def move(self):                   # Polymorphism
        return f"{self.brand} drives on road"

class Drone(Vehicle):
    def move(self):                   # Polymorphism
        return f"{self.brand} flies in air"

# Polymorphism — same interface, different behavior
fleet = [Car("Toyota", 120), Drone("DJI", 60)]

for v in fleet:
    print(v.move())      # each calls own move()
    print(v.describe())  # inherited from Vehicle`} />

      {/* Footer summary row */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        border: `1px solid ${C.border}`, borderRadius: 10,
        overflow: "hidden", marginTop: 20,
      }}>
        {PILLARS_DATA.map((p, i) => (
          <div key={p.id} onClick={() => setActivePillar(p.id)} style={{
            padding: "12px 14px", cursor: "pointer",
            borderRight: i < 3 ? `1px solid ${C.border}` : "none",
            background: activePillar === p.id ? `${p.color}0c` : C.surface,
            transition: "background 0.15s",
          }}>
            <div style={{ color: p.color, fontSize: 18, marginBottom: 4 }}>{p.icon}</div>
            <div style={{ color: p.color, fontSize: 11, fontWeight: 700, marginBottom: 2 }}>{p.label}</div>
            <div style={{ color: C.dim, fontFamily: "monospace", fontSize: 9 }}>{p.mechanism}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FastAPI ───────────────────────────────────────────────────────────────────

const FASTAPI_SECTIONS = [
  { id: "flow",       label: "Request Flow",     icon: "⟶", color: "#38bdf8", short: "How requests travel" },
  { id: "routes",     label: "Routes & Input",   icon: "⊕", color: "#34d399", short: "Path, query, body" },
  { id: "pydantic",   label: "Pydantic",         icon: "◈", color: "#fb923c", short: "Validation backbone" },
  { id: "response",   label: "Responses",        icon: "↩", color: "#a78bfa", short: "Models & status codes" },
  { id: "depends",    label: "Dependencies",     icon: "⬡", color: "#f472b6", short: "DI system" },
  { id: "auth",       label: "Auth / JWT",       icon: "🔐", color: "#fbbf24", short: "OAuth2 + JWT" },
  { id: "errors",     label: "Error Handling",   icon: "⚠", color: "#f87171", short: "HTTP & custom errors" },
  { id: "middleware", label: "Middleware",       icon: "⊞", color: "#2dd4bf", short: "CORS, logging" },
  { id: "routers",    label: "Routers",          icon: "⎇", color: "#818cf8", short: "Modular structure" },
  { id: "async",      label: "Async vs Sync",    icon: "⚡", color: "#86efac", short: "When to use which" },
  { id: "cheatsheet", label: "Interview Sheet",  icon: "★", color: "#fde68a", short: "Key concepts" },
];

const FASTAPI_CONTENT = {
  flow: {
    title: "Request Flow",
    desc: "Every request travels through this pipeline before reaching your handler.",
    blocks: [
      { label: "Pipeline", code: `Client Request
      ↓
Uvicorn (ASGI server)        ← receives raw HTTP
      ↓
Middleware stack              ← auth, logging, CORS
      ↓
Router                        ← matches path + method
      ↓
Dependencies                  ← injected before handler
      ↓
Route Handler                 ← your function
      ↓
Pydantic validation           ← request body, params
      ↓
Response                      ← serialized, status code` },
      { label: "Setup", code: `from fastapi import FastAPI

app = FastAPI(
    title="My API",
    version="1.0.0",
    docs_url="/docs",       # Swagger UI — auto generated
    redoc_url="/redoc",     # ReDoc UI — auto generated
)

# Run with:
# uvicorn main:app --reload` },
    ],
  },
  routes: {
    title: "Routes & Input",
    desc: "Three ways to receive input — path, query, and body.",
    blocks: [
      { label: "HTTP Methods", code: `@app.get("/users")          # READ list
@app.post("/users")         # CREATE
@app.put("/users/{id}")     # UPDATE (full replace)
@app.patch("/users/{id}")   # UPDATE (partial)
@app.delete("/users/{id}")  # DELETE
@app.head("/users")         # headers only, no body
@app.options("/users")      # CORS preflight` },
      { label: "Path Parameters", code: `@app.get("/users/{user_id}")
async def get_user(user_id: int):  # type hint = auto validation
    return {"id": user_id}

# GET /users/42     → {"id": 42}
# GET /users/abc    → 422 — not an int

# Multiple path params
@app.get("/users/{user_id}/posts/{post_id}")
async def get_post(user_id: int, post_id: int):
    return {"user": user_id, "post": post_id}` },
      { label: "Query Parameters", code: `@app.get("/users")
async def list_users(
    page:   int        = 1,     # default = optional
    limit:  int        = 10,
    active: bool       = True,
    search: str | None = None   # None = completely optional
):
    return {"page": page, "limit": limit}

# GET /users?page=2&limit=5&search=alice` },
      { label: "Request Body", code: `from pydantic import BaseModel

class UserCreate(BaseModel):
    name:  str
    email: str
    age:   int

@app.post("/users")
async def create_user(user: UserCreate):
    return user

# POST /users
# Body: {"name": "Alice", "email": "a@b.com", "age": 28}
# Bad body → 422 Unprocessable automatically` },
    ],
  },
  pydantic: {
    title: "Pydantic — Validation Backbone",
    desc: "FastAPI's entire validation system is built on Pydantic. It handles coercion, constraints, and custom logic.",
    blocks: [
      { label: "Field Constraints", code: `from pydantic import BaseModel, EmailStr, Field
from enum import Enum

class Role(str, Enum):
    admin = "admin"
    user  = "user"
    guest = "guest"

class UserCreate(BaseModel):
    name:     str      = Field(min_length=2, max_length=50)
    email:    EmailStr                          # validates format
    age:      int      = Field(gt=0, lt=150)   # greater/less than
    role:     Role     = Role.user             # must match enum
    password: str      = Field(min_length=8)
    tags:     list[str] = []                   # default empty list` },
      { label: "Validators", code: `from pydantic import validator, model_validator

class UserCreate(BaseModel):
    name:     str
    role:     Role
    password: str

    @validator("name")
    def name_must_be_alpha(cls, v):
        if not v.replace(" ", "").isalpha():
            raise ValueError("Letters only")
        return v.title()               # normalize — Alice not alice

    @model_validator(mode="after")
    def admin_needs_strong_pass(self):
        if self.role == Role.admin and len(self.password) < 12:
            raise ValueError("Admin needs 12+ char password")
        return self` },
      { label: "What Pydantic Does", code: `# Type coercion — "42" → 42
# Format validation — EmailStr, HttpUrl, UUID
# Constraints — Field(gt=0, min_length=2)
# Custom logic — @validator, @model_validator
# Serialization — .dict(), .json(), .model_dump()
# Nested models

class Address(BaseModel):
    street: str
    city:   str

class User(BaseModel):
    name:    str
    address: Address       # nested model — auto validated

user = User(
    name="Alice",
    address={"street": "123 Main", "city": "NYC"}  # dict → Address
)` },
    ],
  },
  response: {
    title: "Responses",
    desc: "Control what gets returned — shape, status code, and filtering.",
    blocks: [
      { label: "response_model", code: `class UserResponse(BaseModel):
    id:    int
    name:  str
    email: str
    role:  str
    # No password field — never returned

@app.post(
    "/users",
    response_model=UserResponse,   # filters output
    status_code=201,               # Created
)
async def create_user(user: UserCreate):
    result = {"id": 1, "password": "secret", **user.dict()}
    return result   # password filtered by response_model ✅` },
      { label: "Response Types", code: `from fastapi.responses import (
    JSONResponse,       # default — dict → JSON
    HTMLResponse,       # return HTML string
    PlainTextResponse,  # plain text
    FileResponse,       # serve a file
    StreamingResponse,  # stream large data
    RedirectResponse,   # 301/302 redirect
)

@app.get("/stream")
async def stream():
    async def generator():
        for i in range(10):
            yield f"data: {i}\\n\\n"
    return StreamingResponse(generator(), media_type="text/event-stream")

@app.get("/redirect")
async def redirect():
    return RedirectResponse(url="/new-url", status_code=301)` },
      { label: "Multiple Status Codes", code: `@app.get("/users/{id}", responses={
    200: {"model": UserResponse},
    404: {"description": "User not found"},
    403: {"description": "Not authorized"},
})
async def get_user(id: int):
    user = db.find(id)
    if not user:
        return JSONResponse(
            status_code=404,
            content={"detail": "Not found"}
        )
    return user` },
    ],
  },
  depends: {
    title: "Dependencies — DI System",
    desc: "FastAPI's most powerful feature. Inject reusable logic before your handler runs. Supports nesting and cleanup.",
    blocks: [
      { label: "Basic Dependency", code: `from fastapi import Depends

# DB session — yield = cleanup after request
def get_db():
    db = SessionLocal()
    try:
        yield db            # handler gets db here
    finally:
        db.close()          # always runs after request

@app.get("/users")
async def list_users(db = Depends(get_db)):
    return db.query(User).all()` },
      { label: "Chained Dependencies", code: `def get_current_user(
    token: str = Depends(oauth2_scheme),
    db         = Depends(get_db)        # nested dependency
):
    user = db.query(User).filter_by(token=token).first()
    if not user:
        raise HTTPException(401, "Invalid token")
    return user

def require_admin(user = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(403, "Admins only")
    return user

@app.delete("/users/{id}")
async def delete_user(id: int, user = Depends(require_admin)):
    return {"deleted": id}` },
      { label: "Class-Based Dependency", code: `class Paginate:
    def __init__(self, page: int = 1, limit: int = 10):
        self.page  = page
        self.limit = limit
        self.skip  = (page - 1) * limit

@app.get("/posts")
async def list_posts(
    pagination = Depends(Paginate),   # class as dependency
    db         = Depends(get_db)
):
    return db.query(Post)\\
             .offset(pagination.skip)\\
             .limit(pagination.limit)\\
             .all()` },
    ],
  },
  auth: {
    title: "Auth / JWT",
    desc: "OAuth2 password flow with JWT tokens — the standard FastAPI auth pattern.",
    blocks: [
      { label: "Login — Issue Token", code: `from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError
from datetime import datetime, timedelta

SECRET    = "your-secret-key"
ALGORITHM = "HS256"
EXPIRES   = 30  # minutes

def create_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=EXPIRES)
    return jwt.encode(payload, SECRET, algorithm=ALGORITHM)

@app.post("/auth/login")
async def login(form: OAuth2PasswordRequestForm = Depends()):
    user = authenticate(form.username, form.password)
    if not user:
        raise HTTPException(401, "Invalid credentials")
    token = create_token({"sub": str(user.id), "role": user.role})
    return {"access_token": token, "token_type": "bearer"}` },
      { label: "Verify Token — Dependency", code: `oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(401, "Invalid token")
    except JWTError:
        raise HTTPException(401, "Could not validate token")
    user = db.get(int(user_id))
    if not user:
        raise HTTPException(401, "User not found")
    return user

@app.get("/me", response_model=UserResponse)
async def get_me(user = Depends(get_current_user)):
    return user` },
      { label: "Role-Based Access", code: `def require_role(*roles):
    def checker(user = Depends(get_current_user)):
        if user.role not in roles:
            raise HTTPException(403, f"Requires: {roles}")
        return user
    return checker

@app.get("/admin/stats")
async def admin_stats(user = Depends(require_role("admin"))): ...

@app.get("/reports")
async def reports(user = Depends(require_role("admin", "manager"))): ...` },
    ],
  },
  errors: {
    title: "Error Handling",
    desc: "HTTPException for standard errors, custom handlers for domain-specific errors.",
    blocks: [
      { label: "HTTPException", code: `from fastapi import HTTPException

raise HTTPException(
    status_code=404,
    detail="User not found",
    headers={"X-Error": "user-not-found"}   # optional
)

# Common status codes
# 400 — Bad Request (invalid input)
# 401 — Unauthorized (no/invalid token)
# 403 — Forbidden (valid token, wrong permissions)
# 404 — Not Found
# 409 — Conflict (duplicate resource)
# 422 — Unprocessable (Pydantic validation — auto)
# 500 — Internal Server Error` },
      { label: "Custom Exception Handler", code: `from fastapi.exceptions import RequestValidationError

class AppError(Exception):
    def __init__(self, code: str, message: str, status: int = 400):
        self.code    = code
        self.message = message
        self.status  = status

@app.exception_handler(AppError)
async def app_error_handler(request, exc: AppError):
    return JSONResponse(
        status_code=exc.status,
        content={"code": exc.code, "message": exc.message}
    )

@app.exception_handler(RequestValidationError)
async def validation_handler(request, exc: RequestValidationError):
    return JSONResponse(status_code=422, content={"errors": exc.errors()})

# Usage anywhere:
raise AppError("USER_NOT_FOUND", "No user with that id", 404)` },
    ],
  },
  middleware: {
    title: "Middleware",
    desc: "Runs before and after every request. Use for CORS, logging, rate limiting, timing.",
    blocks: [
      { label: "CORS", code: `from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://myapp.com"],   # or ["*"] for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)` },
      { label: "Custom Middleware", code: `from starlette.middleware.base import BaseHTTPMiddleware
import time

class TimingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        start    = time.time()
        response = await call_next(request)   # call handler
        duration = time.time() - start
        response.headers["X-Process-Time"] = str(duration)
        print(f"{request.method} {request.url.path} → {response.status_code} ({duration:.3f}s)")
        return response

app.add_middleware(TimingMiddleware)

# Middleware order: LIFO
# Last added = first to run on request, last on response` },
      { label: "Auth Middleware", code: `class AuthMiddleware(BaseHTTPMiddleware):
    PUBLIC = ["/auth/login", "/docs", "/openapi.json"]

    async def dispatch(self, request, call_next):
        if request.url.path in self.PUBLIC:
            return await call_next(request)

        token = request.headers.get("Authorization")
        if not token or not token.startswith("Bearer "):
            return JSONResponse({"detail": "Unauthorized"}, 401)

        # verify token...
        return await call_next(request)` },
    ],
  },
  routers: {
    title: "Routers — Modular Structure",
    desc: "Split routes into domain-specific files. Each router is an independent module.",
    blocks: [
      { label: "Router File", code: `# routers/users.py
from fastapi import APIRouter, Depends

router = APIRouter(
    prefix="/users",
    tags=["Users"],                          # Swagger grouping
    dependencies=[Depends(require_auth)],    # applies to all routes
)

@router.get("/")
async def list_users(): ...

@router.post("/", status_code=201)
async def create_user(user: UserCreate): ...

@router.delete("/{id}")
async def delete_user(id: int): ...` },
      { label: "main.py — Register Routers", code: `from routers import users, auth, products, admin

app = FastAPI()

app.include_router(auth.router, prefix="/auth")
app.include_router(users.router)
app.include_router(products.router, prefix="/products")
app.include_router(
    admin.router,
    prefix="/admin",
    dependencies=[Depends(require_admin)]
)

# Project structure:
# ├── main.py
# ├── routers/
# │   ├── users.py
# │   ├── auth.py
# │   └── products.py
# ├── models/
# └── dependencies.py` },
    ],
  },
  async: {
    title: "Async vs Sync",
    desc: "async def for I/O-bound. def for CPU-bound. Never block the event loop.",
    blocks: [
      { label: "When to Use Each", code: `# async def — for I/O: DB, HTTP, file reads
@app.get("/users")
async def list_users():
    users = await db.fetch_all("SELECT * FROM users")
    return users

# def — for CPU work: image processing, ML inference
# FastAPI runs sync routes in a threadpool automatically
@app.post("/compress")
def compress_image(file: UploadFile):
    result = heavy_image_processing(file)
    return result

# NEVER block the event loop in async
@app.get("/bad")
async def bad_route():
    time.sleep(5)           # ❌ blocks ENTIRE event loop
    requests.get("...")     # ❌ blocking HTTP in async

@app.get("/good")
async def good_route():
    await asyncio.sleep(5)  # ✅ suspends, others run
    async with httpx.AsyncClient() as c:
        r = await c.get("...")   # ✅ async HTTP` },
      { label: "Run Blocking Code in Async", code: `import asyncio

@app.post("/process")
async def process(data: dict):
    loop   = asyncio.get_event_loop()
    result = await loop.run_in_executor(None, blocking_fn, data)
    return result

# Background tasks — fire and forget
from fastapi import BackgroundTasks

@app.post("/signup")
async def signup(user: UserCreate, bg: BackgroundTasks):
    new_user = create_user(user)
    bg.add_task(send_welcome_email, new_user.email)  # runs after response
    return new_user` },
    ],
  },
  cheatsheet: {
    title: "Interview Cheat Sheet",
    desc: "Key concepts, likely questions, and one-liner answers.",
    blocks: [
      { label: "Likely Questions", code: `# PUT vs PATCH?
# PUT = full replace, PATCH = partial update

# How does FastAPI validate data?
# Via Pydantic — type hints auto-parsed.
# Invalid data → 422 before handler runs.

# What is Depends()?
# Dependency injection — resolves before handler.
# Supports nesting, caching, cleanup via yield.

# sync vs async route?
# async def → event loop (I/O bound)
# def → threadpool (CPU bound, FastAPI handles it)
# Never block event loop in async def.

# How does auth work?
# OAuth2PasswordBearer extracts token from header.
# Depends() decodes + validates it.
# Chain: get_current_user → require_admin` },
      { label: "Key Concepts", code: `BaseModel          → Pydantic class — validates data
Depends()          → inject reusable logic
response_model     → filter + shape output
HTTPException      → raise HTTP errors anywhere
@validator         → custom field validation
yield in Depends() → setup + teardown (DB sessions)
OAuth2PasswordBearer → extracts Bearer token
include_router()   → modularize by domain
Middleware         → runs on every request
status_code=       → set HTTP status on route
BackgroundTasks    → fire-and-forget after response
Field(gt=, lt=)    → Pydantic field constraints
tags=[]            → Swagger UI grouping` },
    ],
  },
};

const FASTAPI_FLOW_STEPS = [
  { label: "Client",     color: "#38bdf8" },
  { label: "Uvicorn",    color: "#94a3b8" },
  { label: "Middleware", color: "#2dd4bf" },
  { label: "Router",     color: "#34d399" },
  { label: "Depends()",  color: "#f472b6" },
  { label: "Handler",    color: "#fb923c" },
  { label: "Pydantic",   color: "#a78bfa" },
  { label: "Response",   color: "#38bdf8" },
];

function FastAPIContent() {
  const [activeSection, setActiveSection] = useState("flow");
  const [hoveredStep, setHoveredStep] = useState(null);
  const [copiedBlock, setCopiedBlock] = useState(null);

  const section = FASTAPI_SECTIONS.find(s => s.id === activeSection);
  const content = FASTAPI_CONTENT[activeSection];

  const copyCode = (code, key) => {
    navigator.clipboard.writeText(code);
    setCopiedBlock(key);
    setTimeout(() => setCopiedBlock(null), 1400);
  };

  const FaCodeBlock = ({ code, blockKey }) => (
    <div style={{ position: "relative" }}>
      <pre style={{
        margin: 0, padding: "14px 16px",
        background: "#010408", border: "1px solid #0c1a28",
        borderLeft: `2px solid ${section.color}60`,
        borderRadius: "0 6px 6px 0",
        fontSize: 12, lineHeight: 1.8, color: "#6db890",
        fontFamily: "'JetBrains Mono','Fira Code',monospace",
        overflowX: "auto", whiteSpace: "pre",
      }}><code>{code}</code></pre>
      <button onClick={() => copyCode(code, blockKey)} style={{
        position: "absolute", top: 8, right: 8,
        background: copiedBlock === blockKey ? `${section.color}18` : "#ffffff07",
        border: `1px solid ${copiedBlock === blockKey ? section.color : "#1a2e40"}`,
        borderRadius: 4, padding: "2px 8px",
        color: copiedBlock === blockKey ? section.color : "#2a4055",
        fontSize: 10, cursor: "pointer", fontFamily: "monospace", transition: "all 0.2s",
      }}>{copiedBlock === blockKey ? "✓" : "copy"}</button>
    </div>
  );

  return (
    <div style={{ background: "#010408", borderRadius: 10, overflow: "hidden", border: `1px solid #0c1a28` }}>

      {/* Header with flow viz */}
      <div style={{ padding: "20px 24px 0", background: "linear-gradient(180deg,#02080f 0%,#010408 100%)", borderBottom: "1px solid #0c1a28" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: "monospace", fontSize: 9, color: "#38bdf8", letterSpacing: 4, textTransform: "uppercase", marginBottom: 6, opacity: 0.6 }}>Python · Async Web Framework</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 28, fontWeight: 700, color: "#e8f4ff", letterSpacing: -1 }}>FastAPI</span>
              <span style={{ fontFamily: "monospace", color: "#38bdf8", fontSize: 11, opacity: 0.5 }}>Starlette + Pydantic + asyncio</span>
            </div>
          </div>
          {/* Request flow strip */}
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0 }}>
            {FASTAPI_FLOW_STEPS.map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <div onMouseEnter={() => setHoveredStep(i)} onMouseLeave={() => setHoveredStep(null)} style={{
                  background: hoveredStep === i ? `${step.color}18` : "#02080f",
                  border: `1px solid ${hoveredStep === i ? step.color + "60" : "#0c1a28"}`,
                  borderRadius: 4, padding: "3px 8px",
                  fontFamily: "monospace", fontSize: 9,
                  color: hoveredStep === i ? step.color : "#1e3a52",
                  cursor: "default", transition: "all 0.15s", whiteSpace: "nowrap",
                }}>{step.label}</div>
                {i < FASTAPI_FLOW_STEPS.length - 1 && (
                  <div style={{ color: "#0c1a28", fontFamily: "monospace", fontSize: 11, padding: "0 2px" }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section tabs */}
        <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
          {FASTAPI_SECTIONS.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
              padding: "8px 13px", background: "transparent", border: "none",
              borderBottom: `2px solid ${activeSection === s.id ? s.color : "transparent"}`,
              color: activeSection === s.id ? s.color : "#1e3652",
              fontFamily: "'JetBrains Mono',monospace", fontSize: 10,
              cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
            }}>
              <span style={{ marginRight: 5 }}>{s.icon}</span>{s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 24px" }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ color: section.color, fontSize: 18 }}>{section.icon}</span>
            <span style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 700, color: section.color }}>{content.title}</span>
          </div>
          <P>{content.desc}</P>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          {content.blocks.map((block, i) => (
            <div key={i} style={{
              background: "#02080f", border: "1px solid #0c1a28",
              borderTop: `2px solid ${section.color}30`, borderRadius: 8, overflow: "hidden",
            }}>
              <div style={{ padding: "8px 14px", borderBottom: "1px solid #0c1a28", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "monospace", fontSize: 10, color: section.color, opacity: 0.7 }}>// {block.label}</span>
                <span style={{ fontFamily: "monospace", fontSize: 9, color: "#0c1a28", letterSpacing: 2 }}>{String(i + 1).padStart(2, "0")}</span>
              </div>
              <FaCodeBlock code={block.code} blockKey={`${activeSection}-${i}`} />
            </div>
          ))}
        </div>

        {/* Quick-nav grid */}
        <div style={{ marginTop: 28, borderTop: "1px solid #0c1a28", paddingTop: 20 }}>
          <div style={{ fontFamily: "monospace", fontSize: 9, color: "#0c1a28", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>all sections</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8 }}>
            {FASTAPI_SECTIONS.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
                background: activeSection === s.id ? `${s.color}0c` : "#02080f",
                border: `1px solid ${activeSection === s.id ? s.color + "40" : "#0c1a28"}`,
                borderRadius: 6, padding: "8px 10px", textAlign: "left", cursor: "pointer", transition: "all 0.15s",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  <span style={{ color: s.color, fontSize: 11 }}>{s.icon}</span>
                  <span style={{ color: activeSection === s.id ? s.color : "#2a4a62", fontFamily: "monospace", fontSize: 10 }}>{s.label}</span>
                </div>
                <div style={{ color: "#0c1a28", fontFamily: "monospace", fontSize: 9 }}>{s.short}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DB Interview Questions ────────────────────────────────────────────────────

const DB_QUESTIONS = [
  {
    id: 1, db: "postgresql", level: "fundamental",
    q: "What is the difference between SQL and NoSQL? When would you choose PostgreSQL over MongoDB?",
    short: "SQL vs NoSQL",
    answer: `SQL (PostgreSQL) — structured, fixed schema, relational, ACID compliant.
NoSQL (MongoDB) — flexible schema, document-based, horizontally scalable.

Choose PostgreSQL when:
  • Data has clear relationships (users → orders → products)
  • You need ACID transactions (financial, inventory)
  • Schema is stable and well-defined
  • Complex JOINs are required
  • Reporting and analytics (GROUP BY, aggregations)

Choose MongoDB when:
  • Schema evolves frequently
  • Data is naturally nested (user + address + preferences)
  • Horizontal scaling is a priority
  • Real-time apps, catalogs, CMS
  • Rapid prototyping`,
    followUp: "What is ACID and why does it matter?",
    followUpAnswer: `ACID = Atomicity, Consistency, Isolation, Durability.

Atomicity   — all operations in a transaction succeed or all fail.
              (bank transfer: debit + credit both succeed or neither does)
Consistency — DB always moves from one valid state to another.
Isolation   — concurrent transactions don't interfere with each other.
Durability  — committed data survives crashes (written to disk).

PostgreSQL is fully ACID. MongoDB added multi-document ACID
transactions in v4.0 but it's not the default behavior.`,
  },
  {
    id: 2, db: "postgresql", level: "fundamental",
    q: "What is an index? When should you add one and when should you avoid it?",
    short: "Indexes",
    answer: `An index is a separate data structure (B-tree by default) that maps
column values to row locations — like a book index.
Without it: full table scan O(n). With it: O(log n) lookup.

Add an index when:
  • Column is frequently used in WHERE, JOIN, ORDER BY
  • Column has high cardinality (many unique values)
  • Table is large (100k+ rows)

  # SQLAlchemy
  email = Column(String, unique=True, index=True)
  id    = Column(Integer, primary_key=True, index=True)

Avoid index when:
  • Table is small — full scan is faster
  • Column has low cardinality (e.g. boolean, status with 2 values)
  • Write-heavy table — every INSERT/UPDATE/DELETE must update indexes

Types:
  B-tree   → default, equality + range queries
  Hash     → equality only, faster for =
  GIN      → arrays, JSON, full-text search
  BRIN     → very large tables with sequential data`,
    followUp: "What is a composite index?",
    followUpAnswer: `An index on multiple columns together.

  CREATE INDEX idx_user_role ON users(email, role);

Rule: the LEFT-most column must be in the query for the index to be used.

  WHERE email = 'a@b.com' AND role = 'admin'  ✅ uses index
  WHERE email = 'a@b.com'                     ✅ uses index (leftmost)
  WHERE role = 'admin'                         ❌ does NOT use index`,
  },
  {
    id: 3, db: "postgresql", level: "intermediate",
    q: "Explain N+1 query problem and how to solve it in SQLAlchemy.",
    short: "N+1 Problem",
    answer: `N+1 problem: fetching a list of N items, then making 1 additional
query per item = N+1 total queries. Kills performance at scale.

# ❌ N+1 — 1 query for users + N queries for posts
users = db.query(User).all()
for user in users:
    print(user.posts)   # triggers a new query each time
# For 100 users = 101 queries

# Fix 1 — joinedload (JOIN in single query):
from sqlalchemy.orm import joinedload
users = db.query(User).options(joinedload(User.posts)).all()
# 1 query total

# Fix 2 — subqueryload (separate optimized query):
from sqlalchemy.orm import subqueryload
users = db.query(User).options(subqueryload(User.posts)).all()
# 2 queries total — better for large collections

# Fix 3 — selectinload (async-friendly):
from sqlalchemy.orm import selectinload
result = await db.execute(
    select(User).options(selectinload(User.posts))
)`,
    followUp: "When would you use joinedload vs subqueryload?",
    followUpAnswer: `joinedload  → single JOIN query, best for to-one relationships
              (user → profile). Can produce large result sets for
              to-many if many related items exist.

subqueryload → runs a subquery, best for to-many relationships
               (user → posts) where joinedload would duplicate rows.

selectinload → uses IN clause, best for async code.
               SELECT * FROM posts WHERE author_id IN (1,2,3,4...)`,
  },
  {
    id: 4, db: "postgresql", level: "intermediate",
    q: "What are database migrations? How do you handle them with Alembic?",
    short: "Migrations",
    answer: `Migrations = version-controlled changes to your database schema.
Like git commits, but for your DB structure.

Setup:
  pip install alembic
  alembic init alembic

  # alembic/env.py
  from models import Base
  target_metadata = Base.metadata

Commands:
  alembic revision --autogenerate -m "add users table"
  alembic upgrade head        # apply all pending migrations
  alembic downgrade -1        # rollback one migration
  alembic history             # list all migrations
  alembic current             # current version

Generated migration file:
  def upgrade():
      op.create_table('users',
          sa.Column('id', sa.Integer(), primary_key=True),
          sa.Column('email', sa.String(), unique=True),
      )

  def downgrade():
      op.drop_table('users')

Why not Base.metadata.create_all()?
  create_all() only creates missing tables.
  It NEVER modifies existing tables (add column, rename, drop).
  Alembic tracks and applies incremental changes safely.`,
    followUp: "How do you handle migrations in production?",
    followUpAnswer: `Never run migrations manually in production.
Automate in deployment pipeline:

  # Dockerfile / CI
  alembic upgrade head && uvicorn main:app

Best practices:
  • Always test migration on staging first
  • Make migrations backwards-compatible
  • Never delete columns immediately — deprecate first
  • Backup database before running migrations`,
  },
  {
    id: 5, db: "postgresql", level: "advanced",
    q: "What are database transactions and how do you handle them in SQLAlchemy?",
    short: "Transactions",
    answer: `A transaction groups multiple operations — all succeed or all fail.

def transfer(from_id, to_id, amount, db):
    sender    = db.query(User).filter(User.id == from_id).first()
    receiver  = db.query(User).filter(User.id == to_id).first()
    sender.balance   -= amount
    receiver.balance += amount
    db.commit()    # both changes committed atomically

# Explicit transaction with rollback
def safe_transfer(from_id, to_id, amount, db):
    try:
        sender   = db.query(User).get(from_id)
        receiver = db.query(User).get(to_id)
        if sender.balance < amount:
            raise ValueError("Insufficient funds")
        sender.balance   -= amount
        receiver.balance += amount
        db.commit()
    except Exception as e:
        db.rollback()       # undo all changes
        raise HTTPException(400, str(e))

# Savepoint — partial rollback
with db.begin_nested():     # creates savepoint
    db.add(log_entry)       # can rollback just this
db.commit()`,
    followUp: "What is transaction isolation level?",
    followUpAnswer: `Isolation level controls how transactions see each other's changes.

READ UNCOMMITTED  → can read dirty data (rarely used)
READ COMMITTED    → only reads committed data (PostgreSQL default)
REPEATABLE READ   → same query returns same result in transaction
SERIALIZABLE      → full isolation, transactions appear sequential

# Set in SQLAlchemy
engine = create_engine(url, isolation_level="REPEATABLE READ")`,
  },
  {
    id: 6, db: "mongodb", level: "fundamental",
    q: "What is the difference between embedding and referencing in MongoDB? When to use each?",
    short: "Embed vs Reference",
    answer: `EMBEDDING — store nested inside parent document:
  {
    "_id": "user123", "name": "Alice",
    "address": { "street": "123 Main", "city": "NYC" }
  }

REFERENCING — store as separate document with ID:
  { "_id": "user123", "name": "Alice" }
  { "_id": "post1", "author_id": "user123", "title": "..." }

Embed when:
  • Data belongs to one parent (address → user)
  • Read together 90%+ of the time
  • Sub-document doesn't grow unbounded
  • 1:1 or 1:few relationships

Reference when:
  • Data shared across multiple documents
  • Sub-document grows unbounded (comments → post)
  • Sub-document queried independently
  • 1:many or many:many relationships

# Beanie — embed
class User(Document):
    address: Address        # embedded Pydantic model

# Beanie — reference
class Post(Document):
    author: Link[User]      # reference with fetch_links=True`,
    followUp: "What is the 16MB document size limit impact?",
    followUpAnswer: `MongoDB has a hard 16MB per document limit.
If you embed aggressively (e.g. all comments in a post),
you can hit this limit as data grows.

Solution: Reference large or unbounded collections.
  Post → comments (embed if < 100, reference if unbounded)
  User → orders (always reference — can be thousands)`,
  },
  {
    id: 7, db: "mongodb", level: "intermediate",
    q: "What is the MongoDB aggregation pipeline? Explain with an example.",
    short: "Aggregation Pipeline",
    answer: `The aggregation pipeline processes documents through stages.

pipeline = [
    {"$match":   {"is_active": True}},       # 1. filter
    {"$group":   {                            # 2. group + count
        "_id":   "$role",
        "count": {"$sum": 1},
        "avg_age": {"$avg": "$age"}
    }},
    {"$sort":    {"count": -1}},             # 3. sort desc
    {"$limit":   5},                         # 4. top 5 only
    {"$project": {                           # 5. shape output
        "role":    "$_id",
        "count":   1,
        "avg_age": {"$round": ["$avg_age", 1]},
        "_id":     0
    }},
]
results = await User.aggregate(pipeline).to_list()

Common stages:
  $match    → filter (like WHERE)
  $group    → aggregate (like GROUP BY)
  $sort     → order results
  $limit    → cap results
  $project  → shape/rename fields (like SELECT)
  $lookup   → JOIN another collection
  $unwind   → flatten array field
  $addFields→ add computed fields`,
    followUp: "What is $lookup in aggregation?",
    followUpAnswer: `$lookup = JOIN in MongoDB aggregation.

pipeline = [
    {"$lookup": {
        "from":         "users",      # collection to join
        "localField":   "author_id",  # field in posts
        "foreignField": "_id",        # field in users
        "as":           "author"      # output array field
    }},
    {"$unwind": "$author"},           # flatten array to object
]
# Result: each post now has full author object embedded`,
  },
  {
    id: 8, db: "mongodb", level: "intermediate",
    q: "How does indexing work in MongoDB? What types exist?",
    short: "MongoDB Indexes",
    answer: `Same concept as PostgreSQL — avoids full collection scan.
Without index: O(n). With index: O(log n).

# Beanie — define in model
class User(Document):
    email: str
    class Settings:
        indexes = [
            "email",                          # single field
            [("role", 1), ("name", 1)],       # compound
        ]

Types:
  Single field  → index on one field
    db.users.create_index("email", unique=True)

  Compound      → multiple fields
    db.users.create_index([("role", 1), ("age", -1)])
    # 1 = ascending, -1 = descending

  Text          → full-text search
    db.posts.create_index([("title", "text"), ("content", "text")])
    db.posts.find({"$text": {"$search": "fastapi python"}})

  TTL           → auto-delete after time (sessions, logs)
    db.sessions.create_index("created_at", expireAfterSeconds=3600)

  Sparse        → only index documents where field exists
  Partial       → index subset of documents`,
    followUp: "How do you check if your query is using an index?",
    followUpAnswer: `Use explain() to see query execution plan:

  db.users.find({"email": "a@b.com"}).explain("executionStats")

Look for:
  IXSCAN   → index scan ✅ (good)
  COLLSCAN → collection scan ❌ (bad — no index used)

  "nReturned": 1,
  "totalDocsExamined": 1,     ✅ efficient
  "totalDocsExamined": 10000  ❌ scanning too many docs`,
  },
  {
    id: 9, db: "both", level: "advanced",
    q: "How do you handle database connection pooling in FastAPI? Why does it matter?",
    short: "Connection Pooling",
    answer: `Creating a new DB connection per request is expensive (~50-100ms).
Connection pooling reuses existing connections.

PostgreSQL — SQLAlchemy pool:
  engine = create_engine(
      DATABASE_URL,
      pool_size=10,         # max persistent connections
      max_overflow=20,      # extra connections under load
      pool_timeout=30,      # wait time before error
      pool_recycle=1800,    # recycle after 30min (prevents stale)
  )

MongoDB — Motor manages its own pool:
  client = AsyncIOMotorClient(
      MONGO_URL,
      maxPoolSize=10,        # max connections in pool
      minPoolSize=2,         # keep 2 alive always
      maxIdleTimeMS=30000,   # close idle after 30s
  )
  # One global client — NEVER create per request

FastAPI lifecycle — init once:
  @app.on_event("startup")
  async def startup():
      app.state.db = AsyncIOMotorClient(MONGO_URL)

  @app.on_event("shutdown")
  async def shutdown():
      app.state.db.close()`,
    followUp: "What happens if connection pool is exhausted?",
    followUpAnswer: `SQLAlchemy: raises TimeoutError after pool_timeout seconds.
Motor: queues the request until connection returned to pool.

Signs of pool exhaustion:
  • Requests timing out under load
  • "QueuePool limit of size X overflow Y reached" error

Solutions:
  • Increase pool_size (but DB has connection limits too)
  • Use async — handles more requests per connection
  • Release connections quickly
  • Use read replicas for read-heavy workloads`,
  },
  {
    id: 10, db: "both", level: "advanced",
    q: "What are some strategies to optimize slow database queries in production?",
    short: "Query Optimization",
    answer: `Step 1 — Find slow queries first.

  PostgreSQL — slow query logging:
    log_min_duration_statement = 200  # log queries > 200ms

    SELECT query, mean_exec_time, calls
    FROM pg_stat_statements
    ORDER BY mean_exec_time DESC LIMIT 10;

  MongoDB — profiler:
    db.setProfilingLevel(1, {slowms: 100})
    db.system.profile.find().sort({ts:-1}).limit(10)

Step 2 — Add missing indexes.
  PostgreSQL: EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'a@b.com';
  MongoDB:    db.users.find({email:"a@b.com"}).explain("executionStats")

Step 3 — Fix N+1 with eager loading.
  Use joinedload / selectinload instead of lazy load.

Step 4 — Fetch only needed columns.
  # SQLAlchemy
  db.query(User.id, User.email).filter(...).all()
  # MongoDB — projection
  await User.find().project({"name": 1, "email": 1}).to_list()

Step 5 — Paginate. Never return unbounded results.
  db.query(User).offset(skip).limit(limit).all()

Step 6 — Cache frequent reads with Redis.`,
    followUp: "What is the difference between EXPLAIN and EXPLAIN ANALYZE?",
    followUpAnswer: `EXPLAIN         → shows query plan (estimated cost) — fast, no execution
EXPLAIN ANALYZE → actually runs the query and shows real timing

  EXPLAIN SELECT * FROM users WHERE email = 'a@b.com';
  -- Shows: plan + estimated rows + estimated cost

  EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'a@b.com';
  -- Shows: actual rows, actual time, loops
  -- Use this to confirm index is actually being used`,
  },
];

const DB_LEVELS = {
  fundamental: { color: "#34d399", label: "Fundamental" },
  intermediate: { color: "#fb923c", label: "Intermediate" },
  advanced:     { color: "#f87171", label: "Advanced" },
};

const DB_TAG_COLORS = {
  postgresql: "#38bdf8",
  mongodb:    "#4ade80",
  both:       "#a78bfa",
};

const DB_TAG_LABELS = {
  postgresql: "PostgreSQL",
  mongodb:    "MongoDB",
  both:       "Both",
};

function DBInterviewContent() {
  const [activeQ, setActiveQ] = useState(1);
  const [showFollowUp, setShowFollowUp] = useState({});
  const [dbFilter, setDbFilter] = useState("all");
  const [copiedId, setCopiedId] = useState(null);

  const filtered = DB_QUESTIONS.filter(q =>
    dbFilter === "all" ? true : dbFilter === "both" ? q.db === "both" : q.db === dbFilter
  );

  const current = DB_QUESTIONS.find(q => q.id === activeQ);
  const dbColor  = DB_TAG_COLORS[current.db];
  const lvlColor = DB_LEVELS[current.level].color;

  const copyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1400);
  };

  const DbCodeBlock = ({ text, color, cid }) => (
    <div style={{ position: "relative" }}>
      <pre style={{
        margin: 0, padding: "14px 16px",
        background: "#010408", border: "1px solid #0c1a28",
        borderLeft: `2px solid ${color}50`, borderRadius: "0 6px 6px 0",
        fontSize: 12, lineHeight: 1.85, color: "#6db890",
        fontFamily: "'JetBrains Mono','Fira Code',monospace",
        overflowX: "auto", whiteSpace: "pre",
      }}><code>{text}</code></pre>
      <button onClick={() => copyText(text, cid)} style={{
        position: "absolute", top: 8, right: 8,
        background: copiedId === cid ? `${color}18` : "#ffffff07",
        border: `1px solid ${copiedId === cid ? color : "#1a2e40"}`,
        borderRadius: 4, padding: "2px 8px",
        color: copiedId === cid ? color : "#2a4055",
        fontSize: 10, cursor: "pointer", fontFamily: "monospace", transition: "all 0.2s",
      }}>{copiedId === cid ? "✓" : "copy"}</button>
    </div>
  );

  return (
    <div style={{ background: "#010408", borderRadius: 10, border: "1px solid #0c1a28", overflow: "hidden" }}>

      {/* Header */}
      <div style={{ padding: "18px 22px 14px", background: "linear-gradient(180deg,#02080f 0%,#010408 100%)", borderBottom: "1px solid #0c1a28" }}>
        <div style={{ fontFamily: "monospace", fontSize: 9, color: "#38bdf8", letterSpacing: 4, textTransform: "uppercase", marginBottom: 6, opacity: 0.6 }}>Interview Prep</div>
        <div style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 700, color: "#e8f4ff", letterSpacing: -0.5 }}>DB Interview Questions</div>
        <div style={{ color: "#1e3a52", fontSize: 11, fontFamily: "monospace", marginTop: 4 }}>PostgreSQL · MongoDB · 10 questions with answers + follow-ups</div>

        {/* Filter bar */}
        <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap", alignItems: "center" }}>
          {[
            { key: "all",        label: "All (10)",       color: "#7a9db8" },
            { key: "postgresql", label: "PostgreSQL (5)", color: "#38bdf8" },
            { key: "mongodb",    label: "MongoDB (3)",    color: "#4ade80" },
            { key: "both",       label: "Both (2)",       color: "#a78bfa" },
          ].map(f => (
            <button key={f.key} onClick={() => setDbFilter(f.key)} style={{
              background: dbFilter === f.key ? `${f.color}15` : "transparent",
              border: `1px solid ${dbFilter === f.key ? f.color + "60" : "#0c1a28"}`,
              borderRadius: 20, padding: "4px 12px",
              color: dbFilter === f.key ? f.color : "#1e3a52",
              fontFamily: "monospace", fontSize: 10, cursor: "pointer", transition: "all 0.15s",
            }}>{f.label}</button>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
            {Object.entries(DB_LEVELS).map(([k, v]) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: v.color }} />
                <span style={{ fontFamily: "monospace", fontSize: 9, color: v.color, opacity: 0.7 }}>{v.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", minHeight: 500 }}>

        {/* Question list */}
        <div style={{ width: 230, flexShrink: 0, borderRight: "1px solid #0c1a28", padding: "12px 10px", overflowY: "auto", maxHeight: 600 }}>
          {filtered.map(q => (
            <button key={q.id} onClick={() => setActiveQ(q.id)} style={{
              display: "flex", alignItems: "flex-start", gap: 8,
              width: "100%", padding: "10px 8px",
              background: activeQ === q.id ? `${DB_TAG_COLORS[q.db]}0e` : "transparent",
              border: `1px solid ${activeQ === q.id ? DB_TAG_COLORS[q.db] + "30" : "transparent"}`,
              borderRadius: 8, textAlign: "left", marginBottom: 3,
              cursor: "pointer", transition: "all 0.15s",
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: 5, flexShrink: 0,
                background: activeQ === q.id ? `${DB_TAG_COLORS[q.db]}20` : "#02080f",
                border: `1px solid ${activeQ === q.id ? DB_TAG_COLORS[q.db] + "40" : "#0c1a28"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "monospace", fontSize: 9,
                color: activeQ === q.id ? DB_TAG_COLORS[q.db] : "#1e3a52",
              }}>{String(q.id).padStart(2, "0")}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: activeQ === q.id ? "#d4e8f8" : "#2a4a62", fontSize: 11, fontWeight: 500, lineHeight: 1.4, marginBottom: 5 }}>{q.short}</div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  <span style={{ background: `${DB_TAG_COLORS[q.db]}12`, color: DB_TAG_COLORS[q.db], fontSize: 8, padding: "1px 5px", borderRadius: 3, fontFamily: "monospace", border: `1px solid ${DB_TAG_COLORS[q.db]}25` }}>{DB_TAG_LABELS[q.db]}</span>
                  <span style={{ background: `${DB_LEVELS[q.level].color}10`, color: DB_LEVELS[q.level].color, fontSize: 8, padding: "1px 5px", borderRadius: 3, fontFamily: "monospace", border: `1px solid ${DB_LEVELS[q.level].color}20` }}>{DB_LEVELS[q.level].label}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Answer panel */}
        <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>

          {/* Question header */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              <span style={{ background: `${dbColor}12`, color: dbColor, border: `1px solid ${dbColor}30`, fontSize: 10, padding: "2px 8px", borderRadius: 4, fontFamily: "monospace" }}>{DB_TAG_LABELS[current.db]}</span>
              <span style={{ background: `${lvlColor}10`, color: lvlColor, border: `1px solid ${lvlColor}25`, fontSize: 10, padding: "2px 8px", borderRadius: 4, fontFamily: "monospace" }}>{DB_LEVELS[current.level].label}</span>
              <span style={{ background: "#02080f", color: "#1e3a52", border: "1px solid #0c1a28", fontSize: 10, padding: "2px 8px", borderRadius: 4, fontFamily: "monospace" }}>Q{String(current.id).padStart(2, "0")} / 10</span>
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 15, fontWeight: 700, color: "#c4dff0", lineHeight: 1.5 }}>{current.q}</div>
          </div>

          {/* Answer divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 16, height: 1, background: dbColor, opacity: 0.4 }} />
            <span style={{ fontFamily: "monospace", fontSize: 9, color: dbColor, opacity: 0.5, letterSpacing: 2 }}>ANSWER</span>
            <div style={{ flex: 1, height: 1, background: "#0c1a28" }} />
          </div>

          {/* Answer block */}
          <div style={{ background: "#02080f", border: "1px solid #0c1a28", borderTop: `2px solid ${dbColor}30`, borderRadius: 8, overflow: "hidden", marginBottom: 16 }}>
            <DbCodeBlock text={current.answer} color={dbColor} cid={`ans-${current.id}`} />
          </div>

          {/* Follow-up */}
          <div style={{ background: "#02080f", border: "1px solid #0c1a28", borderRadius: 8, overflow: "hidden" }}>
            <button onClick={() => setShowFollowUp(s => ({ ...s, [current.id]: !s[current.id] }))} style={{
              width: "100%", padding: "10px 14px",
              background: showFollowUp[current.id] ? `${lvlColor}08` : "transparent",
              border: "none", display: "flex", alignItems: "center", justifyContent: "space-between",
              cursor: "pointer", transition: "all 0.15s",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: lvlColor, fontSize: 12 }}>⟳</span>
                <div>
                  <div style={{ fontFamily: "monospace", fontSize: 8, color: lvlColor, opacity: 0.6, letterSpacing: 2, textTransform: "uppercase", marginBottom: 2 }}>follow-up</div>
                  <div style={{ color: "#3a6080", fontSize: 11, textAlign: "left", fontFamily: "inherit" }}>{current.followUp}</div>
                </div>
              </div>
              <span style={{ color: lvlColor, fontFamily: "monospace", fontSize: 12, transform: showFollowUp[current.id] ? "rotate(180deg)" : "none", transition: "transform 0.2s", opacity: 0.6 }}>▾</span>
            </button>
            {showFollowUp[current.id] && (
              <div style={{ borderTop: "1px solid #0c1a28" }}>
                <DbCodeBlock text={current.followUpAnswer} color={lvlColor} cid={`fu-${current.id}`} />
              </div>
            )}
          </div>

          {/* Prev / Next + dot nav */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
            <button disabled={current.id === 1} onClick={() => setActiveQ(q => Math.max(1, q - 1))} style={{
              background: "transparent", border: `1px solid ${current.id === 1 ? "#0c1a28" : "#1e3a52"}`,
              borderRadius: 6, padding: "6px 14px", color: current.id === 1 ? "#0c1a28" : "#2a5a7a",
              fontFamily: "monospace", fontSize: 11, cursor: current.id === 1 ? "default" : "pointer", transition: "all 0.15s",
            }}>← prev</button>

            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {DB_QUESTIONS.map(q => (
                <div key={q.id} onClick={() => setActiveQ(q.id)} style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: activeQ === q.id ? DB_TAG_COLORS[q.db] : "#0c1a28",
                  cursor: "pointer", transition: "all 0.15s",
                }} />
              ))}
            </div>

            <button disabled={current.id === DB_QUESTIONS.length} onClick={() => setActiveQ(q => Math.min(DB_QUESTIONS.length, q + 1))} style={{
              background: "transparent", border: `1px solid ${current.id === DB_QUESTIONS.length ? "#0c1a28" : "#1e3a52"}`,
              borderRadius: 6, padding: "6px 14px", color: current.id === DB_QUESTIONS.length ? "#0c1a28" : "#2a5a7a",
              fontFamily: "monospace", fontSize: 11, cursor: current.id === DB_QUESTIONS.length ? "default" : "pointer", transition: "all 0.15s",
            }}>next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const CONTENT = {
  meta: <MetaContent />,
  decorators: <DecoratorsContent />,
  introspection: <IntrospectionContent />,
  iterators: <IteratorsContent />,
  generators: <GeneratorsContent />,
  context: <ContextContent />,
  magic: <MagicContent />,
  args: <ArgsContent />,
  async: <AsyncContent />,
  interview: <InterviewContent />,
  slots: <SlotsContent />,
  oop: <OopContent />,
  pillars: <PillarsContent />,
  fastapi: <FastAPIContent />,
  "db-interview": <DBInterviewContent />,
};

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function PythonPage() {
  const [active, setActive] = useState("meta");
  const current = TOPICS.find(t => t.id === active);

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "'JetBrains Mono','Fira Code',monospace", minHeight: "100%" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.borderHigh}; border-radius: 2px; }
        .py-nav-item { cursor: pointer; transition: all 0.15s; border-left: 2px solid transparent; }
        .py-nav-item:hover { background: rgba(255,255,255,0.04); }
        .py-nav-item.active { border-left-color: var(--item-color); background: rgba(255,255,255,0.06); }
      `}</style>

      {/* Back */}
      <div style={{ padding: "10px 24px", borderBottom: `1px solid ${C.border}` }}>
        <a href="/learning" style={{ fontSize: 12, color: C.dim, textDecoration: "none" }}>← Learning</a>
      </div>

      <div style={{ display: "flex", height: "calc(100vh - 41px)" }}>
        {/* Sidebar */}
        <div style={{ width: 240, borderRight: `1px solid ${C.border}`, overflowY: "auto", flexShrink: 0, background: C.surface }}>
          <div style={{ padding: "16px 16px 8px" }}>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", color: C.dim, textTransform: "uppercase", marginBottom: 4 }}>Python</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "'Space Grotesk', sans-serif" }}>
              Deep Dive
            </div>
          </div>
          <div style={{ padding: "8px 0" }}>
            {TOPICS.map(t => (
              <div
                key={t.id}
                className={`py-nav-item${active === t.id ? " active" : ""}`}
                style={{ "--item-color": t.tagColor, padding: "10px 16px" }}
                onClick={() => setActive(t.id)}
              >
                <div style={{ fontSize: 12, color: active === t.id ? C.text : C.muted, marginBottom: 3 }}>{t.label}</div>
                <Tag label={t.tag} color={t.tagColor} />
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
          <div style={{ maxWidth: 800 }}>
            {/* Topic header */}
            <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <Tag label={current.tag} color={current.tagColor} />
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", fontFamily: "'Space Grotesk', sans-serif", marginTop: 8 }}>
                {current.label}
              </h1>
            </div>
            {CONTENT[active]}
          </div>
        </div>
      </div>
    </div>
  );
}
