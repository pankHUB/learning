import { useState, useCallback, useMemo, useRef, useEffect } from "react";

const TOPICS = [
  {
    id: "vdom",
    label: "Virtual DOM",
    icon: "⬡",
    tag: "Core",
    tagColor: "#00e5ff",
    sections: [
      {
        title: "What is the Virtual DOM?",
        content: `The Virtual DOM (VDOM) is a lightweight JavaScript object tree that mirrors the Real DOM. React keeps this in memory and uses it as a staging area before touching the actual browser DOM.`,
        diagram: `
┌─────────────────────────────────────────────┐
│              React Component                 │
│                setState()                    │
└──────────────────┬──────────────────────────┘
                   │
          ┌────────▼────────┐
          │   New VDOM Tree  │
          └────────┬────────┘
                   │  DIFF (Reconciliation)
          ┌────────▼────────┐
          │   Old VDOM Tree  │
          └────────┬────────┘
                   │  Minimal patches only
          ┌────────▼────────┐
          │    Real DOM      │  ← Only changed nodes updated
          └─────────────────┘`,
        code: `// VDOM representation of <div id="root"><h1>Hello</h1></div>
const vdom = {
  type: "div",
  props: {
    id: "root",
    children: [{
      type: "h1",
      props: { children: "Hello" }
    }]
  }
};

// When state changes → new VDOM → diff → minimal DOM patch
// Only <h1> text changes, not the entire tree`,
      },
      {
        title: "Diffing Algorithm",
        content: `React's diffing is O(n) — it compares trees level by level. Two key heuristics: (1) Elements of different types produce entirely different trees. (2) Keys tell React which items in a list are stable.`,
        code: `// Before update
<h1>Counter: 0</h1>
<button>Increment</button>

// After update
<h1>Counter: 1</h1>  // ← text node changed
<button>Increment</button>  // ← unchanged

// Diffing result:
// ✅ Update text inside <h1>
// ✅ Skip <button> — identical
// Real DOM: 1 targeted mutation, not a full re-render`,
      },
      {
        title: "Reconciliation",
        content: `Reconciliation is the full algorithm — diff old vs new VDOM, determine minimal DOM operations, then apply them. It's React's performance engine. Keys reduce list diffing from O(n³) to O(n).`,
        code: `// Keys help React identify stable list items
// ❌ Avoid: index as key
items.map((item, index) => <Item key={index} />)
// Problem: delete item[0] → all indices shift → React replaces everything

// ✅ Correct: stable unique ID
items.map(item => <Item key={item.id} />)
// React knows exactly which item was removed → 1 DOM deletion`,
      },
    ],
  },
  {
    id: "fiber",
    label: "React Fiber",
    icon: "⟳",
    tag: "Core",
    tagColor: "#00e5ff",
    sections: [
      {
        title: "Why Fiber?",
        content: `Before React 16, rendering was synchronous and blocking. A large re-render would freeze input, animations, and the entire UI. Fiber reimagines reconciliation as a linked list of work units that can be paused, prioritized, and resumed.`,
        diagram: `
Old React (Stack Reconciler)
─────────────────────────────────
[Start render] ──────────────────────────────► [Done]
               ← blocking, cannot pause →

React Fiber
─────────────────────────────────
[Unit 1] → pause → [User input] → resume → [Unit 2] → [Unit 3] → [Done]
          ↑ browser stays responsive ↑`,
        code: `// Fiber enables these React features:
// ✅ useTransition — defer non-urgent renders
// ✅ Suspense — pause rendering while waiting for data
// ✅ Concurrent rendering — interruptible work
// ✅ Time slicing — chunk large renders
// ✅ Streaming SSR — send HTML in chunks`,
      },
      {
        title: "useTransition",
        content: `Mark updates as non-urgent. Urgent updates (typing, clicking) always run immediately. Transitions can be interrupted and restarted. This keeps input responsive even during heavy renders.`,
        code: `const [isPending, startTransition] = useTransition();
const [query, setQuery] = useState('');
const [results, setResults] = useState([]);

const handleChange = (e) => {
  const value = e.target.value;
  setQuery(value);  // ← urgent: updates input immediately

  startTransition(() => {
    // ← non-urgent: React can defer/interrupt this
    setResults(hugeList.filter(i => i.includes(value)));
  });
};

// isPending: true while transition is in-flight
// Use it to show a loading indicator without blocking input`,
      },
      {
        title: "Suspense + Concurrency",
        content: `Suspense lets React pause rendering a subtree and show a fallback while it waits. Combined with Fiber, React can render other parts of the tree that are ready — then resume the suspended part when data arrives.`,
        code: `// React pauses <UserDetails> while data loads
// Renders <Spinner> instead — other siblings still render
<Suspense fallback={<Spinner />}>
  <UserDetails userId={id} />
</Suspense>

// With React 18 lazy + Suspense for code splitting:
const Dashboard = React.lazy(() => import('./Dashboard'));

<Suspense fallback={<PageSkeleton />}>
  <Dashboard />
</Suspense>`,
      },
    ],
  },
  {
    id: "memoization",
    label: "Memoization",
    icon: "◈",
    tag: "Performance",
    tagColor: "#69ff47",
    sections: [
      {
        title: "React.memo — Memoize Components",
        content: `React.memo wraps a component and skips re-rendering if props haven't changed (shallow comparison). Essential when a parent re-renders frequently but a child's props are stable.`,
        code: `// Without React.memo — re-renders every time parent renders
const ChildList = ({ items }) => (
  <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>
);

// With React.memo — only re-renders when items reference changes
const ChildList = React.memo(({ items }) => (
  <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>
));

// Custom comparator for deep control:
const ChildList = React.memo(({ items }) => ..., (prev, next) => {
  return prev.items.length === next.items.length; // custom equality
});`,
      },
      {
        title: "useMemo — Memoize Values",
        content: `Cache expensive computations. Only recomputes when dependencies change. Use for: heavy calculations, derived data, reference-stable objects passed to memoized children.`,
        code: `// ❌ Without useMemo — runs on every render
const filtered = bigList.filter(i => i.active && i.price > threshold);

// ✅ With useMemo — cached until bigList or threshold changes
const filtered = useMemo(
  () => bigList.filter(i => i.active && i.price > threshold),
  [bigList, threshold]
);

// Also use for reference-stable objects:
const config = useMemo(
  () => ({ endpoint: url, timeout: 5000 }),
  [url]
); // Prevents child re-renders caused by new object reference each render`,
      },
      {
        title: "useCallback — Memoize Functions",
        content: `Every render creates a new function reference. When passed as props to memoized children, this defeats React.memo. useCallback returns the same function reference until dependencies change.`,
        code: `// ❌ New function reference every render → breaks React.memo on child
const handleDelete = (id) => removeItem(id);

// ✅ Stable reference — React.memo on child works
const handleDelete = useCallback((id) => {
  removeItem(id);
}, []); // empty deps = created once

// Common pattern: pair React.memo + useCallback
const ItemRow = React.memo(({ item, onDelete }) => (
  <li>{item.name} <button onClick={() => onDelete(item.id)}>✕</button></li>
));

function List({ items }) {
  const handleDelete = useCallback(id => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);
  return items.map(item => <ItemRow key={item.id} item={item} onDelete={handleDelete} />);
}`,
      },
    ],
  },
  {
    id: "hooks",
    label: "Hooks Deep Dive",
    icon: "⚓",
    tag: "Core",
    tagColor: "#00e5ff",
    sections: [
      {
        title: "useState Patterns",
        content: `Lazy initialization (pass a function) runs only once — critical for expensive defaults. Always use functional updates when new state depends on previous state to avoid stale closure bugs.`,
        code: `// Lazy init — function runs once on mount, not every render
const [data, setData] = useState(() => computeExpensiveDefault());

// Functional update — always safe, avoids stale closures
setCount(prev => prev + 1);  // ✅
setCount(count + 1);          // ❌ can be stale in async context

// Updating nested state — must spread immutably
setForm(prev => ({
  ...prev,
  preferences: { ...prev.preferences, theme: 'dark' }
}));`,
      },
      {
        title: "useEffect Patterns & Pitfalls",
        content: `useEffect runs after paint. Always return a cleanup function for subscriptions, timers, and event listeners. Exhaustive deps prevents stale closures but can cause infinite loops if you're not careful.`,
        code: `// Pattern 1: data fetch with cleanup
useEffect(() => {
  let cancelled = false;
  fetchUser(id).then(data => {
    if (!cancelled) setUser(data);
  });
  return () => { cancelled = true; };  // prevents state update on unmount
}, [id]);

// Pattern 2: event listener
useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, [handleResize]); // handleResize must be stable (useCallback)

// Pattern 3: run once on mount
useEffect(() => { init(); }, []);  // [] = mount only`,
      },
      {
        title: "useRef — Beyond DOM Access",
        content: `useRef holds a mutable value that persists across renders without triggering re-renders. Use cases: DOM refs, storing previous values, mutable timers/intervals, instance variables.`,
        code: `// DOM ref
const inputRef = useRef(null);
<input ref={inputRef} />
inputRef.current.focus(); // direct DOM access

// Mutable instance variable (no re-render on change)
const timerRef = useRef(null);
const start = () => { timerRef.current = setInterval(tick, 1000); };
const stop  = () => clearInterval(timerRef.current);

// Track previous value
const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => { ref.current = value; });
  return ref.current; // returns value from last render
};`,
      },
      {
        title: "useReducer — Complex State",
        content: `When useState gets messy with multiple related values or complex transitions, useReducer centralizes logic. Works great with useContext for lightweight global state.`,
        code: `const reducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT': return { ...state, count: state.count + 1 };
    case 'SET_USER':  return { ...state, user: action.payload, loading: false };
    case 'RESET':     return initialState;
    default:          return state;
  }
};

const [state, dispatch] = useReducer(reducer, { count: 0, user: null, loading: false });

dispatch({ type: 'SET_USER', payload: { name: 'Pankul' } });`,
      },
    ],
  },
  {
    id: "custom-hooks",
    label: "Custom Hooks",
    icon: "⚙",
    tag: "4+ YOE",
    tagColor: "#ff6b6b",
    sections: [
      {
        title: "Building Custom Hooks",
        content: `Custom hooks extract stateful logic into reusable functions. The rule: starts with 'use', can call other hooks. Think of them as behavior modules — not UI, not utilities, but stateful patterns.`,
        code: `// useFetch — generic data fetching with loading/error states
const useFetch = (url) => {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(url)
      .then(r => r.json())
      .then(d => { if (!cancelled) { setData(d); setLoading(false); } })
      .catch(e => { if (!cancelled) { setError(e); setLoading(false); } });
    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
};

// Usage
const { data: users, loading } = useFetch('/api/users');`,
      },
      {
        title: "Advanced Hook Patterns",
        content: `Hooks compose. Build complex behavior by stacking simpler hooks. useDebounce, useLocalStorage, useEventListener — each does one thing well and can be combined.`,
        code: `// useDebounce — debounce any value
const useDebounce = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

// Compose hooks: search with debounce + fetch
const SearchPage = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);
  const { data, loading } = useFetch(\`/api/search?q=\${debouncedQuery}\`);
  // ...
};`,
      },
    ],
  },
  {
    id: "patterns",
    label: "Advanced Patterns",
    icon: "◎",
    tag: "4+ YOE",
    tagColor: "#ff6b6b",
    sections: [
      {
        title: "Compound Components",
        content: `Compound components share implicit state via Context. The parent owns state; children are slots. This gives consumers a declarative, flexible API without prop drilling.`,
        code: `const TabsContext = createContext(null);

// Parent owns state
const Tabs = ({ children, defaultTab }) => {
  const [active, setActive] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
};

// Children consume it implicitly
Tabs.Tab = ({ id, children }) => {
  const { active, setActive } = useContext(TabsContext);
  return (
    <button
      className={active === id ? 'active' : ''}
      onClick={() => setActive(id)}
    >{children}</button>
  );
};

// Usage: clean, readable API
<Tabs defaultTab="overview">
  <Tabs.Tab id="overview">Overview</Tabs.Tab>
  <Tabs.Tab id="details">Details</Tabs.Tab>
</Tabs>`,
      },
      {
        title: "Render Props & HOCs (Legacy + Modern)",
        content: `Render props pass a function as a prop to share logic. HOCs wrap components to inject behavior. Both patterns are largely replaced by hooks, but you'll see them in older codebases and interview questions.`,
        code: `// Render prop pattern
const MouseTracker = ({ render }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}>
      {render(pos)}  {/* consumer decides what to render */}
    </div>
  );
};
// Usage
<MouseTracker render={({ x, y }) => <span>{x}, {y}</span>} />

// HOC pattern — withAuth injects auth props
const withAuth = (Component) => (props) => {
  const user = useAuth();
  if (!user) return <Redirect to="/login" />;
  return <Component {...props} user={user} />;
};
const ProtectedDashboard = withAuth(Dashboard);`,
      },
      {
        title: "Error Boundaries",
        content: `Error Boundaries catch runtime errors in the component tree and display a fallback. They must be class components (no hook equivalent yet). Pair with Sentry or similar for production error tracking.`,
        code: `class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };  // triggers fallback render
  }

  componentDidCatch(error, info) {
    logger.capture(error, info.componentStack); // send to Sentry etc.
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <h2>Something went wrong.</h2>;
    }
    return this.props.children;
  }
}

// Wrap risky subtrees
<ErrorBoundary fallback={<ErrorScreen />}>
  <PaymentFlow />
</ErrorBoundary>`,
      },
      {
        title: "Portals",
        content: `ReactDOM.createPortal renders children into a DOM node outside the parent component's tree. Use for modals, tooltips, and dropdowns that need to escape overflow:hidden or z-index stacking contexts.`,
        code: `import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  // Rendered inside #modal-root, not inside the parent component's DOM
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')  // target DOM node
  );
};
// Note: events still bubble up through React tree (not DOM tree)`,
      },
    ],
  },
  {
    id: "rsc",
    label: "Server Components",
    icon: "☁",
    tag: "4+ YOE",
    tagColor: "#ff6b6b",
    sections: [
      {
        title: "React Server Components (RSC)",
        content: `RSC run on the server — they fetch data, access databases, and never ship their JS to the client. Client Components (with 'use client') handle interactivity. The boundary between them is explicit.`,
        diagram: `
Server                          Client
──────────────────────────────────────────────
Page (RSC)                      <button> handlers
  └─ ProductList (RSC)          useState / useEffect
       └─ ProductCard (RSC)     useContext
            └─ AddToCart        ← 'use client' boundary
               (Client Comp)`,
        code: `// Server Component — runs on server, no JS bundle
// app/products/page.tsx (Next.js App Router)
export default async function ProductsPage() {
  // Direct DB query — no API layer needed, no credentials exposed
  const products = await db.products.findMany({ where: { active: true } });
  return <ProductList products={products} />;
}

// Client Component — interactive, ships JS
'use client';
const AddToCart = ({ productId }) => {
  const [loading, setLoading] = useState(false);
  return (
    <button onClick={() => addToCart(productId)} disabled={loading}>
      Add to Cart
    </button>
  );
};`,
      },
      {
        title: "RSC vs SSR vs CSR",
        content: `These are not the same. SSR renders components on server per request and sends HTML. RSC runs components on server but streams a serialized component tree (not HTML) — they compose differently and serve different purposes.`,
        code: `// CSR — JS downloads, runs, renders in browser
// Problem: slow TTFB, SEO issues, waterfall fetches

// SSR — server renders HTML, client hydrates
// Problem: full JS bundle still ships, hydration cost

// RSC — server renders, streams component tree
// Benefit: server components = zero client JS
//          client components = minimal, targeted JS
//          data fetching at component level, no waterfalls

// Key rule: RSC cannot use hooks or browser APIs
// Client Components CAN be children of Server Components`,
      },
    ],
  },
  {
    id: "performance",
    label: "Performance",
    icon: "⚡",
    tag: "4+ YOE",
    tagColor: "#ff6b6b",
    sections: [
      {
        title: "List Virtualization",
        content: `Rendering 10,000 rows creates 10,000 DOM nodes — instant performance death. Virtualization renders only the visible window of items, keeping DOM nodes to ~20–50 regardless of list size.`,
        code: `import { FixedSizeList } from 'react-window';

// Only renders visible rows — 100k items, ~20 DOM nodes
const VirtualList = ({ items }) => (
  <FixedSizeList
    height={600}
    itemCount={items.length}
    itemSize={50}         // row height in px
    width="100%"
  >
    {({ index, style }) => (
      // style has absolute position — required for virtualization
      <div style={style} className="row">
        {items[index].name}
      </div>
    )}
  </FixedSizeList>
);`,
      },
      {
        title: "Code Splitting & Lazy Loading",
        content: `React.lazy + Suspense splits your bundle at component boundaries. Only load what's needed, when it's needed. Route-level splitting is the minimum — feature-level splitting is even better for large apps.`,
        code: `// Route-level splitting
const Home      = React.lazy(() => import('./pages/Home'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Settings  = React.lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings"  element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
// Each route = separate chunk = only loaded when navigated to`,
      },
      {
        title: "Context Performance — The Hidden Trap",
        content: `Every consumer re-renders when context value changes — even if it only cares about one field. Split contexts by update frequency, or use useMemo to stabilize the value.`,
        code: `// ❌ One huge context — any change re-renders everything
const AppContext = createContext({ user, theme, cart, ui, ... });

// ✅ Split by concern — each consumer only re-renders for its slice
const UserContext   = createContext(null); // changes rarely
const ThemeContext  = createContext(null); // changes on toggle
const CartContext   = createContext(null); // changes on add/remove

// ✅ Stabilize context value with useMemo
function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const value = useMemo(() => ({
    items,
    addItem:    item => setItems(p => [...p, item]),
    removeItem: id   => setItems(p => p.filter(i => i.id !== id)),
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}`,
      },
      {
        title: "useLayoutEffect vs useEffect",
        content: `useEffect runs asynchronously after paint. useLayoutEffect runs synchronously before paint — use it when you need to read or mutate DOM layout before the user sees it (e.g., measuring, repositioning tooltips).`,
        code: `// useEffect: async, after paint — use for most side effects
useEffect(() => {
  document.title = \`\${count} notifications\`;
}, [count]);

// useLayoutEffect: sync, before paint — use for DOM measurements
useLayoutEffect(() => {
  const rect = ref.current.getBoundingClientRect();
  // reposition tooltip before browser paints — prevents flicker
  setTooltipPos({ top: rect.bottom, left: rect.left });
}, []);

// Rule of thumb:
// Default to useEffect
// Reach for useLayoutEffect only when you see layout flicker`,
      },
    ],
  },
  {
    id: "testing",
    label: "Testing",
    icon: "✓",
    tag: "4+ YOE",
    tagColor: "#ff6b6b",
    sections: [
      {
        title: "Testing Philosophy",
        content: `Test behavior, not implementation. Avoid testing internal state or specific hooks — test what the user sees and does. The testing pyramid: many unit tests, some integration tests, few E2E tests.`,
        code: `// ❌ Testing implementation — brittle
expect(wrapper.state('isLoading')).toBe(true);
expect(component.find('Spinner').exists()).toBe(true);

// ✅ Testing behavior — resilient
const { getByRole, queryByText } = render(<UserList userId="1" />);
expect(getByRole('progressbar')).toBeInTheDocument(); // loading state
await waitFor(() => expect(queryByText('Loading')).not.toBeInTheDocument());
expect(getByRole('list')).toBeInTheDocument(); // data rendered`,
      },
      {
        title: "Testing Hooks & Async",
        content: `React Testing Library's renderHook tests custom hooks in isolation. Use waitFor for async state updates. Always mock external dependencies (fetch, APIs) — test your code, not the network.`,
        code: `import { renderHook, act, waitFor } from '@testing-library/react';

// Testing a custom hook
it('useFetch returns data after loading', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    json: () => Promise.resolve({ name: 'Pankul' })
  });

  const { result } = renderHook(() => useFetch('/api/user'));
  
  expect(result.current.loading).toBe(true);
  
  await waitFor(() => expect(result.current.loading).toBe(false));
  
  expect(result.current.data).toEqual({ name: 'Pankul' });
  expect(fetch).toHaveBeenCalledWith('/api/user');
});`,
      },
    ],
  },
];

const CodeBlock = ({ code }) => (
  <pre style={{
    background: "#0d1117",
    border: "1px solid #30363d",
    borderRadius: "8px",
    padding: "16px",
    overflowX: "auto",
    fontSize: "12.5px",
    lineHeight: "1.7",
    color: "#e6edf3",
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
    margin: "12px 0 0 0",
  }}>
    <code>{code.trim()}</code>
  </pre>
);

const DiagramBlock = ({ diagram }) => (
  <pre style={{
    background: "#010409",
    border: "1px solid #1a2a1a",
    borderRadius: "8px",
    padding: "16px",
    overflowX: "auto",
    fontSize: "11px",
    lineHeight: "1.6",
    color: "#39d353",
    fontFamily: "'JetBrains Mono', monospace",
    margin: "12px 0 0 0",
  }}>
    {diagram.trim()}
  </pre>
);

const TagBadge = ({ label, color }) => (
  <span style={{
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    padding: "2px 8px",
    borderRadius: "4px",
    background: color + "18",
    color: color,
    border: `1px solid ${color}40`,
    fontFamily: "monospace",
    textTransform: "uppercase",
  }}>{label}</span>
);

const Section = ({ section, isOpen, onToggle, index }) => (
  <div style={{
    borderBottom: "1px solid #161b22",
    transition: "all 0.2s",
  }}>
    <button
      onClick={onToggle}
      style={{
        width: "100%",
        textAlign: "left",
        background: "none",
        border: "none",
        padding: "16px 20px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        color: isOpen ? "#e6edf3" : "#8b949e",
        transition: "color 0.2s",
      }}
    >
      <span style={{
        fontSize: "11px",
        fontFamily: "monospace",
        color: "#30363d",
        width: "20px",
        flexShrink: 0,
      }}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <span style={{ fontWeight: 600, fontSize: "14px", flex: 1 }}>
        {section.title}
      </span>
      <span style={{
        fontSize: "12px",
        color: "#30363d",
        transform: isOpen ? "rotate(90deg)" : "rotate(0)",
        transition: "transform 0.2s",
      }}>▶</span>
    </button>

    {isOpen && (
      <div style={{ padding: "0 20px 20px 52px" }}>
        <p style={{
          color: "#8b949e",
          fontSize: "13.5px",
          lineHeight: "1.75",
          margin: "0 0 4px 0",
        }}>
          {section.content}
        </p>
        {section.diagram && <DiagramBlock diagram={section.diagram} />}
        {section.code && <CodeBlock code={section.code} />}
      </div>
    )}
  </div>
);

const ProgressRing = ({ done, total }) => {
  const pct = total === 0 ? 0 : done / total;
  const r = 16, stroke = 3, norm = r - stroke / 2;
  const circ = 2 * Math.PI * norm;
  return (
    <svg width="38" height="38" viewBox="0 0 38 38">
      <circle cx="19" cy="19" r={norm} fill="none" stroke="#161b22" strokeWidth={stroke} />
      <circle
        cx="19" cy="19" r={norm}
        fill="none"
        stroke={pct === 1 ? "#39d353" : "#238636"}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round"
        style={{ transform: "rotate(-90deg)", transformOrigin: "center", transition: "stroke-dashoffset 0.4s ease" }}
      />
      <text x="19" y="23" textAnchor="middle" fill="#e6edf3" fontSize="9" fontFamily="monospace">
        {done}/{total}
      </text>
    </svg>
  );
};

export default function ReactInterviewPrep() {
  const [activeTopic, setActiveTopic] = useState("vdom");
  const [openSections, setOpenSections] = useState({ "vdom-0": true });
  const [completed, setCompleted] = useState({});
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const contentRef = useRef(null);

  const topic = useMemo(() =>
    TOPICS.find(t => t.id === activeTopic),
    [activeTopic]
  );

  const filteredTopics = useMemo(() => {
    if (!search.trim()) return TOPICS;
    const q = search.toLowerCase();
    return TOPICS.filter(t =>
      t.label.toLowerCase().includes(q) ||
      t.sections.some(s =>
        s.title.toLowerCase().includes(q) ||
        s.content.toLowerCase().includes(q)
      )
    );
  }, [search]);

  const toggleSection = useCallback((key) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
    setCompleted(prev => ({ ...prev, [key]: true }));
  }, []);

  const totalSections = useMemo(() =>
    TOPICS.reduce((acc, t) => acc + t.sections.length, 0), []);

  const doneCount = useMemo(() =>
    Object.values(completed).filter(Boolean).length, [completed]);

  const topicDone = useCallback((t) =>
    t.sections.filter((_, i) => completed[`${t.id}-${i}`]).length, [completed]);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [activeTopic]);

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      background: "#0d1117",
      color: "#e6edf3",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      overflow: "hidden",
    }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? "260px" : "0",
        minWidth: sidebarOpen ? "260px" : "0",
        overflow: "hidden",
        background: "#010409",
        borderRight: "1px solid #161b22",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.25s, min-width 0.25s",
      }}>
        {/* Sidebar header */}
        <div style={{ padding: "20px 16px 12px", borderBottom: "1px solid #161b22", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <span style={{ fontSize: "18px" }}>⚛</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: "13px", letterSpacing: "0.03em" }}>React Deep Dive</div>
              <div style={{ fontSize: "10px", color: "#6e7681", fontFamily: "monospace" }}>Interview Prep · 4+ YOE</div>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <ProgressRing done={doneCount} total={totalSections} />
            </div>
          </div>
          <input
            placeholder="Search topics..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%",
              background: "#0d1117",
              border: "1px solid #21262d",
              borderRadius: "6px",
              padding: "6px 10px",
              color: "#e6edf3",
              fontSize: "12px",
              outline: "none",
              boxSizing: "border-box",
              fontFamily: "inherit",
            }}
          />
        </div>

        {/* Topic list */}
        <div style={{ overflowY: "auto", flex: 1, padding: "8px 0" }}>
          {filteredTopics.map(t => {
            const done = topicDone(t);
            const isActive = t.id === activeTopic;
            return (
              <button
                key={t.id}
                onClick={() => { setActiveTopic(t.id); setSearch(""); }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: isActive ? "#161b22" : "none",
                  border: "none",
                  borderLeft: isActive ? `2px solid ${t.tagColor}` : "2px solid transparent",
                  padding: "10px 16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: "15px", color: isActive ? t.tagColor : "#6e7681" }}>
                  {t.icon}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: "13px",
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#e6edf3" : "#8b949e",
                    marginBottom: "2px",
                  }}>{t.label}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <TagBadge label={t.tag} color={t.tagColor} />
                    <span style={{ fontSize: "10px", color: "#6e7681", fontFamily: "monospace" }}>
                      {done}/{t.sections.length}
                    </span>
                  </div>
                </div>
                {done === t.sections.length && (
                  <span style={{ fontSize: "12px", color: "#39d353" }}>✓</span>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ padding: "12px 16px", borderTop: "1px solid #161b22", flexShrink: 0 }}>
          <div style={{ fontSize: "10px", color: "#6e7681", textAlign: "center", fontFamily: "monospace" }}>
            {doneCount} / {totalSections} sections read
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <div style={{
          padding: "12px 24px",
          borderBottom: "1px solid #161b22",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          background: "#010409",
          flexShrink: 0,
        }}>
          <button
            onClick={() => setSidebarOpen(o => !o)}
            style={{
              background: "none", border: "1px solid #21262d", borderRadius: "6px",
              color: "#8b949e", cursor: "pointer", padding: "4px 8px", fontSize: "14px",
            }}
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "18px", color: topic?.tagColor }}>{topic?.icon}</span>
            <span style={{ fontWeight: 700, fontSize: "16px" }}>{topic?.label}</span>
            {topic && <TagBadge label={topic.tag} color={topic.tagColor} />}
          </div>

          <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
            {TOPICS.map(t => {
              const done = topicDone(t);
              const pct = done / t.sections.length;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTopic(t.id)}
                  title={t.label}
                  style={{
                    width: "6px",
                    height: "24px",
                    borderRadius: "3px",
                    border: "none",
                    cursor: "pointer",
                    background: t.id === activeTopic
                      ? t.tagColor
                      : pct === 1
                      ? "#39d35360"
                      : pct > 0
                      ? "#238636"
                      : "#21262d",
                    transition: "background 0.2s",
                    padding: 0,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Content area */}
        <div ref={contentRef} style={{ flex: 1, overflowY: "auto", padding: "0 0 40px" }}>
          {topic && (
            <>
              <div style={{
                padding: "28px 32px 20px",
                borderBottom: "1px solid #161b22",
              }}>
                <h1 style={{
                  margin: "0 0 8px 0",
                  fontSize: "22px",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: "#e6edf3",
                }}>
                  {topic.label}
                </h1>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <TagBadge label={topic.tag} color={topic.tagColor} />
                  <span style={{ fontSize: "12px", color: "#6e7681", fontFamily: "monospace" }}>
                    {topic.sections.length} sections · {topicDone(topic)}/{topic.sections.length} read
                  </span>
                </div>
              </div>

              <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 32px" }}>
                {topic.sections.map((section, i) => {
                  const key = `${topic.id}-${i}`;
                  return (
                    <div key={key} style={{
                      marginTop: "16px",
                      background: "#010409",
                      border: `1px solid ${openSections[key] ? "#21262d" : "#161b22"}`,
                      borderRadius: "10px",
                      overflow: "hidden",
                      transition: "border-color 0.2s",
                    }}>
                      <Section
                        section={section}
                        index={i}
                        isOpen={!!openSections[key]}
                        onToggle={() => toggleSection(key)}
                      />
                    </div>
                  );
                })}

                {/* Nav footer */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "32px",
                  paddingTop: "24px",
                  borderTop: "1px solid #161b22",
                }}>
                  {(() => {
                    const idx = TOPICS.findIndex(t => t.id === activeTopic);
                    const prev = TOPICS[idx - 1];
                    const next = TOPICS[idx + 1];
                    return (
                      <>
                        {prev ? (
                          <button onClick={() => setActiveTopic(prev.id)} style={{
                            background: "#0d1117", border: "1px solid #21262d",
                            borderRadius: "8px", padding: "10px 16px", cursor: "pointer",
                            color: "#8b949e", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px",
                          }}>
                            <span>←</span>
                            <span>{prev.label}</span>
                          </button>
                        ) : <div />}
                        {next && (
                          <button onClick={() => setActiveTopic(next.id)} style={{
                            background: "#0d1117", border: `1px solid ${next.tagColor}40`,
                            borderRadius: "8px", padding: "10px 16px", cursor: "pointer",
                            color: next.tagColor, fontSize: "13px", display: "flex", alignItems: "center", gap: "8px",
                          }}>
                            <span>{next.label}</span>
                            <span>→</span>
                          </button>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}