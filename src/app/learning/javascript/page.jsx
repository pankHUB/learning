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

// ─── Topics ────────────────────────────────────────────────────────────────────

const TOPICS = [
  { id: "call-apply-bind", label: "Call, Apply, Bind", tag: "Core", tagColor: C.yellow },
  { id: "debouncing", label: "Debouncing", tag: "Perf", tagColor: C.orange },
  { id: "throttling", label: "Throttling", tag: "Perf", tagColor: C.orange },
  { id: "deep-clone", label: "Deep Clone", tag: "Core", tagColor: C.blue },
  { id: "closures", label: "Closures", tag: "Core", tagColor: C.purple },
  { id: "event-loop", label: "Event Loop & Async", tag: "Core", tagColor: C.cyan },
  { id: "promises", label: "Promises", tag: "Async", tagColor: C.green },
  { id: "examples", label: "Coding Examples", tag: "Interview", tagColor: C.red },
  { id: "async-await", label: "Async/Await & Errors", tag: "Async", tagColor: C.cyan },
  { id: "optional-chaining", label: "Optional Chaining & ??", tag: "ES2020", tagColor: C.green },
  { id: "destructuring", label: "Destructuring", tag: "ES6", tagColor: C.blue },
  { id: "map-vs-object", label: "Map vs Object", tag: "Core", tagColor: C.purple },
  { id: "memoization", label: "Memoization & Cache", tag: "Pattern", tagColor: C.orange },
  { id: "event-emitter", label: "Custom Event Emitter", tag: "Pattern", tagColor: C.yellow },
];

// ─── Content ───────────────────────────────────────────────────────────────────

function CallApplyBindContent() {
  return (
    <div>
      <P>Three Function methods used to explicitly set the value of <code style={{color:C.yellow}}>this</code> inside a function and optionally pass arguments.</P>
      <Callout color={C.yellow}>In JavaScript, <code>this</code> refers to the object that owns the current execution context. When you extract a method, <code>this</code> can get lost — that's where call/apply/bind come in.</Callout>

      <Section title="call() — Invoke Immediately with Explicit Context" defaultOpen>
        <P>Pass arguments one by one. Executes immediately.</P>
        <Code code={`const user1 = { name: 'Alice' };
const user2 = { name: 'Bob' };

function greet(greeting, punctuation) {
  console.log(\`\${greeting}, \${this.name}\${punctuation}\`);
}

greet.call(user1, 'Hello', '!');  // Hello, Alice!
greet.call(user2, 'Hi', '...');   // Hi, Bob...`} />
      </Section>

      <Section title="apply() — Like call(), but Arguments as Array">
        <P>Same as call() but arguments must be passed as an array (or array-like).</P>
        <Code code={`const numbers = [5, 1, 9, 3];

const max = Math.max.apply(null, numbers);
console.log(max); // 9`} />
      </Section>

      <Section title="bind() — Returns a New Bound Function (Doesn't Execute)">
        <P>Often used in event handlers, callbacks, or React components where you need to preserve context.</P>
        <Code code={`const user = {
  name: 'Charlie',
  greet() {
    console.log(\`Hey, I'm \${this.name}\`);
  }
};

const detached = user.greet;    // lose context
detached();                     // ❌ undefined (in strict mode)

const boundGreet = user.greet.bind(user);
boundGreet();                   // ✅ Hey, I'm Charlie`} />
      </Section>
    </div>
  );
}

function DebouncingContent() {
  return (
    <div>
      <P>Debouncing is a technique to limit how often a function executes when called repeatedly in quick succession. It waits until the burst of calls stops before firing.</P>
      <Callout color={C.orange}>Analogy: "Run this only after X ms of inactivity."</Callout>

      <Section title="Core Implementation" defaultOpen>
        <Code code={`function debounce(fxn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fxn.apply(this, args);
    }, delay);
  };
}

function handleSearch(e) {
  console.log('Searching:', e.target.value);
}

const debounceSearch = debounce(handleSearch, 2000);
input.addEventListener('input', debounceSearch);`} />
      </Section>

      <Section title="React — useCallback to prevent recreation on each render">
        <Code code={`import { useState, useCallback } from 'react';

const debounce = (fxn, d) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fxn.apply(this, args);
    }, d);
  };
};

export default function App() {
  const apiCall = (e) => {
    console.log('Calling API for:', e.target.value);
  };

  // useCallback prevents recreation on each render
  const debouncedApiCall = useCallback(debounce(apiCall, 2000), []);

  return (
    <input onChange={(e) => {
      console.log(e.target.value);
      debouncedApiCall(e);
    }} />
  );
}`} />
      </Section>
    </div>
  );
}

function ThrottlingContent() {
  return (
    <div>
      <P>Throttling ensures that even if an event fires continuously, your function runs at most once in a specified time interval.</P>
      <Callout color={C.orange}>Analogy: "Run this at most once every X ms."</Callout>

      <Section title="Core Implementation" defaultOpen>
        <Code code={`const throttle = (fn, delay) => {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn(...args);
    }
  };
};`} />
      </Section>

      <Section title="React — Scroll event with cleanup">
        <Code code={`import { useEffect, useCallback } from 'react';

export default function App() {
  const scroll = () => console.log('....scrolling');
  const throttledScroll = useCallback(throttle(scroll, 1000), []);

  useEffect(() => {
    window.addEventListener('scroll', throttledScroll);
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [throttledScroll]);

  return <div style={{ height: '200vh' }}>Scroll me</div>;
}`} />
      </Section>

      <Section title="Throttle vs Debounce Comparison">
        <Table
          headers={["Feature", "Throttling", "Debouncing"]}
          rows={[
            ["Execution", "At regular intervals", "After events stop firing"],
            ["Use case", "Scroll / resize events", "Search input (wait for pause)"],
            ["Analogy", "At most once every X ms", "Only after X ms of inactivity"],
          ]}
        />
      </Section>
    </div>
  );
}

function DeepCloneContent() {
  return (
    <div>
      <P>Cloning creates a copy of an object or array. Shallow clone only copies top-level; nested objects remain referenced. Deep clone creates a fully independent copy.</P>

      <Section title="Clone Methods Comparison" defaultOpen>
        <Table
          headers={["Method", "Deep?", "Handles Functions?", "Notes"]}
          rows={[
            ["Spread {...obj}", "❌ No", "✅", "Shallow only"],
            ["Object.assign()", "❌ No", "✅", "Shallow only"],
            ["JSON.parse(JSON.stringify())", "✅ Yes", "❌", "Breaks on circular refs"],
            ["structuredClone()", "✅ Yes", "❌", "Modern, fast, safe"],
            ["_.cloneDeep()", "✅ Yes", "✅", "Library-based, flexible"],
          ]}
        />
      </Section>

      <Section title="Comprehensive deepClone Implementation">
        <P>Handles all types: Date, RegExp, Map, Set, Array, circular refs, Symbol keys.</P>
        <Code code={`function deepClone(value, weakMap = new WeakMap()) {
  // Primitives and functions
  if (value === null || typeof value !== "object") return value;
  if (typeof value === "function") return value;

  // Circular references
  if (weakMap.has(value)) return weakMap.get(value);

  // DOM Nodes
  if (typeof Node !== "undefined" && value instanceof Node)
    return value.cloneNode(true);

  // Date
  if (value instanceof Date) return new Date(value);

  // RegExp
  if (value instanceof RegExp) {
    const re = new RegExp(value.source, value.flags);
    re.lastIndex = value.lastIndex;
    return re;
  }

  // Map
  if (value instanceof Map) {
    const result = new Map();
    weakMap.set(value, result);
    for (const [key, val] of value.entries())
      result.set(deepClone(key, weakMap), deepClone(val, weakMap));
    return result;
  }

  // Set
  if (value instanceof Set) {
    const result = new Set();
    weakMap.set(value, result);
    for (const val of value.values())
      result.add(deepClone(val, weakMap));
    return result;
  }

  // Array
  if (Array.isArray(value)) {
    const result = [];
    weakMap.set(value, result);
    for (const item of value) result.push(deepClone(item, weakMap));
    return result;
  }

  // Object (including symbol keys)
  const allKeys = [
    ...Object.keys(value),
    ...Object.getOwnPropertySymbols(value),
  ];
  const result = Object.create(Object.getPrototypeOf(value));
  weakMap.set(value, result);
  for (const key of allKeys) result[key] = deepClone(value[key], weakMap);
  return result;
}`} />
      </Section>
    </div>
  );
}

function ClosuresContent() {
  return (
    <div>
      <P>A closure is created when a function "remembers" the variables from its outer scope, even after that outer function has finished executing.</P>
      <Callout color={C.purple}>The inner function has access to: its own local variables → the outer function's variables → global variables. This relationship is maintained even after the outer function completes.</Callout>

      <Section title="Basic Closure" defaultOpen>
        <Code code={`function outer() {
  let count = 0;
  return () => {
    count++;
    console.log(count);
  };
}

const inner = outer();
inner(); // 1
inner(); // 2`} />
        <P>Memory diagram:</P>
        <Code code={`Heap Memory
 ├── Function Object: inner
 │     ├── Code: function inner() { ... }
 │     └── [[Environment]] → (Outer Lexical Environment)
 └── Lexical Environment: outer()
       ├── count: 0
       └── OuterRef → GlobalEnv`} color={C.muted} />
      </Section>

      <Section title="Encapsulation via Closure">
        <P>Private state — <code style={{color:C.yellow}}>value</code> is inaccessible from outside.</P>
        <Code code={`function createCounter() {
  let value = 0;
  return {
    increment() { value++; },
    decrement() { value--; },
    getValue() { return value; }
  };
}

const counter = createCounter();
counter.increment();
counter.increment();
console.log(counter.getValue()); // 2
console.log(counter.value);      // undefined ✅ private`} />
      </Section>

      <Section title="Function Factories">
        <Code code={`function makeMultiplier(x) {
  return function(y) { return x * y; };
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15`} />
      </Section>
    </div>
  );
}

function EventLoopContent() {
  return (
    <div>
      <P>JavaScript is single-threaded and runs on a single call stack. However, it handles async operations (network requests, timers, I/O) without blocking using the Event Loop.</P>

      <Section title="Components of the Event Loop System" defaultOpen>
        <Table
          headers={["Component", "Description"]}
          rows={[
            ["Call Stack", "Executes code line-by-line"],
            ["Heap", "Memory storage for objects"],
            ["Web/Node APIs", "Provide async functions (fetch, timers, fs.readFile)"],
            ["Callback Queues", "Store ready-to-run async callbacks (macrotasks)"],
            ["Microtask Queue", "Stores Promise callbacks, MutationObservers"],
            ["Event Loop", "Coordinator: moves tasks from queues to call stack"],
          ]}
        />
      </Section>

      <Section title="Execution Flow">
        <Callout color={C.cyan}>1. Execute sync code on call stack → 2. Send async tasks to Web APIs → 3. Callbacks queued when done → 4. If stack empty: run ALL microtasks first, then one macrotask</Callout>
        <Code code={`console.log("1");

setTimeout(() => {
  console.log("2");
  Promise.resolve().then(() => console.log("3"));
  setTimeout(() => console.log("4"), 0);
}, 0);

Promise.resolve().then(() => {
  console.log("5");
  setTimeout(() => console.log("6"), 0);
  Promise.resolve().then(() => console.log("7"));
});

console.log("8");

// Output: 1, 8, 5, 7, 2, 3, 6, 4`} />
      </Section>

      <Section title="Step-by-Step Walkthrough">
        <P>1. Prints <code style={{color:C.green}}>1</code> and <code style={{color:C.green}}>8</code> immediately (synchronous).</P>
        <P>2. Promise.then(5) queued in <strong>Microtask Queue</strong>. setTimeout for '2' queued in <strong>Macrotask Queue</strong>.</P>
        <P>3. Event Loop runs microtasks → prints <code style={{color:C.green}}>5</code>, queues 6 (macro), queues 7 (micro).</P>
        <P>4. Runs microtask 7 → prints <code style={{color:C.green}}>7</code>.</P>
        <P>5. Next macrotask (timeout 2) → prints <code style={{color:C.green}}>2</code>, queues micro 3 and macro 4.</P>
        <P>6. Microtask 3 → prints <code style={{color:C.green}}>3</code>.</P>
        <P>7. Remaining macrotasks → prints <code style={{color:C.green}}>6</code>, <code style={{color:C.green}}>4</code>.</P>
        <Callout color={C.green}>Key Rule: Microtasks (Promises) ALWAYS execute before the next macrotask (setTimeout/setInterval).</Callout>
      </Section>
    </div>
  );
}

function PromisesContent() {
  return (
    <div>
      <P>A Promise represents the eventual completion or failure of an asynchronous operation. Before Promises, we used callbacks — which led to callback hell.</P>

      <Section title="Basic Promise" defaultOpen>
        <Code code={`const promise = new Promise((resolve, reject) => {
  const success = true;
  if (success) resolve("Task completed");
  else reject("Task failed");
});

promise
  .then(value => console.log(value))
  .catch(error => console.error(error))
  .finally(() => console.log("Done!"));`} />
      </Section>

      <Section title="Promise Combinators">
        <Table
          headers={["Method", "Description"]}
          rows={[
            ["Promise.all([p1,p2,p3])", "Wait for all → reject if any fail"],
            ["Promise.race([p1,p2,p3])", "Returns the first to settle"],
            ["Promise.allSettled()", "Wait for all → array of {status, value/reason}"],
            ["Promise.any()", "First fulfilled, ignores rejections"],
          ]}
        />
        <Code code={`Promise.all([fetch("/user"), fetch("/posts")])
  .then(([user, posts]) => console.log("Loaded all"))
  .catch(console.error);`} />
      </Section>

      <Section title="Async/Await — Syntactic Sugar over Promises">
        <Code code={`function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Promise chaining
delay(1000)
  .then(() => console.log("1s passed"))
  .then(() => delay(1000))
  .then(() => console.log("2s passed"));

// Equivalent with async/await
async function run() {
  await delay(1000);
  console.log("1s passed");
  await delay(1000);
  console.log("2s passed");
}
run();`} />
      </Section>

      <Section title="Build Your Own Promise (MyPromise)">
        <P>Understand how Promises work internally:</P>
        <Code code={`class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state === "pending") {
        this.state = "fulfilled";
        this.value = value;
        this.onFulfilledCallbacks.forEach(fn => fn());
      }
    };

    const reject = (reason) => {
      if (this.state === "pending") {
        this.state = "rejected";
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };

    try { executor(resolve, reject); } catch (err) { reject(err); }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : v => v;
    onRejected  = typeof onRejected  === "function" ? onRejected  : r => { throw r; };

    return new MyPromise((resolve, reject) => {
      const handleFulfilled = () => {
        queueMicrotask(() => {
          try {
            const result = onFulfilled(this.value);
            result instanceof MyPromise ? result.then(resolve, reject) : resolve(result);
          } catch (err) { reject(err); }
        });
      };
      const handleRejected = () => {
        queueMicrotask(() => {
          try {
            const result = onRejected(this.reason);
            result instanceof MyPromise ? result.then(resolve, reject) : resolve(result);
          } catch (err) { reject(err); }
        });
      };

      if (this.state === "fulfilled") handleFulfilled();
      else if (this.state === "rejected") handleRejected();
      else {
        this.onFulfilledCallbacks.push(handleFulfilled);
        this.onRejectedCallbacks.push(handleRejected);
      }
    });
  }

  catch(onRejected) { return this.then(null, onRejected); }

  finally(callback) {
    return this.then(
      value  => { callback(); return value; },
      reason => { callback(); throw reason; }
    );
  }

  static resolve(value) { return new MyPromise(res => res(value)); }
  static reject(reason) { return new MyPromise((_, rej) => rej(reason)); }
}`} />
      </Section>
    </div>
  );
}

function ExamplesContent() {
  return (
    <div>
      <Callout color={C.red}>Classic JavaScript interview coding patterns — array manipulation, object transformation, and algorithm design.</Callout>

      <Section title="Ex 1 — Array Flattening (without flat())" defaultOpen>
        <H>Recursive</H>
        <Code code={`function flatteningArray(arr, result = []) {
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      flatteningArray(arr[i], result);
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}

// Using reduce
const flatten = arr =>
  arr.reduce((acc, i) => acc.concat(Array.isArray(i) ? flatten(i) : i), []);

console.log(flatten([2, 3, [3, 4, [5], 6], '7']));
// [2, 3, 3, 4, 5, 6, '7']`} />
        <H>Iterative (using stack)</H>
        <Code code={`function flattenIterative(arr) {
  const stack = [...arr];
  const res = [];
  while (stack.length) {
    const item = stack.pop();
    if (Array.isArray(item)) {
      stack.push(...item);
    } else {
      res.push(item);
    }
  }
  return res.reverse();
}`} />
        <H>Array.flat() Polyfill</H>
        <Code code={`if (!Array.prototype.myFlat) {
  Array.prototype.myFlat = function (depth = 1) {
    const result = [];
    function flatten(arr, currentDepth) {
      for (let i = 0; i < arr.length; i++) {
        if (!(i in arr)) continue; // skip holes
        const item = arr[i];
        if (Array.isArray(item) && currentDepth < depth) {
          flatten(item, currentDepth + 1);
        } else {
          result.push(item);
        }
      }
    }
    flatten(this, 0);
    return result;
  };
}`} />
      </Section>

      <Section title="Ex 2 — Object Grouping">
        <Code code={`function groupBy(array, key) {
  return array.reduce((res, item) => {
    const k = item[key];
    res[k] = res[k] ? res[k] : [];
    res[k].push(item);
    return res;
  }, {});
}

const cartItems = [
  { id: 1, name: 'iPhone 14', category: 'Electronics', price: 999, qty: 1 },
  { id: 2, name: 'AirPods',   category: 'Electronics', price: 199, qty: 2 },
  { id: 3, name: 'T-Shirt',   category: 'Clothing',    price: 29,  qty: 3 },
];

const cartByCategory = groupBy(cartItems, 'category');
Object.keys(cartByCategory).forEach(c => {
  const items = cartByCategory[c];
  const subtotal = items.reduce((s, i) => s + (i.price * i.qty), 0);
  console.log(\`\${c}: $\${subtotal} (\${items.length} items)\`);
});`} />
        <H>Using Map</H>
        <Code code={`function groupByMap(array, property) {
  const map = new Map();
  array.forEach(obj => {
    const key = obj[property];
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(obj);
  });
  return map;
}`} />
      </Section>

      <Section title="Ex 3 — Remove Duplicates from Array">
        <Code code={`// Using Map — preserves last occurrence
function removeDuplicates(arr, key) {
  const map = new Map();
  for (const item of arr) map.set(item[key], item);
  return [...map.values()];
}

// One-liner
const uniqueBy = (arr, key) => [
  ...new Map(arr.map(item => [item[key], item])).values()
];

const users = [
  { id: 1, name: "Alice" }, { id: 2, name: "Bob" },
  { id: 1, name: "Alice" }, { id: 3, name: "Charlie" },
];
console.log(uniqueBy(users, "id"));
// [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }, { id: 3, name: 'Charlie' }]`} />
      </Section>

      <Section title="Ex 4 — Array Chunking / Pagination">
        <P>Split a large array into multiple smaller arrays of fixed size.</P>
        <Code code={`const chunkArray = (arr, size) => {
  const res = [];
  let chunk = [];
  for (const item of arr) {
    chunk.push(item);
    if (chunk.length === size) {
      res.push(chunk);
      chunk = [];
    }
  }
  if (chunk.length) res.push(chunk);
  return res;
};

console.log(chunkArray([1,2,3,4,5], 2));
// [[1,2],[3,4],[5]]`} />
      </Section>

      <Section title="Ex 5 — Deep Merge Objects">
        <P>Handles nested objects, arrays (concat), Dates, RegExp, Map, Set, and circular references.</P>
        <Code code={`const deepMerge = (obj1, obj2, map = new WeakMap()) => {
  if (obj1 == obj2) return obj1;
  map.set(obj1, obj2);

  const result = Array.isArray(obj1) ? [...obj1] : { ...obj1 };

  for (const key in obj2) {
    const v1 = result[key], v2 = obj2[key];

    if (Array.isArray(v1) && Array.isArray(v2)) {
      result[key] = [...v1, ...v2];
    } else if (v2 instanceof Date) {
      result[key] = new Date(v2);
    } else if (v2 instanceof RegExp) {
      result[key] = new RegExp(v2);
    } else if (v2 instanceof Map) {
      result[key] = new Map([...(v1 || []), ...v2]);
    } else if (v2 instanceof Set) {
      result[key] = new Set([...(v1 || []), ...v2]);
    } else if (
      v1 && v2 && typeof v1 === "object" && typeof v2 === "object"
    ) {
      result[key] = deepMerge(v1, v2, map);
    } else {
      result[key] = v2;
    }
  }
  return result;
};

const merged = deepMerge(
  { user: { name: "John", hobbies: ["cricket"] } },
  { user: { hobbies: ["coding"], age: 30 } }
);
// { user: { name: 'John', hobbies: ['cricket','coding'], age: 30 } }`} />
      </Section>
    </div>
  );
}

function AsyncAwaitContent() {
  return (
    <div>
      <P>async/await converts asynchronous code into synchronous-looking code. Unhandled promise rejections can crash your application.</P>

      <Section title="try/catch — Standard Error Handling" defaultOpen>
        <Code code={`try {
  const data = await fetch("/api");
  const json = await data.json();
} catch (e) {
  console.log("Handled:", e.message);
}`} />
      </Section>

      <Section title="Without try/catch — Using .catch()">
        <Code code={`async function fetchUser() {
  return fetch("/user").then(res => res.json());
}

fetchUser()
  .then(data => console.log(data))
  .catch(err => console.log("Error:", err.message));`} />
      </Section>

      <Section title="Retry Mechanism">
        <P>APIs fail temporarily due to network issues, rate limiting, or slow servers.</P>
        <Code code={`async function retry(fn, retries = 3) {
  try {
    return await fn();
  } catch (e) {
    if (retries === 0) throw e;
    return retry(fn, retries - 1);
  }
}`} />
      </Section>

      <Section title="Timeout — Prevent Waiting Forever">
        <Code code={`async function timeout(fxn, ms) {
  let timer = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timed out')), ms)
  );
  return Promise.race([fxn(), timer]);
}

async function callSlowApi() {
  const res = await fetch("https://httpbin.org/delay/5");
  return await res.json();
}

try {
  const result = await timeout(callSlowApi, 3000);
  console.log(result);
} catch (e) {
  console.log(e.message); // "Timed out"
}`} />
      </Section>

      <Section title="Cancelling Fetch — AbortController">
        <P>Used when: mobile app page changes, React component unmounts, stopping wasted bandwidth.</P>
        <Code code={`useEffect(() => {
  const controller = new AbortController();

  fetch("/api/users", { signal: controller.signal })
    .then(res => res.json())
    .then(data => setUsers(data))
    .catch(e => {
      if (e.name !== "AbortError") console.error(e);
    });

  return () => controller.abort(); // cleanup on unmount
}, []);`} />
      </Section>
    </div>
  );
}

function OptionalChainingContent() {
  return (
    <div>
      <P>Two ES2020 operators that eliminate common runtime errors and provide safer defaults.</P>

      <Section title="Optional Chaining (?.) — Safe property access" defaultOpen>
        <P>Fixes: <code style={{color:C.red}}>"Cannot read property 'x' of undefined"</code></P>
        <Code code={`// Before
if (user && user.profile && user.profile.address) {
  console.log(user.profile.address.city);
}

// After
console.log(user?.profile?.address?.city);

// Works with methods and brackets too
const city = user?.getAddress?.()?.city;
const first = arr?.[0]?.name;`} />
      </Section>

      <Section title="Nullish Coalescing (??) — Default only for null/undefined">
        <Callout color={C.green}>Unlike <code>||</code>, the <code>??</code> operator does NOT trigger for <code>0</code>, <code>''</code>, or <code>false</code>.</Callout>
        <Code code={`// Problem: || treats 0 as falsy
const limit = settings.maxItems || 10; // ❌ breaks if maxItems = 0

// Fix: ?? only falls back on null/undefined
const limit = settings.maxItems ?? 10; // ✅ correct

const name = user?.name ?? "Anonymous";
const port = config?.port ?? 3000;`} />
      </Section>
    </div>
  );
}

function DestructuringContent() {
  return (
    <div>
      <P>Destructuring lets you unpack values from arrays or objects into distinct variables. Supports default values, renaming, nesting, and rest patterns.</P>

      <Section title="Nested Object Destructuring with Defaults" defaultOpen>
        <Code code={`const config = {
  server: { host: "localhost", port: 3000 }
};

const {
  server: {
    host: hostname = "127.0.0.1",
    port: serverPort = 8080,
    ssl: { enabled: sslEnabled = false } = {}
  }
} = config;

console.log(hostname, serverPort, sslEnabled);
// localhost  3000  false`} />
      </Section>

      <Section title="Object Rest — Exclude specific keys">
        <Code code={`const user = { id: 1, name: "John", age: 28, country: "IN" };

const { name, ...rest } = user;

console.log(name);  // "John"
console.log(rest);  // { id: 1, age: 28, country: "IN" }`} />
      </Section>

      <Section title="Array + Object Mixed Patterns">
        <Code code={`// Swap variables
let a = 1, b = 2;
[a, b] = [b, a];

// From function return
function getCoords() { return { x: 10, y: 20, z: 30 }; }
const { x, y } = getCoords();

// Array with skip
const [first, , third] = [1, 2, 3];
console.log(first, third); // 1 3

// Function parameter destructuring
function render({ title, body, footer = "Default" }) {
  return \`\${title}: \${body} [\${footer}]\`;
}`} />
      </Section>
    </div>
  );
}

function MapVsObjectContent() {
  return (
    <div>
      <Section title="Feature Comparison" defaultOpen>
        <Table
          headers={["Feature", "Map", "Object"]}
          rows={[
            ["Key types", "Any type (string, number, object, function)", "Strings / Symbols only"],
            ["Insertion order", "Preserved", "Not guaranteed (mostly kept in modern JS)"],
            ["Iteration", "map.forEach, map.entries() built-in", "Needs Object.keys / for...in"],
            ["Size", "map.size", "Object.keys(obj).length"],
            ["Performance", "Faster for frequent inserts/deletes", "Faster for fixed structure"],
            ["Use case", "Dynamic key-value store", "Data models, JSON, API structures"],
          ]}
        />
        <Callout color={C.purple}>Use <strong>Map</strong> when keys are dynamic, non-strings, or performance matters for frequent insert/delete. Use <strong>Object</strong> when you need structured data or JSON-compatible models.</Callout>
      </Section>

      <Section title="Code Examples">
        <Code code={`// Object — fixed schema, JSON-friendly
const user = { id: 1, name: "Alice", role: "admin" };
console.log(user.name); // Alice

// Map — any key type, ordered
const map = new Map();
map.set("string-key", 1);
map.set(42, "number key");
map.set({ id: 1 }, "object key");

console.log(map.size); // 3

// Iteration
for (const [key, value] of map) {
  console.log(key, "→", value);
}

// Object with non-string key (gets stringified!)
const obj = {};
const key = { id: 1 };
obj[key] = "value";
console.log(Object.keys(obj)); // ["[object Object]"] ❌`} />
      </Section>
    </div>
  );
}

function MemoizationContent() {
  return (
    <div>
      <P>Memoization caches the results of expensive function calls. When the same inputs occur again, return the cached result instead of re-computing.</P>

      <Section title="Basic Memoize" defaultOpen>
        <Code code={`function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log('from cache');
      return cache.get(key);
    }
    const res = fn(...args);
    cache.set(key, res);
    return res;
  };
}

const memoDouble = memoize(n => n * 2);
console.log(memoDouble(5)); // 10 (computed)
console.log(memoDouble(5)); // 10 (from cache)`} />
      </Section>

      <Section title="Memoize with TTL (Time-To-Live)">
        <Code code={`function memoize(fn, ttl) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    const cached = cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < ttl) {
      console.log('from cache');
      return cached.value;
    }
    const res = fn(...args);
    cache.set(key, { value: res, timestamp: Date.now() });
    return res;
  };
}

const memoDouble = memoize(n => n * 2, 2000);
console.log(memoDouble(2)); // computed
console.log(memoDouble(2)); // from cache
setTimeout(() => console.log(memoDouble(2)), 3000); // recomputed (TTL expired)`} />
      </Section>

      <Section title="LRU Cache (Least Recently Used)">
        <P>Keeps only the N most recently used items. When full, evicts the least recently used entry.</P>
        <Code code={`class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // Map preserves insertion order
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    // Re-insert to mark as recently used
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      // First entry = least recently used
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
}

const lru = new LRUCache(3);
lru.set("a", 1); lru.set("b", 2); lru.set("c", 3);
lru.get("a");    // mark "a" as recently used
lru.set("d", 4); // evicts "b" (least recently used)
console.log(lru.get("b")); // -1 (evicted)`} />
      </Section>
    </div>
  );
}

function EventEmitterContent() {
  return (
    <div>
      <P>A simple pub/sub system. Publishers emit events; subscribers listen and react. This is the pattern Node.js's EventEmitter uses internally.</P>

      <Section title="Simple EventEmitter" defaultOpen>
        <Code code={`class EventEmitter {
  constructor() {
    this.events = {}; // eventName → listeners[]
  }

  on(eventName, listener) {
    if (!this.events[eventName]) this.events[eventName] = [];
    this.events[eventName].push(listener);
  }

  emit(eventName, data) {
    const listeners = this.events[eventName];
    if (listeners) listeners.forEach(fn => fn(data));
  }

  off(eventName, listener) {
    const listeners = this.events[eventName];
    if (!listeners) return;
    this.events[eventName] = listeners.filter(fn => fn !== listener);
  }
}

const emitter = new EventEmitter();
function sayHello(name) { console.log("Hello", name); }

emitter.on("greet", sayHello);
emitter.emit("greet", "Pankul"); // Hello Pankul
emitter.off("greet", sayHello);
emitter.emit("greet", "Pankul"); // No output (removed)`} />
      </Section>

      <Section title="Full Node.js-Compatible EventEmitter Polyfill">
        <P>Includes: on, off, emit, once, removeAllListeners, chainable API.</P>
        <Code code={`class EventEmitter {
  constructor() { this._events = Object.create(null); }

  on(eventName, listener) {
    if (typeof listener !== "function")
      throw new TypeError("Listener must be a function");
    if (!this._events[eventName]) this._events[eventName] = [];
    this._events[eventName].push(listener);
    return this; // chainable
  }

  addListener(eventName, listener) { return this.on(eventName, listener); }

  off(eventName, listener) {
    const listeners = this._events[eventName];
    if (!listeners) return this;
    this._events[eventName] = listeners.filter(fn => fn !== listener);
    return this;
  }

  removeListener(eventName, listener) { return this.off(eventName, listener); }

  removeAllListeners(eventName) {
    if (eventName) delete this._events[eventName];
    else this._events = Object.create(null);
    return this;
  }

  emit(eventName, ...args) {
    const listeners = this._events[eventName];
    if (!listeners) return false;
    [...listeners].forEach(fn => fn.apply(this, args));
    return true;
  }

  once(eventName, listener) {
    const wrapper = (...args) => {
      this.off(eventName, wrapper);
      listener.apply(this, args);
    };
    wrapper.originalListener = listener;
    this.on(eventName, wrapper);
    return this;
  }
}

// Usage
const ee = new EventEmitter();
ee.once("connect", () => console.log("Connected!"));
ee.emit("connect"); // Connected!
ee.emit("connect"); // (no output — once)`} />
      </Section>
    </div>
  );
}

// ─── Content Map ───────────────────────────────────────────────────────────────

const CONTENT = {
  "call-apply-bind": <CallApplyBindContent />,
  "debouncing": <DebouncingContent />,
  "throttling": <ThrottlingContent />,
  "deep-clone": <DeepCloneContent />,
  "closures": <ClosuresContent />,
  "event-loop": <EventLoopContent />,
  "promises": <PromisesContent />,
  "examples": <ExamplesContent />,
  "async-await": <AsyncAwaitContent />,
  "optional-chaining": <OptionalChainingContent />,
  "destructuring": <DestructuringContent />,
  "map-vs-object": <MapVsObjectContent />,
  "memoization": <MemoizationContent />,
  "event-emitter": <EventEmitterContent />,
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function JavaScriptPage() {
  const [active, setActive] = useState("call-apply-bind");
  const current = TOPICS.find(t => t.id === active);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Inter','Segoe UI',sans-serif", color: C.text }}>
      {/* Back button */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "10px 24px", display: "flex", alignItems: "center", gap: 10 }}>
        <a href="/learning" style={{ color: C.muted, textDecoration: "none", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
          ← Learning
        </a>
      </div>

      <div style={{ display: "flex", height: "calc(100vh - 41px)" }}>
        {/* Sidebar */}
        <div style={{
          width: 240, flexShrink: 0, background: C.surface,
          borderRight: `1px solid ${C.border}`, overflowY: "auto", padding: "16px 0",
        }}>
          <div style={{ padding: "0 16px 12px", borderBottom: `1px solid ${C.border}`, marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dim }}>JavaScript</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.yellow, marginTop: 2 }}>Deep Dive</div>
          </div>

          {TOPICS.map(t => (
            <button key={t.id} onClick={() => setActive(t.id)} style={{
              width: "100%", textAlign: "left", background: active === t.id ? `${C.yellow}15` : "transparent",
              border: "none", borderLeft: `3px solid ${active === t.id ? C.yellow : "transparent"}`,
              padding: "9px 16px", cursor: "pointer", transition: "all 0.15s",
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: active === t.id ? C.yellow : C.text }}>{t.label}</div>
              <div style={{ marginTop: 3 }}>
                <Tag label={t.tag} color={t.tagColor} />
              </div>
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
          <div style={{ maxWidth: 820 }}>
            {/* Header */}
            <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: C.text }}>{current?.label}</h1>
                {current && <Tag label={current.tag} color={current.tagColor} />}
              </div>
            </div>

            {CONTENT[active]}
          </div>
        </div>
      </div>
    </div>
  );
}
