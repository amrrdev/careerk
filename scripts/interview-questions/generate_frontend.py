# -*- coding: utf-8 -*-
import json

questions = []
q = questions.append

# ============================================================
# JUNIOR x TECHNICAL (8 questions)
# ============================================================

q({
  "role": "FRONTEND",
  "level": "JUNIOR",
  "category": "TECHNICAL",
  "question": "Explain how JavaScript's event loop works. What is the difference between the call stack, task queue, and microtask queue? How does this affect the execution order when using setTimeout, Promises, and async/await?",
  "difficulty": "EASY",
  "skills": ["JavaScript", "Event Loop", "Asynchronous Programming"],
  "estimatedTime": "2-4 min",
  "guidance": {
    "keyPoints": [
      "JavaScript is single-threaded with a single call stack executing one function at a time",
      "The event loop continuously checks if the call stack is empty and then processes tasks from queues",
      "Microtasks (Promise callbacks, queueMicrotask) have higher priority than macrotasks (setTimeout, setInterval, I/O)",
      "The event loop drains the entire microtask queue before processing the next macrotask",
      "async/await is syntactic sugar over Promises — await creates a microtask continuation",
      "Microtasks can starve the macrotask queue if they keep adding more microtasks"
    ],
    "commonMistakes": [
      "Confusing macrotasks with microtasks and their execution order",
      "Thinking setTimeout(fn, 0) executes immediately — it waits for all microtasks and pending operations",
      "Believing the event loop is part of the JavaScript engine — it's actually provided by the runtime (browser/Node)",
      "Assuming async/await is truly synchronous — it still suspends execution and queues continuations"
    ],
    "answerStructure": [
      "Start with the single-threaded nature of JavaScript and why the event loop is necessary",
      "Describe the call stack and how functions are pushed/popped during execution",
      "Explain macrotask queue (setTimeout, setInterval, I/O callbacks) and microtask queue (Promise.then, queueMicrotask, MutationObserver)",
      "Walk through a code example showing the execution order with console.log, setTimeout, and Promise.resolve().then()",
      "Explain how async/await compiles down to Promise chains and where continuations are queued",
      "Cover edge cases: microtask starvation and how runtimes handle it"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "JUNIOR",
  "category": "TECHNICAL",
  "question": "How do closures work in JavaScript? What happens in memory when a closure is created? Explain the mechanism that allows inner functions to access outer function variables after the outer function has returned.",
  "difficulty": "EASY",
  "skills": ["JavaScript", "Closures", "Scope", "Memory"],
  "estimatedTime": "2-4 min",
  "guidance": {
    "keyPoints": [
      "A closure is created when an inner function references variables from an outer function's scope",
      "The inner function retains a reference to the outer function's variable environment (scope chain), not a copy",
      "JavaScript engines use a [[Scopes]] property (V8) or similar internal slot to store the captured environment",
      "Garbage collection is prevented for captured variables until all closures referencing them are collected",
      "Each function invocation creates a new lexical environment, so multiple closures can capture different states",
      "Closures are the foundation of module patterns, currying, and React hooks (useState's captured state)"
    ],
    "commonMistakes": [
      "Thinking closures capture the current value — they capture a reference to the variable, which can change",
      "Believing closure variables are copied into the inner function — the entire scope chain is preserved",
      "Creating accidental closures in loops without let or an IIFE to create a new binding per iteration",
      "Assuming closures are a specific language feature rather than a natural consequence of lexical scoping"
    ],
    "answerStructure": [
      "Define lexical scoping: a function's ability to access variables from its containing scope at definition time",
      "Explain what a closure is: function + its lexical environment bundled together",
      "Show code example: outer function returns inner function that still accesses outer's variable",
      "Explain the memory mechanics: the outer function's variable environment persists in memory via the closure's reference",
      "Discuss implications: memory leaks (accidental closures in event listeners) vs intentional use (factories, modules)",
      "Demonstrate the loop problem with var vs let and how closures solve or cause it"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "JUNIOR",
  "category": "TECHNICAL",
  "question": "Explain how the 'this' keyword is determined in JavaScript. Compare regular function calls, method calls, arrow functions, constructor calls with 'new', and event handlers. How do .call(), .apply(), and .bind() explicitly control 'this'?",
  "difficulty": "EASY",
  "skills": ["JavaScript", "this", "Function Methods", "Binding"],
  "estimatedTime": "2-4 min",
  "guidance": {
    "keyPoints": [
      "'this' is determined by the call site � how a function is called, not where it's defined",
      "Default binding: standalone function call gets the global object (window) or undefined in strict mode",
      "Implicit binding: method call (obj.fn()) sets 'this' to the object left of the dot",
      "Explicit binding: .call(), .apply(), and .bind() override whatever 'this' would be",
      "Arrow functions do not have their own 'this' � they inherit it from the enclosing lexical scope at definition time",
      "Constructor calls with 'new' create a new object and set 'this' to that new object"
    ],
    "commonMistakes": [
      "Confusing where a function is defined vs how it's called when determining 'this'",
      "Losing context when passing a method as a callback (e.g., setTimeout(obj.method, 100))",
      "Assuming arrow functions always bind to the nearest object � they bind to the enclosing lexical scope",
      "Forgetting that class methods in JavaScript are just functions and lose 'this' when detached from the instance"
    ],
    "answerStructure": [
      "Explain that 'this' is runtime-bound and depends on the invocation pattern",
      "Walk through each binding rule with code: default, implicit, explicit, new, and arrow",
      "Show the classic lost-context problem: const fn = obj.method; fn()",
      "Demonstrate how .bind() creates a new function with permanently bound 'this'",
      "Explain why arrow functions solve the callback problem in React class components and useEffect closures",
      "Cover the priority order: new > explicit > implicit > default (arrow functions override all for their own 'this')"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "JUNIOR",
  "category": "TECHNICAL",
  "question": "How does CSS specificity work? Explain the calculation algorithm browsers use to determine which styles apply when multiple rules target the same element. What is the !important override and how does it affect the cascade?",
  "difficulty": "EASY",
  "skills": ["CSS", "Specificity", "Cascade", "Selectors"],
  "estimatedTime": "2-4 min",
  "guidance": {
    "keyPoints": [
      "Specificity is a four-part weight (a,b,c,d) computed from selector components: inline styles, IDs, classes/attributes/pseudo-classes, elements/pseudo-elements",
      "Inline styles have the highest specificity (1,0,0,0) and override any selector-based rules",
      "ID selectors (#id) score (0,1,0,0) � each ID adds one to the second position",
      "Class selectors (.class), attribute selectors ([type]), and pseudo-classes (:hover) score (0,0,1,0)",
      "Element selectors (div) and pseudo-elements (::before) score (0,0,0,1)",
      "'!important' overrides all specificity weights and should be avoided � it breaks the natural cascade"
    ],
    "commonMistakes": [
      "Thinking specificity is a single number � it's a four-part value compared column by column",
      "Believing !important can be overridden by adding more selectors � only another !important with higher specificity can override it",
      "Confusing selector quantity with specificity weight � 11 class selectors still lose to one ID selector",
      "Not accounting for the universal selector (*) and combinators (>, +, ~) which add zero specificity"
    ],
    "answerStructure": [
      "Explain the cascade: browsers apply styles from all sources and resolve conflicts by origin, specificity, and order",
      "Describe the specificity calculation: (inline, IDs, classes/attributes/pseudo-classes, elements/pseudo-elements)",
      "Walk through examples comparing selectors and their computed specificity values",
      "Explain the role of !important and how it inverts the normal specificity rules",
      "Discuss best practices: keep specificity low, avoid !important, use BEM or similar to prevent conflicts",
      "Cover the source order tiebreaker: when two selectors have equal specificity, the last one wins"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "JUNIOR",
  "category": "TECHNICAL",
  "question": "How does JavaScript's prototypal inheritance work under the hood? Explain the __proto__ property, the prototype chain, and how the 'new' keyword functions when creating objects with constructor functions. How does this differ from classical inheritance?",
  "difficulty": "MEDIUM",
  "skills": ["JavaScript", "Prototypes", "Inheritance", "new Keyword"],
  "estimatedTime": "2-4 min",
  "guidance": {
    "keyPoints": [
      "Every JavaScript object has an internal [[Prototype]] slot accessible via __proto__ or Object.getPrototypeOf",
      "When a property is accessed, the engine walks the prototype chain until it finds the property or reaches null",
      "Constructor functions called with 'new' create a new object whose [[Prototype]] is set to the constructor's .prototype property",
      "The .prototype property on a function is distinct from [[Prototype]] on instances � it's the prototype assigned to objects created by that constructor",
      "Classes in ES6 are syntactic sugar over constructor functions and prototype-based inheritance",
      "Prototypal inheritance is dynamic � adding to a prototype affects all existing instances immediately"
    ],
    "commonMistakes": [
      "Confusing .prototype (property on constructor functions) with [[Prototype]] (internal link on objects)",
      "Thinking ES6 classes introduce a new inheritance model � they still use prototypes under the hood",
      "Believing that Object.create(null) creates an object with no prototype but then trying to use instanceof on it (breaks)",
      "Assuming that modifying a prototype after instances are created won't affect those instances"
    ],
    "answerStructure": [
      "Define [[Prototype]] as the internal link every object has to another object or null",
      "Explain property lookup: obj.prop ? check own properties ? walk [[Prototype]] chain ? undefined",
      "Show how constructor functions + 'new' work: new object ? link to .prototype ? bind 'this' ? return",
      "Demonstrate inheritance: Child.prototype = Object.create(Parent.prototype)",
      "Contrast with classical inheritance (classes as blueprints copied to instances) vs prototypal (live delegation)",
      "Show ES6 class syntax and explain what it compiles down to"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "JUNIOR",
  "category": "TECHNICAL",
  "question": "Explain how JavaScript Promises work internally. What are the three states of a Promise? How does .then() chaining actually pass values through the chain? What happens to errors that aren't caught at any point in the chain?",
  "difficulty": "EASY",
  "skills": ["JavaScript", "Promises", "Asynchronous Programming", "Error Handling"],
  "estimatedTime": "2-4 min",
  "guidance": {
    "keyPoints": [
      "A Promise is an object representing the eventual completion or failure of an async operation with three states: pending, fulfilled, and rejected",
      "Once settled (fulfilled or rejected), a Promise's state and value are immutable",
      ".then() returns a new Promise, enabling chaining � the return value of the callback becomes the fulfillment value of the returned Promise",
      "If a callback in .then() throws or returns a rejected Promise, the returned Promise rejects",
      "Unhandled rejections bubble to the end of the chain � if no .catch() exists, the runtime fires an unhandledrejection event",
      "Promise.resolve() and Promise.reject() create pre-settled Promises synchronously"
    ],
    "commonMistakes": [
      "Thinking .then() returns the same Promise instead of a new one",
      "Not returning a value from a .then() callback, causing undefined to propagate",
      "Assuming a rejected Promise is the same as a thrown synchronous error � they behave differently",
      "Forgetting that Promise callbacks run as microtasks, not synchronously when the Promise resolves"
    ],
    "answerStructure": [
      "Describe the Promise lifecycle: pending ? fulfilled/rejected (irreversible once settled)",
      "Explain the constructor: (resolve, reject) are callbacks that transition the state",
      "Walk through .then(): accepts onFulfilled and onRejected callbacks, returns a new Promise",
      "Show how chaining works: each .then() receives the previous fulfillment value and can transform it",
      "Demonstrate error propagation: any rejection skips .then() handlers until a .catch() is found",
      "Discuss unhandled rejections: the runtime detects when a rejected Promise has no rejection handler attached"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "JUNIOR",
  "category": "TECHNICAL",
  "question": "What is the Virtual DOM in React and how does it work? Explain the process from state change to actual DOM update. Why does React use a Virtual DOM instead of directly manipulating the DOM?",
  "difficulty": "MEDIUM",
  "skills": ["React", "Virtual DOM", "Reconciliation", "Rendering"],
  "estimatedTime": "2-4 min",
  "guidance": {
    "keyPoints": [
      "The Virtual DOM is a lightweight JavaScript object representation of the real DOM tree",
      "When state changes, React creates a new Virtual DOM tree and diffs it against the previous one (reconciliation)",
      "React uses a heuristic O(n) diffing algorithm because a perfect O(n^3) tree diff is too expensive",
      "The diff identifies minimal operations needed: insert, update, remove, or reorder DOM nodes",
      "React batches updates and flushes them to the real DOM in a single synchronous cycle",
      "The Virtual DOM abstracts the underlying render target � not just DOM, but native (React Native) or canvas (React Three Fiber)"
    ],
    "commonMistakes": [
      "Believing the Virtual DOM is always faster than direct DOM manipulation � it's a performance abstraction, not a guarantee",
      "Thinking every state change immediately triggers a full re-render of the entire tree",
      "Confusing Virtual DOM creation (render phase) with actual DOM updates (commit phase)",
      "Assuming the Virtual DOM eliminates the need for understanding DOM APIs"
    ],
    "answerStructure": [
      "Define the Virtual DOM: a plain JS object tree that mirrors the real DOM structure",
      "Explain why it exists: declarative UI programming requires understanding what changed without direct mutation",
      "Describe the render ? diff ? commit pipeline",
      "Explain the diffing heuristics: same type = update in place, different type = unmount + remount, keys for lists",
      "Discuss performance characteristics: batching reduces DOM thrashing, but the tree size affects diff cost",
      "Address cross-platform benefits: React Native, React VR, custom renderers all leverage the Virtual DOM abstraction"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "JUNIOR",
  "category": "TECHNICAL",
  "question": "How does React batch state updates? When you call setState multiple times in the same synchronous handler, how many re-renders occur? How does React 18's automatic batching differ from earlier versions?",
  "difficulty": "MEDIUM",
  "skills": ["React", "State Management", "Batching", "Rendering"],
  "estimatedTime": "2-4 min",
  "guidance": {
    "keyPoints": [
      "Batching means React groups multiple state updates into a single re-render to avoid unnecessary work",
      "In React 17 and earlier, batching only happened inside React event handlers (synthetic events)",
      "Outside event handlers (setTimeout, Promises, native DOM events), each setState triggered a separate re-render",
      "React 18 introduced automatic batching for all updates, regardless of context",
      "React 18's createRoot enables automatic batching; legacy ReactDOM.render uses the old behavior",
      "You can opt out of batching using flushSync for cases requiring synchronous DOM access"
    ],
    "commonMistakes": [
      "Assuming setState is synchronous � state updates are queued and processed asynchronously",
      "Thinking the component re-renders after each setState call inside an event handler (pre-React 18 behavior)",
      "Not understanding that multiple state updates in a batch use the functional updater form of setState to avoid stale closures",
      "Confusing batching (grouping renders) with the reconciliation algorithm (diffing Virtual DOM trees)"
    ],
    "answerStructure": [
      "Define batching: collecting multiple setState calls and processing them in one render pass",
      "Explain pre-React 18: batching only in synthetic event handlers, not in setTimeout or Promises",
      "Show code examples where pre-React 18 caused multiple re-renders and React 18 batches them",
      "Explain how automatic batching works: React wraps updates in an internal batch context",
      "Discuss flushSync for escaping batching � when you need predictable DOM state between updates",
      "Cover the impact: improved performance, fewer intermediate renders, simpler mental model"
    ]
  }
})

# ============================================================
# JUNIOR x PROBLEM_SOLVING (8 questions)
# ============================================================

q({
  "role": "FRONTEND",
  "level": "JUNIOR",
  "category": "PROBLEM_SOLVING",
  "question": "You notice a React component re-renders excessively whenever the parent updates, even though its props have not changed. How would you diagnose the root cause and fix it? What tools would you use to identify unnecessary re-renders?",
  "difficulty": "EASY",
  "skills": ["React", "Performance", "Debugging", "Rendering"],
  "estimatedTime": "2-4 min",
  "guidance": {
    "keyPoints": [
      "React re-renders a component when its parent re-renders by default, even if props are the same",
      "React DevTools Profiler shows which components rendered and why (props change, state change, context change, parent re-render)",
      "Chrome DevTools Performance tab can identify JavaScript execution time and layout thrashing",
      "React.memo wraps a component to skip re-rendering when props are shallowly equal",
      "useMemo and useCallback stabilize references to prevent child components from re-rendering unnecessarily",
      "useSelector in Redux or context selectors can isolate state subscriptions to avoid broad re-renders"
    ],
    "commonMistakes": [
      "Adding React.memo everywhere without profiling first � it adds a comparison cost that may exceed the render cost",
      "Creating new objects/arrays in render that break React.memo's shallow equality check",
      "Focusing only on component re-renders instead of measuring actual DOM mutations (layout/paint)",
      "Not checking if the parent's re-render issue is the actual problem vs an unrelated state update"
    ],
    "answerStructure": [
      "Start by using React DevTools Profiler to record an interaction and identify which components re-rendered",
      "Check the 'why did this render?' cause: props, state, context, or parent re-render",
      "If props are the cause, check if new object/function references are created each render",
      "Apply targeted fixes: React.memo for leaf components, useCallback for callback props, useMemo for object props",
      "Re-profile to verify the fix reduced re-renders",
      "Consider architectural changes like state colocation or context splitting if the issue is systemic"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "JUNIOR",
  "category": "PROBLEM_SOLVING",
  "question": "Design an autocomplete search component that fetches results from an API as the user types. How would you handle debouncing, race conditions (out-of-order responses), and error states? Describe the component architecture and state flow.",
  "difficulty": "EASY",
  "skills": ["React", "API Integration", "Debouncing", "State Management"],
  "estimatedTime": "2-4 min",
  "guidance": {
    "keyPoints": [
      "Debouncing prevents firing an API call on every keystroke � use a configurable delay (typically 300-500ms)",
      "Race conditions occur when an older response arrives after a newer one, overwriting correct results",
      "Use an abort controller or a request identifier (e.g., incrementing counter) to discard stale responses",
      "Component state should track: input value, results, loading, error, and optionally selected item",
      "Keyboard navigation (arrow keys, enter, escape) and accessibility (ARIA combobox pattern) are critical",
      "Handle edge cases: empty input clears results, network failure shows error state, no results shows empty message"
    ],
    "commonMistakes": [
      "Not handling race conditions � assuming API responses arrive in order",
      "Debouncing the render instead of the API call � the input should update immediately for responsive UI",
      "Forgetting to cancel pending requests when the component unmounts (memory leaks, state updates on unmounted component)",
      "Failing to handle all states: loading, error, empty results, and results simultaneously"
    ],
    "answerStructure": [
      "Define the component interface: props (API endpoint, debounce delay, placeholder), state shape",
      "Implement debouncing: use a custom useDebounce hook that delays the API call trigger",
      "Implement request deduplication: increment a counter or use AbortController to cancel in-flight requests",
      "Build the UI: input field, dropdown with results, loading spinner, error message, empty state",
      "Add keyboard navigation: track activeIndex in state, listen for keydown events, manage focus",
      "Discuss accessibility: role='combobox', aria-activedescendant, screen reader announcements via aria-live"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "JUNIOR",
  "category": "PROBLEM_SOLVING",
  "question": "A page on your site loads slowly because it fetches data from three different API endpoints sequentially. How would you restructure the data fetching to improve performance? What trade-offs would you consider?",
  "difficulty": "EASY",
  "skills": ["Performance", "API Design", "Data Fetching", "Optimization"],
  "estimatedTime": "2-4 min",
  "guidance": {
    "keyPoints": [
      "Parallel fetching with Promise.all reduces total wait time to the slowest request instead of the sum",
      "Promise.all fails fast on any rejection � Promise.allSettled may be better if partial data is acceptable",
      "Waterfall requests are sometimes unavoidable when one endpoint depends on data from another",
      "Server-side BFF (Backend for Frontend) can aggregate multiple API calls into a single request",
      "React Query / SWR can deduplicate requests and cache responses to prevent redundant fetches",
      "Suspense with streaming or concurrent fetching can show UI progressively as data arrives"
    ],
    "commonMistakes": [
      "Using Promise.all without error handling � one failure loses all data",
      "Prematurely parallelizing requests that have implicit dependencies (race conditions in data consistency)",
      "Not considering that the server might be the bottleneck � parallel client requests still hit the same server",
      "Over-aggregating unrelated data into a single endpoint, increasing response size and coupling"
    ],
    "answerStructure": [
      "Analyze the current waterfall: identify which requests depend on others and which are independent",
      "Parallelize independent requests with Promise.all or Promise.allSettled",
      "For dependent requests, consider server-side aggregation (BFF pattern) or restructuring the API",
      "Implement client-side caching: React Query/SWR with stale-while-revalidate to avoid re-fetching",
      "Consider optimistic UI and skeleton loading states to improve perceived performance",
      "Discuss trade-offs: parallel requests increase server load, aggregation reduces flexibility, caching adds complexity"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "JUNIOR",
  "category": "PROBLEM_SOLVING",
  "question": "You need to implement a complex form with validation rules where errors display in real-time as the user types. How would you structure the validation logic to keep it maintainable and performant?",
  "difficulty": "MEDIUM",
  "skills": ["Form Validation", "React", "State Management", "UX"],
  "estimatedTime": "2-4 min",
  "guidance": {
    "keyPoints": [
      "Separate validation schema from UI � use a declarative validation library like Zod, Yup, or Joi",
      "Validate on blur (touch) and on change only after first submission to avoid premature errors",
      "Debounce async validation (e.g., checking username availability) to avoid excessive API calls",
      "Use a validation schema that returns all errors at once, then map them to specific fields",
      "Only validate the field being changed on each keystroke, not the entire form, for performance",
      "Track field touched state separately from field values to control when to show errors"
    ],
    "commonMistakes": [
      "Running full-form validation on every keystroke � O(n) validation cost grows with form size",
      "Showing errors before the user has interacted with a field (empty field errors on page load)",
      "Storing validation state imperatively instead of deriving it from the schema and values",
      "Not distinguishing between field-level errors and form-level errors (e.g., server-side validation)"
    ],
    "answerStructure": [
      "Define the form state shape: values, errors, touched/dirty fields, and submission status",
      "Choose a validation library and define the schema with field rules and custom validators",
      "Implement field-level validation on change (debounced for async) and full validation on submit",
      "Implement the validation runner: compare values against schema, collect errors, return error map",
      "Connect validation to UI: show errors only when touched, highlight fields, disable submit until valid",
      "Discuss performance: memoize validation results, avoid recreating schemas on each render"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "JUNIOR",
  "category": "PROBLEM_SOLVING",
  "question": "Design a tab component that is fully accessible � supporting keyboard navigation, screen reader announcements, and ARIA patterns. How would you implement focus management when switching tabs?",
  "difficulty": "EASY",
  "skills": ["Accessibility", "ARIA", "Keyboard Navigation", "Component Design"],
  "estimatedTime": "2-4 min",
  "guidance": {
    "keyPoints": [
      "WAI-ARIA Tab Pattern defines role='tablist', role='tab' (with aria-selected), and role='tabpanel' (with aria-labelledby)",
      "Keyboard navigation: Left/Right arrows move focus between tabs, Home/End go to first/last tab",
      "Focus management: the active tab should receive focus via tabindex='0', inactive tabs get tabindex='-1'",
      "The selected tab panel should have aria-labelledby pointing to the tab and role='tabpanel'",
      "Screen reader announcements: use aria-live='polite' region or let the browser announce role changes automatically",
      "Disabled tabs use aria-disabled='true' instead of removing the tab from DOM or focus order"
    ],
    "commonMistakes": [
      "Using display:none on inactive panels � this hides them from screen readers entirely",
      "Not managing focus when tab changes � keyboard users lose context",
      "Putting tabindex='0' on all tabs instead of only the active one",
      "Adding click handlers on both the tab and an inner element, causing double-firing events"
    ],
    "answerStructure": [
      "Structure the HTML: tablist container containing tab buttons, followed by tabpanel elements",
      "Apply ARIA attributes: role, aria-selected, aria-controls, aria-labelledby, aria-orientation",
      "Implement keyboard event handlers: arrow keys move focus and selection, Enter/Space activate",
      "Implement focus management: roving tabindex (only active tab is reachable via Tab)",
      "Implement the tabpanel visibility: aria-hidden on inactive panels, visible on active",
      "Test with a screen reader (NVDA/VoiceOver) and keyboard-only navigation"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "JUNIOR",
  "category": "PROBLEM_SOLVING",
  "question": "You need to implement an image gallery with lazy loading and infinite scroll. How would you detect when new images need to be loaded? What techniques would you use to ensure smooth scrolling performance?",
  "difficulty": "EASY",
  "skills": ["Performance", "Lazy Loading", "Intersection Observer", "Rendering"],
  "estimatedTime": "2-4 min",
  "guidance": {
    "keyPoints": [
      "Intersection Observer API detects when a sentinel element enters the viewport to trigger loading more items",
      "Native lazy loading via loading='lazy' attribute on img tags defers off-screen image downloads",
      "Use placeholder/skeleton elements sized to the image aspect ratio to prevent layout shift (CLS)",
      "Throttle or debounce scroll handlers if not using Intersection Observer (which is callback-based and efficient)",
      "Clear out-of-view images by replacing src with placeholder or using canvas to free memory",
      "Consider virtualizing the gallery if the user can scroll through thousands of images"
    ],
    "commonMistakes": [
      "Using scroll event listeners for infinite scroll � they fire too often and cause layout thrashing",
      "Not reserving space for images before they load � causes cumulative layout shift (bad CLS score)",
      "Loading full-resolution images for thumbnails � use srcset with multiple resolutions",
      "Forgetting to disconnect the Intersection Observer when the component unmounts"
    ],
    "answerStructure": [
      "Set up the component: grid layout, image cards with aspect-ratio placeholders, sentinel element at bottom",
      "Implement lazy loading: Intersection Observer watches the sentinel, triggers fetch for next page",
      "Implement image lazy loading: loading='lazy' on img, blur-up placeholder or skeleton while loading",
      "Handle loading states: show skeleton grid, track which images have loaded, handle errors gracefully",
      "Optimize performance: use CSS will-change, hardware-accelerate transforms, debounce re-layout on resize",
      "Discuss edge cases: no more pages (remove sentinel), network failure, rapid scrolling past many images"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "JUNIOR",
  "category": "PROBLEM_SOLVING",
  "question": "Build a custom hook that debounces a value. What happens if the callback is called during cleanup? How would you handle the case where the component unmounts before the debounced value is updated?",
  "difficulty": "EASY",
  "skills": ["Custom Hooks", "Debouncing", "Cleanup", "React"],
  "estimatedTime": "2-4 min",
  "guidance": {
    "keyPoints": [
      "A debounce hook delays updating a value until a specified time has elapsed since the last change",
      "Use setTimeout and clearTimeout to implement the delay and reset mechanism",
      "The cleanup function in useEffect clears the pending timeout when dependencies change or component unmounts",
      "Use useRef to store the timer ID across renders without causing re-renders",
      "A canceled debounce should not update state after unmount � check mounted state or use an abort pattern",
      "Consider providing a useDebouncedCallback variant that debounces the function itself, not just the value"
    ],
    "commonMistakes": [
      "Creating a new timeout ref on every render instead of persisting it in a ref",
      "Not cleaning up the timeout on unmount � causes state updates on unmounted component (React warning)",
      "Debouncing inside the render function instead of in a useEffect � blocks rendering",
      "Not considering that the initial value should be available immediately, not debounced"
    ],
    "answerStructure": [
      "Define the hook signature: useDebounce(value, delay)",
      "Implement: useRef for timer, useState for debounced value, useEffect watches value and delay",
      "In the effect: clear previous timer, set new timer that updates state",
      "Cleanup: return clearTimeout from the effect to cancel on unmount or re-render",
      "Handle edge cases: delay of 0 (pass through), delay changes (reset timer), rapid successive changes",
      "Show usage: const debouncedSearch = useDebounce(searchTerm, 300)"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "JUNIOR",
  "category": "PROBLEM_SOLVING",
  "question": "You are building a search results page and need to handle empty states, loading states, error states, and edge cases like network timeout. How would you design the component hierarchy and state machine to handle all these states cleanly?",
  "difficulty": "MEDIUM",
  "skills": ["State Management", "Error Handling", "Component Design", "UX"],
  "estimatedTime": "2-4 min",
  "guidance": {
    "keyPoints": [
      "Model the page as a finite state machine with states: idle, loading, success, empty, error, and timeout",
      "Use a discriminated union type or enum to represent the state rather than multiple boolean flags",
      "Lift state up or use a data fetching library (React Query, SWR) that handles these states out of the box",
      "Each state should render a distinct UI: skeleton/spinner for loading, results list for success, message for empty, error banner for errors",
      "Network timeout requires a distinct state � either a retry button or automatic retry after a delay",
      "Persistence between searches: preserve previous results while loading new ones (stale-while-revalidate)"
    ],
    "commonMistakes": [
      "Using multiple boolean flags (isLoading, isError, isEmpty, isTimeout) leading to impossible state combinations",
      "Clearing results immediately when a new search starts � causes flickering (flash of loading state)",
      "Not distinguishing between initial load (show skeleton) and subsequent searches (keep showing old results)",
      "Handling network timeout the same as a regular error � timeout often needs retry logic, not just a message"
    ],
    "answerStructure": [
      "Define all possible states as a type: idle | loading | success | empty | error | timeout",
      "Design the state reducer or useReducer pattern to transition between states deterministically",
      "Build the component to render based on the current state, with a default case for completeness",
      "Implement transitions: search trigger ? loading, results arrive ? success/empty, error ? error, timeout ? timeout",
      "Add retry logic: separate button for error/timeout, automatic retry with exponential backoff for timeout",
      "Discuss UX: keep previous results visible during re-fetch, use skeleton loading for initial load only"
    ]
  }
})

# ============================================================
# JUNIOR x BEHAVIORAL (8 questions)
# ============================================================

q({
  "role": "FRONTEND",
  "level": "JUNIOR",
  "category": "BEHAVIORAL",
  "question": "Tell me about a time you disagreed with a teammate about a technical approach. How did you handle the disagreement and what was the outcome?",
  "difficulty": "EASY",
  "skills": ["Communication", "Collaboration", "Conflict Resolution"],
  "estimatedTime": "2-4 min",
  "guidance": {
    "keyPoints": [
      "Disagreements should focus on technical trade-offs, not personal preferences",
      "Data and evidence (benchmarks, bundle size analysis, user impact) are more persuasive than opinions",
      "Understanding the teammate's perspective reveals constraints or knowledge you might not have considered",
      "A healthy disagreement can lead to a better solution than either original proposal",
      "Knowing when to escalate vs when to compromise is a crucial skill",
      "Documenting the decision and its rationale prevents future re-litigation"
    ],
    "commonMistakes": [
      "Making the disagreement personal or adversarial instead of focusing on the problem",
      "Refusing to budge when the other approach is equally valid or better",
      "Going directly to a manager instead of trying to resolve peer-to-peer first",
      "Letting the disagreement fester unresolved � agreeing to disagree without a decision path"
    ],
    "answerStructure": [
      "Set context: what project, what was the technical decision at hand",
      "Describe both positions: what you proposed, what your teammate proposed, and the reasoning behind each",
      "Explain the resolution process: did you discuss trade-offs, build prototypes, gather data?",
      "Describe the outcome: which approach was chosen and why",
      "Reflect on what you learned: about the technology, about collaboration, about yourself",
      "Mention if you would handle it differently in retrospect"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "JUNIOR",
  "category": "BEHAVIORAL",
  "question": "Describe a project or feature you built that you are particularly proud of. What was your role, what challenges did you face, and what did you learn from the experience?",
  "difficulty": "EASY",
  "skills": ["Project Execution", "Ownership", "Problem Solving"],
  "estimatedTime": "2-4 min",
  "guidance": {
    "keyPoints": [
      "Focus on your specific contribution, not just what the team accomplished",
      "Describe challenges that required genuine problem-solving, not just routine implementation",
      "Connect the technical work to business or user impact",
      "Mention trade-offs you considered and why you made the decisions you did",
      "Show growth: what did you learn or how did you improve as an engineer?",
      "Be honest about things that did not go perfectly � self-awareness is valued"
    ],
    "commonMistakes": [
      "Taking credit for team accomplishments without acknowledging collaborators",
      "Describing a project with no obstacles or challenges � sounds rehearsed or inflated",
      "Focusing only on the technology without mentioning the problem it solved",
      "Not being able to articulate what you specifically did vs what others on the team did"
    ],
    "answerStructure": [
      "Introduce the project: what was the goal, who was on the team, what was your role",
      "Describe the key challenge: technical difficulty, timeline pressure, ambiguous requirements, etc.",
      "Explain your approach: what did you build, what decisions did you make, and why",
      "Highlight specific contributions: architecture, implementation, testing, or coordination",
      "Share the outcome: metrics, user feedback, team impact, or personal growth",
      "Conclude with what you would do differently or what you would carry forward"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "JUNIOR",
  "category": "BEHAVIORAL",
  "question": "How do you stay current with frontend technologies and best practices? Give specific examples of how you have applied something you learned recently to your work.",
  "difficulty": "EASY",
  "skills": ["Learning", "Growth Mindset", "Self-Improvement"],
  "estimatedTime": "2-4 min",
  "guidance": {
    "keyPoints": [
      "Frontend evolves rapidly � demonstrating a systematic learning approach is more important than knowing everything",
      "Balance depth and breadth: deep dive into technologies you use, broader awareness of the ecosystem",
      "Learning should translate to action: building side projects, contributing to open source, writing about what you learn",
      "Knowing when NOT to adopt a new technology is as important as knowing when to adopt it",
      "Multiple learning sources: documentation, conference talks, blogs, podcasts, open source code, mentorship",
      "Applying new knowledge incrementally: small experiments, low-risk features, internal tools before production"
    ],
    "commonMistakes": [
      "Listing technologies without showing how you have applied them",
      "Grazing headlines without deep understanding � knowing every framework name but none in depth",
      "Following hype without critical evaluation � not every new tool deserves your team adoption",
      "Learning in isolation � not sharing knowledge with the team or getting feedback"
    ],
    "answerStructure": [
      "Describe your learning channels: specific newsletters, blogs, conferences, or learning platforms",
      "Give a concrete example of a technology/concept you recently learned deeply",
      "Explain why it caught your interest: solved a problem, filled a knowledge gap, ecosystem trend",
      "Describe how you applied it: side project, experimental PR, production feature, internal tool",
      "Share the outcome: did it work well? Would you use it again? What did you learn beyond the surface?",
      "Reflect on your learning philosophy: how do you decide what to invest time in?"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "JUNIOR",
  "category": "BEHAVIORAL",
  "question": "Tell me about a time you received constructive criticism about your code or approach. How did you react and what did you do differently as a result?",
  "difficulty": "MEDIUM",
  "skills": ["Feedback", "Growth", "Professionalism", "Humility"],
  "estimatedTime": "2-4 min",
  "guidance": {
    "keyPoints": [
      "Receiving feedback well is a sign of professional maturity and growth mindset",
      "The initial reaction (defensive vs receptive) matters as much as what you do with the feedback",
      "Ask clarifying questions to understand the reasoning behind the feedback, not to challenge it",
      "Good feedback is about the code/approach, not about you as a person � detaching ego is crucial",
      "Following up shows you took it seriously and value the other person input",
      "Not all feedback is equally valid � learning to evaluate and filter is a skill"
    ],
    "commonMistakes": [
      "Getting defensive or making excuses instead of listening",
      "Accepting all feedback without understanding the reasoning behind it",
      "Ignoring the feedback after the conversation instead of acting on it",
      "Taking feedback personally rather than professionally"
    ],
    "answerStructure": [
      "Set context: what was the situation (code review, 1:1, design discussion)?",
      "Describe the feedback: what was said and who gave it",
      "Describe your initial reaction: honest about any defensiveness, then how you reframed it",
      "Explain what you did: specific changes you made, questions you asked, patterns you adopted",
      "Share the outcome: improved code, better working relationship, new habit you developed",
      "Reflect on how you approach feedback now: do you actively seek it? How has your mindset changed?"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "JUNIOR",
  "category": "BEHAVIORAL",
  "question": "Describe a situation where you had to learn a new technology or framework quickly to complete a task. How did you approach learning it and what was the result?",
  "difficulty": "EASY",
  "skills": ["Learning", "Adaptability", "Time Management"],
  "estimatedTime": "2-4 min",
  "guidance": {
    "keyPoints": [
      "Rapid learning requires focused goals � do not learn everything, learn what you need for the task",
      "Use official documentation as the primary source, supplemented by tutorials and examples",
      "Build a small prototype to validate understanding before committing to the full implementation",
      "Leverage existing knowledge � most frameworks share common patterns (components, state, routing)",
      "Pair with someone who knows the technology if available � fastest way to get unstuck",
      "Balance speed and depth: you need to move fast but not create a maintenance nightmare"
    ],
    "commonMistakes": [
      "Trying to learn everything before starting � leads to analysis paralysis",
      "Relying solely on tutorials and blog posts without reading the official docs",
      "Not asking for help when stuck � wasting hours that a quick question could save",
      "Copy-pasting code without understanding it � creates fragile, unmaintainable results"
    ],
    "answerStructure": [
      "Set context: what was the task and why was a new technology needed?",
      "Describe your learning approach: what resources did you use, what was your process?",
      "Explain how you applied the learning: prototype, pair programming, incremental adoption",
      "Discuss challenges: what was confusing, how did you overcome it?",
      "Share the outcome: did you deliver on time? How did the technology choice work out?",
      "Reflect: would you approach learning differently next time? What did you learn about learning?"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "JUNIOR",
  "category": "BEHAVIORAL",
  "question": "Tell me about a time you made a mistake that impacted users or your team. How did you handle it and what did you do to prevent it from happening again?",
  "difficulty": "EASY",
  "skills": ["Accountability", "Problem Solving", "Ownership"],
  "estimatedTime": "2-4 min",
  "guidance": {
    "keyPoints": [
      "How you handle mistakes matters more than the mistake itself � owning it builds trust",
      "Immediate response: acknowledge, communicate to stakeholders, fix or roll back",
      "Root cause analysis should focus on systemic issues, not just individual blame",
      "Prevention: adding tests, improving review processes, better tooling, or documentation",
      "Transparency with users builds credibility � hiding mistakes erodes trust permanently",
      "A culture that punishes mistakes breeds cover-ups � a culture that learns from them breeds improvement"
    ],
    "commonMistakes": [
      "Blaming others or external factors instead of owning the mistake",
      "Overcorrecting with overly restrictive processes that slow the entire team",
      "Fixing the symptom instead of the root cause � same mistake happens again in a different form",
      "Downplaying the impact to make yourself look better � interviewers can tell"
    ],
    "answerStructure": [
      "Describe the mistake: what happened, what was the impact, who was affected",
      "Explain your immediate response: did you catch it or was it reported? How did you respond?",
      "Describe the fix: what did you do to resolve the issue?",
      "Explain root cause analysis: why did it happen? What systemic gap existed?",
      "Detail the prevention: specific changes to process, tooling, tests, or documentation",
      "Reflect on how the experience changed your approach to quality and risk"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "JUNIOR",
  "category": "BEHAVIORAL",
  "question": "How do you approach testing your frontend code? Walk me through your decision process for what to unit test, what to integration test, and what to test manually.",
  "difficulty": "MEDIUM",
  "skills": ["Testing", "Quality Assurance", "Strategy"],
  "estimatedTime": "2-4 min",
  "guidance": {
    "keyPoints": [
      "The testing trophy (preferred over pyramid for frontend): static analysis ? unit tests ? integration tests ? E2E tests",
      "Unit tests cover pure logic: utility functions, hooks, reducers, formatting, validation rules",
      "Integration tests cover component behavior: user interactions, state changes, API call scenarios",
      "E2E tests cover critical user journeys: login, checkout, search � slow but high confidence",
      "Manual testing covers visual aspects: layout, animation, responsive design, cross-browser compatibility",
      "Testing strategy should balance confidence vs cost � E2E is expensive, unit is cheap, integration is the sweet spot"
    ],
    "commonMistakes": [
      "Testing implementation details instead of behavior � tests break on refactors",
      "Over-mocking � tests pass but do not test real integration points",
      "Only testing the happy path � error states and edge cases are where bugs live",
      "Writing too many E2E tests � they are slow, flaky, and expensive to maintain"
    ],
    "answerStructure": [
      "Describe your testing philosophy: what level of confidence do you need and at what cost?",
      "Explain what you unit test: pure functions, utils, validation, complex logic � with examples",
      "Explain what you integration test: component interactions, data flow, user scenarios � with examples",
      "Explain what you E2E test: critical paths � login, purchase, core workflows",
      "Explain what you manually test: visual layout, animations, responsive design, browser quirks",
      "Discuss how you decide: risk assessment, user impact, complexity, and flakiness of tests"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "JUNIOR",
  "category": "BEHAVIORAL",
  "question": "Describe a time you helped a teammate who was struggling with a task. How did you approach the situation without taking over or making them feel inadequate?",
  "difficulty": "EASY",
  "skills": ["Mentorship", "Collaboration", "Empathy", "Communication"],
  "estimatedTime": "2-4 min",
  "guidance": {
    "keyPoints": [
      "Effective help empowers the teammate to solve the problem themselves, not just giving the answer",
      "Ask questions to understand their current thinking before jumping in with solutions",
      "Explain the reasoning behind the approach, not just the approach itself",
      "Let them drive the keyboard/code � watching is more educational than being told",
      "Follow up later to reinforce learning and ensure they did not get stuck again",
      "Knowing when to step in (they are stuck for too long) vs when to let them struggle productively"
    ],
    "commonMistakes": [
      "Taking over the keyboard and solving it for them � they learn nothing and feel worse",
      "Making them feel foolish for not knowing something � kills psychological safety",
      "Giving the answer directly without explaining the underlying concepts",
      "Not following up � they might have implemented the solution without understanding it"
    ],
    "answerStructure": [
      "Set context: what was the situation, who was the teammate, what were they struggling with?",
      "Describe your approach: how did you initiate the conversation, what questions did you ask?",
      "Explain the interaction: did you pair program, review their code, walk through documentation together?",
      "Describe the outcome: did they complete the task? Did they understand the underlying concept?",
      "Reflect on the relationship: did this strengthen your working relationship?",
      "What did you learn about mentoring from this experience?"
    ]
  }
})

# ============================================================
# MID x TECHNICAL (8 questions)
# ============================================================

q({
  "role": "FRONTEND",
  "level": "MID",
  "category": "TECHNICAL",
  "question": "Explain how React's useState hook works under the hood. How does React track the order of hook calls across renders? What happens in the mount phase versus the update phase internally?",
  "difficulty": "MEDIUM",
  "skills": ["React", "Hooks", "Internals", "Fiber"],
  "estimatedTime": "3-5 min",
  "guidance": {
    "keyPoints": [
      "Each component has a Fiber node that stores a linked list of hooks (the hook chain)",
      "On mount, useState creates a hook object with initial state and links it to the Fiber's memoizedState chain",
      "The order of hook calls determines their position in the linked list � calling order must be stable across renders",
      "On update, React walks the same hook chain in order, comparing the current and next values",
      "The state updater function (setState) schedules a re-render by pushing the Fiber into the update queue",
      "React uses the alternate Fiber tree to compare current state with pending updates and compute the new state"
    ],
    "commonMistakes": [
      "Placing hooks inside conditionals, loops, or early returns � breaks the stable call order assumption",
      "Thinking useState stores the state value on the component instance � it is stored in the Fiber hook chain",
      "Assuming calling setState immediately updates the state variable � it schedules a re-render",
      "Confusing the mount-phase initialization with the update-phase reconciliation of hook state"
    ],
    "answerStructure": [
      "Explain the Fiber architecture: each component instance has a Fiber node",
      "Describe the hook chain: Fiber.memoizedState is a linked list of hook objects",
      "Walk through mount: create hook object, store initial value, append to chain",
      "Walk through update: walk the chain to find matching hook, compare pending update queue",
      "Explain the Rules of Hooks: stable call order is required because React uses positional matching",
      "Describe how state updates are queued: setState ? enqueueUpdate ? scheduleRender"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "MID",
  "category": "TECHNICAL",
  "question": "Describe how React's useEffect hook works internally. What is the cleanup function and when does it execute? How does React determine when to re-run the effect based on the dependency array? Compare with useLayoutEffect.",
  "difficulty": "MEDIUM",
  "skills": ["React", "useEffect", "Lifecycle", "Fiber"],
  "estimatedTime": "3-5 min",
  "guidance": {
    "keyPoints": [
      "useEffect schedules a side effect to run after the browser has painted (asynchronous, non-blocking)",
      "The dependency array uses Object.is comparison to detect changes between renders",
      "Omitting the dependency array runs the effect on every render; an empty array runs it only on mount",
      "The cleanup function from the previous effect runs before the next effect, and on unmount",
      "useLayoutEffect runs synchronously after DOM mutations but before the browser paints",
      "Both useEffect and useLayoutEffect store their effects in the Fiber's updateQueue, but with different flags"
    ],
    "commonMistakes": [
      "Not including all dependencies � leads to stale closures and references to outdated values",
      "Including unnecessary dependencies � causes excessive effect re-runs",
      "Using useEffect for layout calculations � causes visible flicker; use useLayoutEffect instead",
      "Forgetting that the cleanup function runs on every re-render (before the new effect), not just on unmount"
    ],
    "answerStructure": [
      "Explain hook creation: useEffect creates an effect object with create function, destroy function, and deps",
      "Describe the commit phase: React processes effects after the DOM update, splitting into layout effects and passive effects",
      "Explain dependency comparison: React stores previous deps on the hook object and compares with Object.is",
      "Describe effect execution order: cleanup previous ? run new effect (passive effects run after paint)",
      "Contrast with useLayoutEffect: same mechanism but runs synchronously in the commit phase before paint",
      "Discuss the eslint-plugin-react-hooks exhaustive-deps rule and why it is critical"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "MID",
  "category": "TECHNICAL",
  "question": "Explain how code splitting works with dynamic imports in modern bundlers. How does webpack split chunks, what is the chunk graph, and how are dependencies shared between entry points? How does React.lazy leverage this mechanism?",
  "difficulty": "MEDIUM",
  "skills": ["Webpack", "Code Splitting", "Lazy Loading", "Chunking"],
  "estimatedTime": "3-5 min",
  "guidance": {
    "keyPoints": [
      "Dynamic import() creates a split point in webpack � the imported module becomes a separate async chunk",
      "Webpack builds a module graph from entry points and uses SplitChunksPlugin to optimize chunk splitting",
      "The chunk graph determines which modules end up in which chunks based on import relationships",
      "Common dependencies are extracted into shared chunks to prevent duplication across entries",
      "React.lazy wraps a dynamic import() and returns a component that suspends until the chunk loads",
      "The Suspense component shows a fallback while the lazy chunk is being fetched and parsed"
    ],
    "commonMistakes": [
      "Code splitting at too granular a level � each component a separate chunk creates excessive HTTP requests",
      "Not sharing vendor code � duplicate React instances in every chunk (use SplitChunks cacheGroups)",
      "Forgetting to handle loading and error states for lazy-loaded chunks",
      "Assuming code splitting is free � there is a parsing and execution cost when the chunk loads"
    ],
    "answerStructure": [
      "Explain dynamic import syntax: import('module') returns a Promise of the module",
      "Describe webpack handling: the import() call creates an async chunk with a unique chunk ID",
      "Explain the chunk graph: entry chunks, async chunks, and shared vendor chunks created by SplitChunksPlugin",
      "Discuss shared dependency deduplication: how SplitChunks identifies common modules and extracts them",
      "Show React.lazy usage: const LazyComponent = React.lazy(() => import('./Component'))",
      "Discuss trade-offs: smaller initial bundles vs more network requests, preloading strategies for critical chunks"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "MID",
  "category": "TECHNICAL",
  "question": "How does tree shaking work in modern bundlers like webpack and Rollup? What conditions must be met for tree shaking to be effective? Why does importing from a barrel file or having side effects break tree shaking?",
  "difficulty": "HARD",
  "skills": ["Webpack", "Tree Shaking", "Bundle Optimization", "ES Modules"],
  "estimatedTime": "3-5 min",
  "guidance": {
    "keyPoints": [
      "Tree shaking relies on ES module static analysis � import/export are syntactically fixed, not runtime-dynamic",
      "The bundler marks exported bindings as used or unused during module graph traversal",
      "Unused exports are removed during minification (Terser) � the bundler marks them, the minifier eliminates them",
      "Side effects in package.json tell the bundler whether a module has side effects or can be safely removed",
      "Barrel files re-export from multiple modules � the bundler conservatively includes all re-exports because it cannot statically analyze through the barrel",
      "CommonJS require() cannot be tree-shaken because imports are dynamic and conditional at runtime"
    ],
    "commonMistakes": [
      "Not setting sideEffects: false in package.json � the bundler assumes all modules have side effects",
      "Using barrel files (index.js re-exports) that defeat tree shaking � import directly from the leaf module",
      "Assuming tree shaking eliminates all unused code � it only removes exports, not module-level statements",
      "Thinking tree shaking works with CommonJS � it only works with ES module syntax"
    ],
    "answerStructure": [
      "Define tree shaking: dead code elimination for ES module exports",
      "Explain static analysis: the bundler builds a module graph and marks export usage",
      "Describe the two-phase process: bundler marks unused exports, minifier removes dead code",
      "Explain the side effects flag: 'sideEffects: false' or 'sideEffects: [list]' in package.json",
      "Discuss why barrel files break it: re-exports chain creates ambiguity for the static analyzer",
      "Recommend best practices: direct imports, sideEffects flag, avoid CommonJS, use webpack's usedExports: true"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "MID",
  "category": "TECHNICAL",
  "question": "Compare and contrast Context API vs Redux vs Zustand for state management. Under what conditions does each solution cause unnecessary re-renders? How do they handle state selectors and subscriptions internally?",
  "difficulty": "MEDIUM",
  "skills": ["State Management", "React Context", "Redux", "Zustand", "Performance"],
  "estimatedTime": "3-5 min",
  "guidance": {
    "keyPoints": [
      "Context API re-renders all consumers when ANY part of the context value changes, even with useMemo",
      "Redux uses a subscription model with selectors � only components subscribed to changed state slices re-render",
      "Zustand uses external store with selector subscriptions � components only re-render when their selected state changes",
      "Context API has no built-in selector mechanism � every consumer gets the full context value",
      "Redux uses shallow equality checking in useSelector by default � objects/arrays can cause false positives",
      "Zustand uses Object.is comparison by default and supports custom equality functions on selectors"
    ],
    "commonMistakes": [
      "Putting frequently changing values in Context � causes cascading re-renders across the entire tree",
      "Not memoizing the context value object � creates a new reference every render, causing infinite re-renders",
      "Using Context for server state when a dedicated solution (React Query, SWR) would handle caching and deduplication",
      "Over-engineering with Redux for simple state that could be local or lifted a few levels"
    ],
    "answerStructure": [
      "Compare the underlying mechanisms: Context (propagation via tree), Redux (external subscriptions with dispatch), Zustand (external store with selector subscriptions)",
      "Explain re-render behavior: Context re-renders all consumers, Redux/Zustand only re-render subscribed components",
      "Describe selector implementation: Redux's useSelector runs selector after every dispatch, Zustand's useStore runs selector after every state change",
      "Discuss performance optimization: React.memo, useShallow for Zustand, createSelector for Redux",
      "Provide decision criteria: app size, update frequency, dev tools needs, bundle size impact",
      "Discuss migration path: start with local state ? lift state ? Context ? Zustand/Redux as complexity grows"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "MID",
  "category": "TECHNICAL",
  "question": "What is the testing trophy and how does it guide your testing strategy? Compare unit tests vs integration tests vs E2E tests for frontend applications. What are the costs and benefits of each, and how do you decide what to test at each level?",
  "difficulty": "MEDIUM",
  "skills": ["Testing", "Quality", "Strategy", "Testing Trophy"],
  "estimatedTime": "3-5 min",
  "guidance": {
    "keyPoints": [
      "The testing trophy (Kent C. Dodds) prioritizes integration tests over unit tests for frontend apps",
      "Integration tests give the most confidence-per-effort by testing how components work together",
      "Unit tests are cheap but test isolated logic � valuable for complex pure functions and utilities",
      "E2E tests provide the highest confidence but are slow, flaky, and expensive to maintain",
      "Static analysis (TypeScript, ESLint) catches type errors and basic bugs at zero runtime cost",
      "The ideal strategy invests most effort in integration tests, with targeted unit and E2E tests"
    ],
    "commonMistakes": [
      "Writing too many unit tests with heavy mocking � tests pass but real integration points are untested",
      "Over-relying on E2E tests � slow feedback loop, flaky CI, high maintenance burden",
      "Testing implementation details � refactoring breaks tests even when behavior is correct",
      "Having no clear strategy � testing randomly based on what is easy rather than what provides value"
    ],
    "answerStructure": [
      "Describe the testing trophy: static > unit > integration > E2E (size represents investment)",
      "Explain static analysis: TypeScript types, ESLint rules, code formatting � zero runtime cost",
      "Detail unit tests: fast, isolated, great for pure functions/utilities, but test implementation not behavior",
      "Detail integration tests: render components, simulate interactions, test real behavior � highest ROI",
      "Detail E2E tests: full system, critical user journeys, realistic but slow and flaky",
      "Provide a decision framework: test behavior not implementation, prefer integration, use E2E sparingly"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "MID",
  "category": "TECHNICAL",
  "question": "Explain ARIA roles, states, and properties in depth. How do screen readers use these to convey UI information to users? What are the pitfalls of using ARIA incorrectly � such as redundant roles, missing required parent-child relationships, or conflicting semantics?",
  "difficulty": "MEDIUM",
  "skills": ["Accessibility", "ARIA", "Screen Readers", "Semantic HTML"],
  "estimatedTime": "3-5 min",
  "guidance": {
    "keyPoints": [
      "ARIA roles define the type of widget (role='button', role='tab') and override native semantics",
      "ARIA states are dynamic values that change with user interaction (aria-expanded, aria-pressed)",
      "ARIA properties describe characteristics (aria-label, aria-describedby, aria-controls)",
      "Screen readers use the accessibility tree (derived from DOM + ARIA) to navigate and announce content",
      "The first rule of ARIA: do not use ARIA if a native HTML element provides the semantics and behavior",
      "ARIA roles have required and implicit attributes � missing aria-controls on a combobox breaks the pattern"
    ],
    "commonMistakes": [
      "Using role='button' on a div instead of using a native button � loses keyboard behavior and focus",
      "Applying ARIA roles that conflict with native semantics (role='heading' on an h1)",
      "Missing required parent-child relationships (role='option' must be inside role='listbox')",
      "Over-announcing: using aria-live='assertive' for non-critical updates that should be 'polite'"
    ],
    "answerStructure": [
      "Define the three ARIA pillars: roles (what is it), states (what is its current condition), properties (what are its characteristics)",
      "Explain the accessibility tree: how browsers expose ARIA-enhanced semantics to assistive technology",
      "Discuss role taxonomy: widget roles, composite roles, document structure roles, landmark roles",
      "Explain the ARIA authoring practices: required context, keyboard interactions, focus management",
      "Provide examples of correct ARIA usage: combobox, tabpanel, dialog, alert",
      "Discuss pitfalls: redundant ARIA, missing required attributes, broken keyboard navigation, dynamic content not being announced"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "MID",
  "category": "TECHNICAL",
  "question": "Compare BEM, CSS Modules, CSS-in-JS (styled-components), and utility-first CSS (Tailwind). What problems does each approach solve and what trade-offs do they introduce in terms of runtime performance, developer experience, and bundle size?",
  "difficulty": "MEDIUM",
  "skills": ["CSS Architecture", "BEM", "CSS-in-JS", "Tailwind", "Performance"],
  "estimatedTime": "3-5 min",
  "guidance": {
    "keyPoints": [
      "BEM solves specificity conflicts with a naming convention but relies on developer discipline and verbose class names",
      "CSS Modules provide scoped class names via build-time rewriting � no runtime cost, native CSS output",
      "CSS-in-JS (styled-components) offers dynamic styling at the cost of runtime CSS generation and bundle size",
      "Utility-first (Tailwind) provides a design system as reusable classes � excellent DX but verbose HTML and requires tooling",
      "Runtime CSS-in-JS libraries inject styles during component mount, impacting performance for large apps",
      "Zero-runtime CSS-in-JS (Linaria, vanilla-extract) compiles to static CSS at build time, combining scoping with no runtime cost"
    ],
    "commonMistakes": [
      "Assuming all CSS-in-JS approaches have the same performance characteristics � runtime vs zero-runtime differ vastly",
      "Using Tailwind without a design system/tokens � leads to inconsistent spacing and colors despite utility classes",
      "Mixing multiple CSS methodologies in the same project � creates confusion and inconsistent styling patterns",
      "Not considering code-splitting implications � CSS-in-JS bundles styles with components, Tailwind generates a single monolithic CSS file"
    ],
    "answerStructure": [
      "Introduce the fundamental CSS problems: global scope, specificity wars, dead code elimination, dynamic styling",
      "Describe BEM: naming convention (Block__Element--Modifier), solves specificity via flat selectors, no tooling needed",
      "Describe CSS Modules: build-time scoping, generated unique class names, works with regular CSS syntax",
      "Describe CSS-in-JS: colocation, dynamic props, runtime cost, theming via context/Provider",
      "Describe utility-first: constraints-based design, small CSS file, verbose HTML, great for rapid prototyping",
      "Evaluate trade-offs across: runtime performance, bundle size, developer experience, scalability, learning curve"
    ]
  }
})

# ============================================================
# MID x PROBLEM_SOLVING (8 questions)
# ============================================================

q({
  "role": "FRONTEND",
  "level": "MID",
  "category": "PROBLEM_SOLVING",
  "question": "Design a real-time notification system for a dashboard that shows toast notifications, a notification center, and unread counts. How would you handle WebSocket reconnection, notification deduplication, and marking notifications as read?",
  "difficulty": "MEDIUM",
  "skills": ["Real-time", "System Design", "WebSockets", "State Management"],
  "estimatedTime": "3-5 min",
  "guidance": {
    "keyPoints": [
      "WebSocket reconnection requires exponential backoff with jitter to avoid thundering herd on the server",
      "Notification deduplication needs a unique ID (UUID) on each notification � use a Set or Map to filter duplicates",
      "Unread count is derived state: count notifications where readAt is null, updated optimistically on read",
      "Toast notifications should have a timeout queue with configurable duration, pause on hover, and manual dismiss",
      "The notification center fetches historical notifications via REST/GraphQL with pagination, while real-time updates come via WebSocket",
      "Marking as read should use optimistic UI � update the UI immediately, send API call in background"
    ],
    "commonMistakes": [
      "Reconnecting immediately on disconnect without backoff � hammers the server during an outage",
      "Storing notifications only in memory � lost on page refresh; persist to localStorage or IndexedDB",
      "Not handling the case where WebSocket delivers a notification already fetched via REST (duplicate)",
      "Showing toast notifications for every notification type � some should only appear in the notification center"
    ],
    "answerStructure": [
      "Define the data model: notification { id, type, title, body, readAt, createdAt, metadata }",
      "Design the real-time connection: WebSocket with reconnection (exponential backoff, max retries, jitter)",
      "Design the notification center: paginated list, infinite scroll or load more, mark all as read",
      "Design toast notifications: queue with max visible, auto-dismiss timers, pause on hover, manual dismiss",
      "Implement deduplication: use notification ID in a Set, skip if already received",
      "Discuss unread count: derive from notification list, update locally on read, sync with server periodically"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "MID",
  "category": "PROBLEM_SOLVING",
  "question": "Design a virtual scrolling list that can handle 100,000 items efficiently. How would you calculate which items to render, manage item heights (variable vs fixed), and handle smooth scrolling? What happens when the user is at the end and new items are added?",
  "difficulty": "HARD",
  "skills": ["Virtualization", "Performance", "Rendering", "Scroll"],
  "estimatedTime": "3-5 min",
  "guidance": {
    "keyPoints": [
      "Virtual scrolling renders only the visible items plus a buffer above and below (overscan)",
      "Fixed item heights allow O(1) calculation of scroll position to item index mapping",
      "Variable item heights require an estimated height, then recalculating actual positions after render",
      "A sentinel element at the top (padding) and bottom simulates the full list height without rendering all items",
      "Smooth scrolling at 60fps requires avoiding layout thrashing � batch DOM reads/writes, use transform for positioning",
      "When new items are appended at the end, maintain scroll position unless the user is near the bottom"
    ],
    "commonMistakes": [
      "Using the scroll event directly without throttling � Intersection Observer or passive scroll listeners are better",
      "Assuming all items have the same height � variable heights cause the scroll position to jump",
      "Not handling items being added or removed from the beginning � causes scroll position to drift",
      "Rendering too many overscan items � defeats the purpose of virtualization; too few causes blank flashes during fast scroll"
    ],
    "answerStructure": [
      "Explain the core concept: only render items in the visible viewport + overscan buffer",
      "Describe fixed-height implementation: total height = itemCount * itemHeight, calculate visible range from scrollTop",
      "Describe variable-height implementation: estimate average height initially, measure actual heights after first render, maintain a list of measured positions",
      "Explain overscan: render extra items above and below the visible area to prevent blank flashes during fast scrolling",
      "Discuss smooth scrolling: requestAnimationFrame, passive scroll listeners, avoid forced reflow",
      "Handle edge cases: dynamic item count, items added/removed mid-list, keyboard navigation, focus management"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "MID",
  "category": "PROBLEM_SOLVING",
  "question": "Design a dynamic form builder where users can drag-and-drop fields, configure validation rules, and preview the form. How would you manage the form schema, handle nested fields, and ensure the builder is performant with complex forms?",
  "difficulty": "MEDIUM",
  "skills": ["Form Builder", "Dynamic UI", "Schema Design", "Drag and Drop"],
  "estimatedTime": "3-5 min",
  "guidance": {
    "keyPoints": [
      "The form schema should be a JSON tree where each field node has type, id, props, validation, and children",
      "Use a drag-and-drop library (dnd-kit, react-beautiful-dnd) that handles accessibility, touch, and keyboard reordering",
      "Field configuration should use a panel/selection pattern: palette of field types ? canvas for layout ? properties panel for configuration",
      "Nested fields (groups, repeaters) need recursive rendering � the field component renders itself for children",
      "Validation rules should be composable: each field can have an array of validators with parameters (required, minLength, pattern, custom)",
      "Performance optimization: memoize the schema tree traversal, only re-render affected fields on change, virtualize the field list for large forms"
    ],
    "commonMistakes": [
      "Storing the schema as a flat list with parent references � makes nesting and reordering complex",
      "Mutating the schema in place � breaks undo/redo and causes stale references",
      "Not normalizing the schema � deeply nested changes trigger full tree re-renders",
      "Allowing invalid schema states � fields being dropped into invalid parents creates corrupted forms"
    ],
    "answerStructure": [
      "Define the schema structure: recursive tree with field types (text, number, select, group, repeater, etc.)",
      "Design the builder layout: palette (available fields), canvas (dropped fields with reordering), properties panel (field configuration)",
      "Implement drag-and-drop: allow dragging from palette to canvas, reordering within canvas, nesting into group fields",
      "Implement field configuration: each field type has unique props (options for select, min/max for number, placeholder for text)",
      "Implement validation: validation rules as an array of { type, params, message } objects per field",
      "Discuss performance: use immutable updates with structural sharing, memoize preview render, debounce property changes"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "MID",
  "category": "PROBLEM_SOLVING",
  "question": "Design a role-based access control (RBAC) system for the frontend. How would you structure permissions, handle conditional rendering of UI elements, protect routes, and ensure the client-side security model is not bypassed?",
  "difficulty": "MEDIUM",
  "skills": ["RBAC", "Security", "Authorization", "Architecture"],
  "estimatedTime": "3-5 min",
  "guidance": {
    "keyPoints": [
      "Client-side RBAC is a UX convenience, not a security boundary � all server operations must re-verify permissions",
      "Permissions should be structured as a flat set of strings ('user:create', 'report:export') rather than role hierarchies",
      "A custom hook or HOC can check permissions and conditionally render elements, disable buttons, or show/hide sections",
      "Route protection should wrap route components with a permission guard that redirects or shows a 403",
      "Permissions should be fetched as part of the authentication flow and stored in context or a global store",
      "The permission set must be re-fetched when the user roles/permissions change (e.g., admin promotes a user)"
    ],
    "commonMistakes": [
      "Using role-based checks (isAdmin) instead of permission-based checks (canDeleteUser) � roles are too coarse",
      "Only hiding UI elements without disabling them � users can trigger actions via the browser console",
      "Storing permissions in localStorage without verifying on the server � stale permissions on page load",
      "Not considering race conditions � permission changes during an active session can leave stale UI state"
    ],
    "answerStructure": [
      "Define the permission model: flat permission strings, roles as groups of permissions, user has one or more roles",
      "Design the auth context: current user object with resolved permissions array",
      "Implement permission checking: can(permission) function that checks the permission set",
      "Implement conditional rendering: <Can I='user:edit'> component or usePermission hook",
      "Implement route protection: ProtectedRoute component checks permission and redirects to login or 403",
      "Discuss security: emphasize that client-side checks are UX only, server must re-verify every operation"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "MID",
  "category": "PROBLEM_SOLVING",
  "question": "Design a client-side caching strategy for API data. How would you implement stale-while-revalidate, cache invalidation, optimistic updates, and optimistic UI rollback? What caching library would you use and why?",
  "difficulty": "HARD",
  "skills": ["Caching", "Data Fetching", "Optimistic Updates", "React Query"],
  "estimatedTime": "3-5 min",
  "guidance": {
    "keyPoints": [
      "Stale-while-revalidate returns cached data immediately and re-fetches in the background for fresh data",
      "Cache invalidation is the hardest problem � invalidate by entity (e.g., all queries with ['users']) not by endpoint URL",
      "Optimistic updates apply the expected new state immediately and roll back if the server rejects the mutation",
      "Rollback needs a snapshot of the previous state before applying the optimistic update",
      "React Query handles all of these out of the box: staleTime, cacheTime, query invalidation, optimistic updates via onMutate",
      "SWR is lighter than React Query but has fewer features for mutations and cache management"
    ],
    "commonMistakes": [
      "Using URL as the cache key instead of structured query keys � makes entity-based invalidation impossible",
      "Not rolling back optimistic updates on server error � UI shows incorrect state",
      "Setting staleTime too high � users see outdated data; too low � defeats caching benefits",
      "Not handling offline scenarios � cache should persist stale data for offline use (backed by localStorage or IndexedDB)"
    ],
    "answerStructure": [
      "Define the caching layers: in-memory cache (fastest), localStorage/IndexedDB (persistent), network (source of truth)",
      "Explain stale-while-revalidate: serve cache ? fetch fresh ? update cache ? re-render",
      "Design query keys: structured keys like ['todos', { status: 'done' }] for granular invalidation",
      "Implement optimistic updates: onMutate ? snapshot old data ? update cache ? onError ? rollback ? onSettled ? refetch",
      "Discuss cache invalidation strategies: time-based (staleTime), mutation-based (invalidate queries on successful mutation), manual (admin actions)",
      "Recommend a library: React Query for most apps, SWR for simpler needs, or a custom hook with useReducer for minimal dependencies"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "MID",
  "category": "PROBLEM_SOLVING",
  "question": "Design a real-time dashboard that displays live metrics with charts that update every second. How would you batch updates, minimize re-renders, and ensure the canvas/SVG rendering does not block the main thread?",
  "difficulty": "MEDIUM",
  "skills": ["Real-time", "Charts", "Performance", "Rendering"],
  "estimatedTime": "3-5 min",
  "guidance": {
    "keyPoints": [
      "Batch incoming data points (e.g., accumulate for 1 second) rather than rendering every individual update",
      "Use requestAnimationFrame to schedule chart redraws, not setInterval � rAF syncs with the display refresh rate",
      "Canvas rendering is faster than SVG for large datasets but has no DOM-level interactivity per data point",
      "Web Workers can process incoming data (aggregation, filtering) without blocking the main thread",
      "Only update the visible viewport of the chart � window large datasets to show only the latest N points",
      "Use a ring buffer data structure to efficiently store and shift time-series data without memory growth"
    ],
    "commonMistakes": [
      "Creating a new chart instance on every update � reuse and mutate the chart data instead",
      "Updating chart data at full WebSocket speed (potentially 100+ updates/sec instead of 1 redraw/sec)",
      "Using SVG for datasets with thousands of points � DOM nodes become too expensive",
      "Not throttling the data flow � the chart library receives more updates than it can render, causing a backlog"
    ],
    "answerStructure": [
      "Design the data pipeline: WebSocket ? data buffer ? batch processing (1s window) ? chart update",
      "Choose the chart architecture: Canvas (Chart.js, uPlot) for >1000 points, SVG (D3, Highcharts) for <1000 points with interactivity",
      "Implement batching: accumulate incoming data points, use rAF to batch-process and redraw once per frame",
      "Optimize data structures: ring buffer for time-series, pre-allocated arrays to avoid GC pressure",
      "Offload computation: Web Worker for data aggregation, filtering, and formatting",
      "Discuss memory management: limit stored history, downsample old data, memory-conscious data structures"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "MID",
  "category": "PROBLEM_SOLVING",
  "question": "Design a multi-step wizard form with conditional branches (step B depends on choice in step A). How would you persist state across steps, handle back/forward navigation, and validate each step independently?",
  "difficulty": "MEDIUM",
  "skills": ["Forms", "State Persistence", "Navigation", "Validation"],
  "estimatedTime": "3-5 min",
  "guidance": {
    "keyPoints": [
      "The wizard state is a single object collecting data from all steps � lifted to the parent wizard component",
      "Each step has its own validation schema � only the current step is validated when moving forward",
      "Back navigation restores the previous step data without re-validation",
      "Conditional branching means the step list is dynamic � future steps depend on earlier choices",
      "State should survive page refreshes via URL params, sessionStorage, or a partial save to the server",
      "Progress indicators should reflect completed steps and allow jumping back to completed steps"
    ],
    "commonMistakes": [
      "Storing step data in individual step components � lost when navigating away",
      "Validating all steps on every step change � should only validate the current step on 'next'",
      "Not preserving state when the user goes back � they expect their previous inputs to be intact",
      "Changing step order dynamically without updating the progress indicator � confuses the user"
    ],
    "answerStructure": [
      "Define the wizard state: { currentStep, steps: [{ id, data, isValid }], allData: merged form state }",
      "Implement step navigation: next ? validate current step ? save data ? advance to next step; back ? restore previous step state",
      "Handle conditional branching: define a step tree or function that returns the next step based on current data",
      "Persist state: URL params for step index, sessionStorage for form data, optional server auto-save",
      "Implement per-step validation: each step has a schema, validate only when moving forward, show errors per-field",
      "Design the progress UI: step labels, current step indicator, completed steps are clickable to go back"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "MID",
  "category": "PROBLEM_SOLVING",
  "question": "Design a drag-and-drop kanban board. How would you handle drag state, detect drop targets, animate reordering, and persist the new order to the server? Consider touch devices and accessibility.",
  "difficulty": "MEDIUM",
  "skills": ["Drag and Drop", "Animation", "State Sync", "Accessibility"],
  "estimatedTime": "3-5 min",
  "guidance": {
    "keyPoints": [
      "Use a DnD library (dnd-kit) that handles pointer, touch, and keyboard drag-and-drop with accessibility built in",
      "Drag state: track the dragged item, source column, and current position in the drag overlay component",
      "Drop target detection: use collision detection algorithms (closest center, closest corners, rectangle intersection)",
      "Animation: the dragged item renders as a portal overlay; dropping animates the item into its new position",
      "Optimistic persistence: update the UI immediately, send the mutation to the server, roll back on failure",
      "Accessibility: drag handles must be focusable, keyboard reordering (Alt+Arrow), screen reader announcements"
    ],
    "commonMistakes": [
      "Implementing drag-and-drop from scratch with mouse/touch events � edge cases are extremely hard (scroll during drag, cancel, file drop)",
      "Not using a portal for the drag overlay � z-index and clipping issues in nested scrollable containers",
      "Animating with CSS transitions on the DOM elements being reordered � leads to visual glitches and layout shifts",
      "Sending the entire board state on every drop � send only the moved item new position (column + index)"
    ],
    "answerStructure": [
      "Define the data model: columns with ordered card IDs, cards with content and metadata",
      "Choose a DnD library: dnd-kit (recommended) for its accessibility, collision detection, and sensor system",
      "Implement drag: drag handle on cards, drag overlay (portal), collision detection to determine drop target",
      "Implement drop: update column order arrays optimistically, animate card into new position",
      "Persist changes: send PATCH with card ID, new column ID, and new position index",
      "Handle accessibility: keyboard drag (Space to pick up, Arrows to move, Space to drop), aria-grabbed, live region announcements"
    ]
  }
})

# ============================================================
# MID x BEHAVIORAL (8 questions)
# ============================================================

q({
  "role": "FRONTEND",
  "level": "MID",
  "category": "BEHAVIORAL",
  "question": "Describe a time you mentored a junior developer on your team. How did you adapt your mentoring style to their learning needs and what was the outcome?",
  "difficulty": "MEDIUM",
  "skills": ["Mentorship", "Communication", "Patience", "Growth"],
  "estimatedTime": "3-5 min",
  "guidance": {
    "keyPoints": [
      "Effective mentoring adapts to the individual learning style: visual, hands-on, conceptual, or example-driven",
      "Good mentors teach problem-solving approaches, not just solutions � 'teach a person to fish'",
      "Structured mentorship works best: regular check-ins, defined goals, and gradual increase in responsibility",
      "Code reviews are a mentoring opportunity � explain the 'why' behind suggestions, not just the 'what'",
      "Encourage independence: let them make mistakes in safe environments and guide the reflection afterward",
      "Track progress: the goal is for the mentee to eventually not need you on their tasks"
    ],
    "commonMistakes": [
      "Using a one-size-fits-all mentoring approach regardless of the individual background and learning style",
      "Doing the work for them instead of guiding them to the solution",
      "Only reviewing code without explaining the principles behind the feedback",
      "Not setting clear expectations or goals for the mentoring relationship"
    ],
    "answerStructure": [
      "Set context: who was the junior, what was their experience level, what were they working on?",
      "Describe your approach: how did you assess their learning style and adapt?",
      "Give specific examples: pair programming sessions, code review techniques, knowledge-sharing sessions",
      "Explain challenges: what was difficult about mentoring this person, how did you adapt?",
      "Describe the outcome: how did they grow, what could they now do independently?",
      "Reflect on what you learned from the mentoring experience"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "MID",
  "category": "BEHAVIORAL",
  "question": "Tell me about a time you had a disagreement with a product manager or designer about a feature requirement. How did you resolve the conflict while maintaining a good working relationship?",
  "difficulty": "MEDIUM",
  "skills": ["Conflict Resolution", "Stakeholder Management", "Communication"],
  "estimatedTime": "3-5 min",
  "guidance": {
    "keyPoints": [
      "Disagreements with PMs/designers often stem from different priorities: feasibility vs desirability vs viability",
      "Frame the discussion around shared goals (user value, business outcomes) rather than positions",
      "Bring data and evidence: user research, analytics, technical constraints, performance budgets",
      "Offer alternatives: do not just say 'no' � propose a technically feasible approach that achieves the same goal",
      "Know when to escalate and when to compromise � not every battle is worth fighting",
      "Document decisions and trade-offs so everyone understands why a particular approach was chosen"
    ],
    "commonMistakes": [
      "Saying 'that is impossible' without explaining the specific constraints",
      "Dismissing design or product concerns as unimportant � every role brings a valid perspective",
      "Making it personal instead of focusing on the problem and trade-offs",
      "Going over the PM/designer head without trying to resolve it directly first"
    ],
    "answerStructure": [
      "Set context: what feature, what was the disagreement about?",
      "Explain their perspective: what were they trying to achieve?",
      "Explain your perspective: what technical concerns or constraints did you see?",
      "Describe the resolution process: did you build a prototype, analyze trade-offs, involve other stakeholders?",
      "Share the outcome: was a compromise reached, whose approach won, or was a third option found?",
      "Reflect on the relationship: how did this affect future collaboration with that person?"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "MID",
  "category": "BEHAVIORAL",
  "question": "Describe a situation where you took ownership of a feature from conception to delivery. How did you handle ambiguity, make technical decisions, and ensure successful delivery?",
  "difficulty": "MEDIUM",
  "skills": ["Ownership", "Leadership", "Delivery", "Decision Making"],
  "estimatedTime": "3-5 min",
  "guidance": {
    "keyPoints": [
      "Ownership means driving the feature end-to-end: requirements clarification, design, implementation, testing, deployment, and monitoring",
      "Ambiguity requires proactive communication � ask clarifying questions, propose options, validate assumptions early",
      "Technical decisions should be documented with their trade-offs and revisited if assumptions change",
      "Break the feature into incremental milestones � deliver value early and iterate",
      "Communicate progress and blockers proactively � do not wait for standup to mention you are stuck",
      "Post-delivery: monitor usage, collect feedback, and plan follow-up improvements"
    ],
    "commonMistakes": [
      "Waiting for perfect requirements before starting � leads to analysis paralysis",
      "Making technical decisions in isolation without stakeholder input",
      "Over-engineering for future needs that may never materialize (YAGNI)",
      "Not communicating delays or blockers early � surprises erode trust"
    ],
    "answerStructure": [
      "Describe the feature: what problem did it solve, what was the business value?",
      "Explain the ambiguity: what was unclear at the start?",
      "Describe how you clarified requirements: who did you talk to, what questions did you ask?",
      "Detail the technical decisions: what options did you consider, what did you choose and why?",
      "Explain the delivery process: milestones, testing, deployment, monitoring",
      "Share the outcome: metrics, user feedback, lessons learned"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "MID",
  "category": "BEHAVIORAL",
  "question": "How do you approach technical debt? Describe a situation where you had to decide between refactoring existing code vs delivering new features. What factors influenced your decision?",
  "difficulty": "MEDIUM",
  "skills": ["Technical Debt", "Prioritization", "Decision Making"],
  "estimatedTime": "3-5 min",
  "guidance": {
    "keyPoints": [
      "Not all technical debt is bad � intentional debt taken for speed can be strategic if paid back later",
      "The decision to refactor depends on: how often the code changes, how much it slows development, and how risky the change is",
      "The 'boy scout rule' � leave the code cleaner than you found it � prevents gradual decay",
      "Refactoring without tests is risky � have test coverage before restructuring code",
      "Measure the cost of debt: time lost to bugs, slow onboarding, difficult feature additions",
      "Get buy-in by quantifying the impact: 'this refactor will reduce our average feature delivery time by X%'"
    ],
    "commonMistakes": [
      "Treating all technical debt as equally urgent � some debt is harmless, some is crippling",
      "Refactoring code that works and rarely changes � low ROI with high risk",
      "Big-bang refactors instead of incremental improvements � too risky and hard to review",
      "Ignoring technical debt entirely � team velocity slows to a crawl over time"
    ],
    "answerStructure": [
      "Describe the situation: what was the code quality issue, how did it impact the team?",
      "Explain the conflict: why was there pressure to deliver features instead of refactoring?",
      "Detail your analysis: how did you assess the cost of the debt and the ROI of fixing it?",
      "Explain your decision: did you refactor, defer, or find a middle ground (improve incrementally)?",
      "Describe the outcome: how did the decision work out?",
      "Share your framework: how do you think about tech debt now?"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "MID",
  "category": "BEHAVIORAL",
  "question": "Tell me about a time you had to push back on a requirement or deadline. How did you communicate the trade-offs and what was the outcome?",
  "difficulty": "MEDIUM",
  "skills": ["Communication", "Negotiation", "Stakeholder Management"],
  "estimatedTime": "3-5 min",
  "guidance": {
    "keyPoints": [
      "Pushing back is not about saying 'no' � it is about presenting trade-offs and alternatives",
      "Frame pushback in terms of impact: 'We can deliver by Friday, but we will have to skip testing and risk X'",
      "Understand the stakeholder real need: is the deadline driven by a launch event, a demo, or arbitrary?",
      "Offer concrete alternatives: reduce scope, push timeline, or add resources",
      "Build trust by being reliable � when you commit to a revised date, deliver on it",
      "Document the trade-off decision so everyone understands the risks being accepted"
    ],
    "commonMistakes": [
      "Simply saying 'we cannot do it' without explaining why or offering alternatives",
      "Agreeing to unrealistic deadlines and then burning out the team to meet them",
      "Using technical jargon that non-technical stakeholders do not understand",
      "Pushing back on everything � loses credibility for when it really matters"
    ],
    "answerStructure": [
      "Set context: what was the requirement or deadline, who requested it?",
      "Explain why you needed to push back: technical constraints, quality concerns, team capacity?",
      "Describe how you communicated: did you prepare data, propose alternatives, explain trade-offs?",
      "Detail the negotiation: what was the stakeholder reaction, how did you reach an agreement?",
      "Share the outcome: revised deadline, reduced scope, or the original commitment with understood risks",
      "Reflect on what you learned about stakeholder management"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "MID",
  "category": "BEHAVIORAL",
  "question": "Describe a time you identified and implemented a process improvement on your team. What was the problem, what change did you propose, and how did you measure its impact?",
  "difficulty": "MEDIUM",
  "skills": ["Process Improvement", "Initiative", "Engineering Excellence"],
  "estimatedTime": "3-5 min",
  "guidance": {
    "keyPoints": [
      "Process improvements should solve real pain points, not change things for the sake of change",
      "Before proposing a change, gather data: how much time is lost, how many bugs caused, how often does it happen",
      "Start small: pilot the change with a subset of the team or a specific project before rolling out broadly",
      "Get buy-in by showing the expected benefit and involving the team in the design of the new process",
      "Measure before and after: use objective metrics (time saved, bug rate, deployment frequency)",
      "Be open to iterating � the first version of a new process will not be perfect"
    ],
    "commonMistakes": [
      "Implementing a process change based on a single frustrating incident rather than a systemic issue",
      "Making the change top-down without consulting the team � people resist being told how to work",
      "Not measuring the impact � the team does not know if the change actually helped",
      "Creating too much process overhead that slows people down more than the original problem"
    ],
    "answerStructure": [
      "Describe the problem: what was broken or inefficient? How did it affect the team?",
      "Explain how you identified it: did you track time, count incidents, gather feedback?",
      "Propose the improvement: what change did you suggest and why?",
      "Describe implementation: how did you get buy-in, pilot the change, and roll it out?",
      "Measure the impact: what metrics improved, how did the team respond?",
      "Reflect on what you learned about driving change within a team"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "MID",
  "category": "BEHAVIORAL",
  "question": "How do you balance shipping quickly with maintaining code quality? Give a specific example of a time you made this trade-off and explain your reasoning.",
  "difficulty": "MEDIUM",
  "skills": ["Decision Making", "Pragmatism", "Quality", "Speed"],
  "estimatedTime": "3-5 min",
  "guidance": {
    "keyPoints": [
      "Speed and quality are not always opposed � good practices like testing actually speed up development over time",
      "The key is intentional trade-offs: knowingly accept technical debt with a plan to pay it back",
      "Different parts of the codebase have different quality requirements: payment flows need more rigor than admin pages",
      "Automation (linting, CI/CD, code review templates) enforces quality without slowing development",
      "The cost of a bug increases the later it is found � faster shipping with less testing can be more expensive overall",
      "Communicate trade-offs explicitly: 'I can ship this in 2 days without tests, or 4 days with tests � your call'"
    ],
    "commonMistakes": [
      "Always prioritizing speed � accumulates unmanageable tech debt and bug count",
      "Always prioritizing quality � misses market opportunities and frustrates stakeholders",
      "Making the trade-off silently without stakeholder buy-in",
      "Not revisiting quality-compromised code � 'temporary' shortcuts become permanent"
    ],
    "answerStructure": [
      "Set context: what was the feature, what was the time pressure?",
      "Explain the trade-off: what quality practices would you have to skip to meet the deadline?",
      "Describe your decision: did you cut scope, skip tests, simplify the architecture? Why?",
      "Explain how you mitigated the risk: did you add a ticket to revisit, add more monitoring, limit blast radius?",
      "Share the outcome: did you meet the deadline? Did the shortcuts cause problems later?",
      "Reflect on how you approach the speed-vs-quality balance now"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "MID",
  "category": "BEHAVIORAL",
  "question": "Tell me about a time you had to work with incomplete or ambiguous requirements. How did you move forward and what approach did you take to clarify the unknowns?",
  "difficulty": "MEDIUM",
  "skills": ["Ambiguity", "Problem Solving", "Communication", "Proactiveness"],
  "estimatedTime": "3-5 min",
  "guidance": {
    "keyPoints": [
      "Ambiguous requirements are common � the skill is making progress despite uncertainty",
      "Start by identifying what IS known and what the open questions are",
      "Propose concrete options based on assumptions, then validate with stakeholders",
      "Build a prototype or spike to explore the unknown and make decisions based on real feedback",
      "Document assumptions explicitly so they can be corrected early",
      "Break the work into phases: build the foundation while clarifying the details for later phases"
    ],
    "commonMistakes": [
      "Waiting for perfect requirements before starting any work � wastes time and frustrates stakeholders",
      "Making assumptions without validating them � building the wrong thing",
      "Building the full feature based on incomplete requirements � massive rework when details emerge",
      "Not communicating uncertainty � stakeholders think everything is clear until demo day reveals otherwise"
    ],
    "answerStructure": [
      "Set context: what was the project, why were requirements ambiguous?",
      "Describe your initial approach: how did you assess what was known vs unknown?",
      "Explain how you clarified: what questions did you ask, what prototypes did you build?",
      "Detail your progress strategy: how did you move forward while still resolving ambiguity?",
      "Share the outcome: did the feature meet the actual need despite the initial ambiguity?",
      "Reflect on what you learned about navigating uncertainty"
    ]
  }
})

# ============================================================
# SENIOR x TECHNICAL (8 questions)
# ============================================================

q({
  "role": "FRONTEND",
  "level": "SENIOR",
  "category": "TECHNICAL",
  "question": "Explain micro-frontends architecture in detail. Compare iframe-based integration, web component-based integration, and module federation approaches. How do you handle shared dependencies, cross-team routing, and consistent UX across independently deployed micro-frontends?",
  "difficulty": "HARD",
  "skills": ["Micro-frontends", "Architecture", "Module Federation", "Web Components"],
  "estimatedTime": "5-7 min",
  "guidance": {
    "keyPoints": [
      "Micro-frontends decompose a frontend monolith into independently developed, tested, and deployed applications",
      "Iframes provide the strongest isolation (CSS, JS, DOM) but break accessibility, SEO, routing, and responsive layouts",
      "Web Components provide native encapsulation via Shadow DOM but have polyfill overhead and interop challenges with React/Vue",
      "Module Federation allows sharing runtime dependencies and enables true composition with shared component libraries",
      "Shared dependencies must be version-managed � Module Federation uses a singleton strategy with version checking",
      "Cross-team routing requires a shell application that delegates to child apps based on URL patterns"
    ],
    "commonMistakes": [
      "Assuming iframes are never appropriate � they work well for very isolated widgets like embedded dashboards",
      "Not having a shared design system � each micro-frontend looks like a different app",
      "Sharing too many runtime dependencies � version conflicts and tight coupling between teams",
      "Overlooking shared concerns: authentication, analytics, error logging, and performance budgets must be coordinated"
    ],
    "answerStructure": [
      "Define micro-frontends and the problems they solve: team autonomy, independent deploys, incremental migration",
      "Compare integration approaches: iframes (full isolation, poor UX), Web Components (standardized, limited ecosystem), Module Federation (runtime composition, shared deps)",
      "Explain Module Federation internals: container exposes modules, remote loads them asynchronously, shared dependencies use singleton + version check",
      "Discuss routing: shell owns top-level routes, each micro-frontend has its own router for sub-routes",
      "Address consistency: shared design system as an npm package, CSS custom properties for theming, shared auth context",
      "Cover performance: shared dependency caching, preloading, chunk splitting across micro-frontends"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "SENIOR",
  "category": "TECHNICAL",
  "question": "How does Module Federation in Webpack 5 work under the hood? Explain the concept of container, exposes, and remotes. How does the asynchronous boundary work, how are shared dependencies deduplicated, and what happens when versions conflict?",
  "difficulty": "HARD",
  "skills": ["Module Federation", "Webpack", "Architecture", "Runtime"],
  "estimatedTime": "5-7 min",
  "guidance": {
    "keyPoints": [
      "Module Federation allows a webpack build to expose modules for consumption by other webpack builds at runtime",
      "The container is a webpack entry that exposes an async bootstrap function loading exposed modules",
      "The remote is a consumer that references a container URL and exposes modules via the ModuleFederationPlugin",
      "Shared dependencies create an asynchronous boundary � webpack generates async chunks that load shared modules before the app runs",
      "Version conflicts are handled by the shared singleton strategy: the highest satisfying version is used; if none match, the build fails",
      "The runtime uses a share scope � a global map of shared module requests to their resolved versions and factories"
    ],
    "commonMistakes": [
      "Not setting shared dependencies � each micro-frontend bundles its own copy of React (massive bloat)",
      "Using insufficient version ranges in shared config � too strict prevents sharing, too loose risks incompatibility",
      "Forgetting that all modules crossing the federation boundary become async � lazy loading must be handled",
      "Not configuring the shared eager option for critical path modules � creates waterfall loading of shared deps"
    ],
    "answerStructure": [
      "Define the plugin configuration: name, filename, exposes (what this app offers), remotes (what this app consumes), shared (common deps)",
      "Explain the container concept: each micro-frontend is a webpack build that produces a container entry (async bootstrap)",
      "Describe the async boundary: when importing a remote module, webpack generates async chunks that load the remote container first",
      "Explain shared dependency resolution: share scope maps module requests to available versions, picks the best match",
      "Discuss version conflict handling: strictVersion: true rejects incompatible versions, singleton: true ensures one instance",
      "Cover runtime loading: the container init function loads shared dependencies, then get function returns the exposed module"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "SENIOR",
  "category": "TECHNICAL",
  "question": "Describe how you would build a custom React renderer. What APIs does react-reconciler expose? How do host configs work, and what would you need to implement to render React components to a canvas or native environment?",
  "difficulty": "HARD",
  "skills": ["React", "Custom Renderer", "Reconciler", "Host Config"],
  "estimatedTime": "5-7 min",
  "guidance": {
    "keyPoints": [
      "react-reconciler is the package that implements React core diffing algorithm and can target any host environment",
      "A host config defines how React creates, updates, and removes host instances (the renderer native objects)",
      "Key host config methods: createInstance, appendChild, removeChild, commitUpdate, prepareUpdate, getRootHostContext",
      "The renderer must implement the scheduling and commit phases � the reconciler handles the diffing",
      "Custom renderers can target canvas (react-canvas), native mobile (React Native), PDF, terminal, or any output surface",
      "The renderer must handle text children, event systems, and the public instance API (refs)"
    ],
    "commonMistakes": [
      "Not understanding the separation between reconciler (diffing) and renderer (host operations)",
      "Implementing only createInstance without proper teardown � memory leaks from unmounted components",
      "Forgetting to implement getPublicInstance � refs will return undefined",
      "Not handling the different container types (host root, suspense boundary, portal) correctly"
    ],
    "answerStructure": [
      "Explain the reconciler abstraction: React core algorithm is environment-agnostic, the host config makes it concrete",
      "Import react-reconciler and define the host config object with all required methods",
      "Describe key host config methods: createInstance (create host element), commitUpdate (apply props diff), appendChild (insert into tree)",
      "Explain the scheduling integration: shouldYield, scheduleTimeout, cancelTimeout for cooperative scheduling",
      "Discuss the event system: how to wire native events back into React synthetic event system",
      "Show a minimal example: rendering React elements to a canvas by creating draw commands as host instances"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "SENIOR",
  "category": "TECHNICAL",
  "question": "Explain how webpack builds your code. Walk through the bundling process: entry resolution, module resolution, loaders, plugins, code splitting, and output generation. How does Vite approach differ � using esbuild for dependencies and native ESM for source code � and what are the trade-offs of each?",
  "difficulty": "HARD",
  "skills": ["Webpack", "Vite", "Build Tools", "Bundling"],
  "estimatedTime": "5-7 min",
  "guidance": {
    "keyPoints": [
      "Webpack: entry ? module graph construction (with loaders transforming each module) ? optimization ? chunking ? output",
      "Loaders transform files (TS->JS, SCSS->CSS) and are applied in reverse order of the configuration rule chain",
      "Plugins hook into every lifecycle event: compilation, module creation, chunk optimization, asset emission",
      "Code splitting occurs via SplitChunksPlugin which analyzes the module graph for shared modules and creates separate chunks",
      "Vite uses esbuild for dependency pre-bundling (fast, written in Go) and serves source as native ESM in development",
      "Vite production build uses Rollup (not esbuild) for superior tree shaking and chunk optimization"
    ],
    "commonMistakes": [
      "Assuming Vite uses esbuild for everything � production builds use Rollup, only dev server and deps use esbuild",
      "Not understanding that Vite dev server speed comes from native ESM � no bundling needed for source files",
      "Configuring webpack loaders in the wrong order � loaders run right-to-left in the 'use' array",
      "Not realizing that Vite dev/prod parity is lower than webpack since different bundlers are used"
    ],
    "answerStructure": [
      "Describe webpack build pipeline: entry ? resolve ? load (loaders) ? parse ? build module graph ? optimize (tree shake, minify) ? emit chunks",
      "Explain loaders as transform functions: each module goes through a pipeline of loaders that convert it to JS",
      "Describe the plugin system: Tapable event hooks throughout the compilation lifecycle",
      "Explain code splitting: SplitChunksPlugin analyzes cross-entry module sharing and creates vendor/commons chunks",
      "Describe Vite approach: esbuild for pre-bundling deps (dev) and minification (prod), Rollup for production bundling, native ESM dev server",
      "Compare trade-offs: webpack is more configurable and has richer plugin ecosystem; Vite is faster for dev and simpler by default"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "SENIOR",
  "category": "TECHNICAL",
  "question": "Explain Web Workers and Service Workers in depth. How do Web Workers enable parallelism in JavaScript? How does a Service Worker act as a programmable network proxy? Describe the lifecycle of a Service Worker � install, activate, fetch � and strategies for cache-first vs network-first.",
  "difficulty": "HARD",
  "skills": ["Web Workers", "Service Workers", "PWA", "Parallelism"],
  "estimatedTime": "5-7 min",
  "guidance": {
    "keyPoints": [
      "Web Workers run scripts in a separate OS thread with their own event loop, V8 isolate, and no DOM access",
      "Communication with the main thread is via postMessage (structured clone algorithm, shared ArrayBuffer for zero-copy)",
      "Service Workers are a specialized type of Web Worker that acts as a programmable network proxy between the browser and network",
      "Service Worker lifecycle: registration ? install event ? activate event (old caches cleaned) ? idle ? fetch events",
      "Cache-first strategy: serve from cache, update in background (fast, stale-while-revalidate pattern)",
      "Network-first strategy: try network, fall back to cache (fresh data with offline resilience)"
    ],
    "commonMistakes": [
      "Trying to access DOM, localStorage, or synchronous APIs from a Worker � these APIs are not available",
      "Not handling Service Worker updates � users get stuck on old cached versions without notification",
      "Cache-first for everything � dynamic content becomes stale; network-first for everything � offline breaks",
      "Registering the Service Worker on every page load without checking if it is already registered"
    ],
    "answerStructure": [
      "Explain Web Workers: separate thread, no DOM, postMessage communication, use cases (CPU work, data processing, canvas offloading)",
      "Describe Service Workers as a specific type: no DOM access, programmable network proxy, must be served over HTTPS",
      "Walk through the lifecycle: registration (scope control) ? install (pre-cache critical assets) ? activate (clean old caches) ? fetch (intercept requests)",
      "Explain caching strategies: cache-first (static assets, app shell), network-first (API calls, dynamic content), stale-while-revalidate (content that changes infrequently)",
      "Discuss Service Worker updates: install event fires for new version, waitUntil keeps it in waiting, skipWaiting immediately activates, clients.claim controls uncontrolled clients",
      "Cover common patterns: offline analytics queue, background sync for failed mutations, push notifications"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "SENIOR",
  "category": "TECHNICAL",
  "question": "Design a progressive web application architecture from scratch. How do you implement offline support, background sync, push notifications, and add-to-homescreen? What are the challenges with cache invalidation, updating service workers, and handling offline-first data synchronization?",
  "difficulty": "HARD",
  "skills": ["PWA", "Offline First", "Service Workers", "Sync", "Notifications"],
  "estimatedTime": "5-7 min",
  "guidance": {
    "keyPoints": [
      "The app shell architecture caches the minimal HTML, CSS, and JS needed to render the UI shell on first load",
      "Offline support requires a cache-first strategy for static assets and a background sync for failed mutations",
      "Background Sync API defers API calls when offline � the service worker retries when connectivity returns",
      "Push notifications use the Push API (server ? service worker) and Notification API (service worker ? user)",
      "The web app manifest provides metadata for the add-to-homescreen prompt: icons, name, display mode, start URL",
      "Cache invalidation is the hardest problem � use versioned caches, delete old caches on activate, and use cache-busting URLs"
    ],
    "commonMistakes": [
      "Caching API responses without a strategy � users see stale data long after it is updated",
      "Not handling the case where the user is online but on a slow connection � cache-first with network timeout is better than either extreme",
      "Storing large amounts of data in the Cache API � use IndexedDB for structured/queryable offline data",
      "Not updating the web app manifest when adding new icons or splash screens � the old manifest is cached indefinitely"
    ],
    "answerStructure": [
      "Define the app shell: minimal UI skeleton cached during install, loads dynamic content via API calls",
      "Design the caching hierarchy: precache (install) for shell, runtime cache for API responses (stale-while-revalidate), IndexedDB for user data",
      "Implement offline support: intercept fetch events, serve from cache with network fallback, queue failed mutations in IndexedDB",
      "Implement background sync: register a sync event in the service worker when a mutation fails, retry with exponential backoff",
      "Implement push notifications: subscribe to push manager, send subscription to server, handle push events in the service worker",
      "Discuss cache invalidation: versioned caches (CACHE_NAME = 'v2'), delete old caches in activate event, cache-first for versioned assets"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "SENIOR",
  "category": "TECHNICAL",
  "question": "Describe how you would architect a design system used across multiple teams and applications. How do you handle versioning, distribution (npm packages vs copy-paste), theming, and ensuring consistent usage? What testing strategies do you employ for visual regressions?",
  "difficulty": "HARD",
  "skills": ["Design System", "Architecture", "Theming", "Visual Testing"],
  "estimatedTime": "5-7 min",
  "guidance": {
    "keyPoints": [
      "A design system has three layers: tokens (colors, spacing, typography), components (buttons, cards, modals), and patterns (layouts, page templates)",
      "Distribution via npm packages enables versioning with semver � breaking changes require major version bumps",
      "Theming uses CSS custom properties (design tokens as CSS variables) that can be overridden per application or brand",
      "Consistent usage requires linter rules (e.g., no hardcoded colors), documentation/storybook, and automated migration scripts",
      "Visual regression testing (Chromatic, Percy, Loki) compares screenshots of components across versions",
      "Accessibility testing (axe-core, pa11y) should be automated in CI for every component change"
    ],
    "commonMistakes": [
      "Building components that are too opinionated � teams need flexibility and will bypass the design system",
      "Not treating the design system as a product with users � no roadmap, no changelog, no migration guides",
      "Versioning component APIs incorrectly � breaking changes in minor versions cause downstream breakage",
      "Not testing for accessibility � teams trust design system components to be accessible by default"
    ],
    "answerStructure": [
      "Define the design system architecture: tokens ? components ? patterns ? documentation",
      "Discuss distribution: npm packages with semver, separate packages per layer (@acme/tokens, @acme/components), tree-shakeable exports",
      "Explain theming strategy: CSS custom properties for tokens, data-theme attribute on root, dark/light/high-contrast variants",
      "Ensure consistent usage: ESLint plugin to ban hardcoded values, Storybook for documentation and visual testing",
      "Implement testing: unit tests (Jest + React Testing Library), visual regression (Chromatic), accessibility (axe-core), interactive tests (Playwright)",
      "Cover versioning and migration: codemods for breaking changes, deprecation warnings, changelogs, upgrade guides"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "SENIOR",
  "category": "TECHNICAL",
  "question": "Compare and contrast monorepo strategies: single package vs multi-package with tools like Nx, Turborepo, or Lerna. How do you handle shared TypeScript configs, dependency management, build caching, and CI optimization? What are the trade-offs of a monorepo vs polyrepo approach?",
  "difficulty": "HARD",
  "skills": ["Monorepo", "Build Systems", "Nx", "Turborepo", "Architecture"],
  "estimatedTime": "5-7 min",
  "guidance": {
    "keyPoints": [
      "Single-package monorepo: one package.json, all code in one project � simple but no independent versioning or scoped builds",
      "Multi-package monorepo: each package has its own package.json and can be versioned/released independently",
      "Nx provides dependency graph analysis, computation caching, distributed task execution, and affected command detection",
      "Turborepo focuses on build caching and task orchestration with minimal configuration",
      "Shared TypeScript configs use project references and composite projects for incremental type checking",
      "CI optimization: affected commands only build/test changed packages, remote caching (Nx Cloud, Turborepo remote cache) shares cache across machines"
    ],
    "commonMistakes": [
      "Creating too many packages too early � the overhead of managing N packages is not worth it without clear boundaries",
      "Not using project references in TypeScript � the entire monorepo is compiled as one unit, losing type-checking incrementality",
      "Ignoring dependency cycles between packages � circular dependencies break build order and cause hard-to-debug issues",
      "Not having a clear publishing strategy � understanding which packages should be versioned together vs independently"
    ],
    "answerStructure": [
      "Define monorepo: multiple projects in a single repository with shared tooling",
      "Compare single-package (simple, no independent versioning) vs multi-package (complex, independent releases, better boundaries)",
      "Describe tooling: Nx (dependency graph, caching, generators), Turborepo (caching, task pipelines, simpler), Lerna (publishing focused)",
      "Explain TypeScript setup: composite + project references for incremental builds, shared tsconfig.base.json with strict settings",
      "Discuss dependency management: hoisted vs isolated dependencies, pnpm workspaces for efficient disk usage",
      "Explain CI optimization: affected commands, remote caching, distributed task execution, selective testing"
    ]
  }
})

# ============================================================
# SENIOR x PROBLEM_SOLVING (8 questions)
# ============================================================

q({
  "role": "FRONTEND",
  "level": "SENIOR",
  "category": "PROBLEM_SOLVING",
  "question": "Design a frontend performance monitoring and observability system. What metrics would you track � Core Web Vitals and custom metrics? How would you instrument the application with minimal overhead, collect data from real users (RUM), and correlate frontend performance with backend metrics?",
  "difficulty": "HARD",
  "skills": ["Performance Monitoring", "RUM", "Observability", "Web Vitals"],
  "estimatedTime": "5-7 min",
  "guidance": {
    "keyPoints": [
      "Track Core Web Vitals (LCP, FID/INP, CLS) plus custom metrics (TTFB, FCP, TTI, component render times, API latency)",
      "Use PerformanceObserver API to passively capture CWV without manual instrumentation",
      "Instrument with performance.mark() and performance.measure() for custom user-centric timing",
      "Batch and compress metric reports before sending (sendBeacon, requestIdleCallback) to avoid impacting performance",
      "Correlate frontend metrics with backend traces via trace-id or correlation-id headers on API requests",
      "Aggregate data in a dashboard (Grafana, Datadog, custom) with percentiles (p50, p75, p95, p99) and segmentation by browser, device, region"
    ],
    "commonMistakes": [
      "Measuring performance with the instrumentation itself � expensive observer callbacks or synchronous blocking code",
      "Sending metrics synchronously (XHR/fetch) on page unload � data is lost; use sendBeacon instead",
      "Not filtering out non-human traffic (bots, crawlers) � skews performance data",
      "Only tracking synthetic metrics from CI � RUM data reveals real user experiences that lab tests miss"
    ],
    "answerStructure": [
      "Define the metric taxonomy: CWV (LCP, FID/INP, CLS), app-specific (page load, interaction latency, API response times), business (conversion rate vs performance)",
      "Design instrumentation: PerformanceObserver for standard metrics, manual marks/measures for custom timing, minimal overhead via batching",
      "Implement the reporting pipeline: collect ? batch (buffer up to N ms) ? compress ? send via sendBeacon or fetch with keepalive",
      "Design the correlation strategy: pass a trace-id header on API requests, include it in performance reports",
      "Build the dashboard: segment by browser, device class, connection type, geography; show trends over time; alert on regressions",
      "Discuss alerting: anomaly detection on percentile shifts, budget-based alerts (LCP > 2.5s), regression PR comments via CI"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "SENIOR",
  "category": "PROBLEM_SOLVING",
  "question": "Design a multi-tenant SaaS frontend architecture. How would you handle tenant-specific theming, feature flags, routing, and data isolation? What are the trade-offs between a single codebase with runtime configuration vs separate deployments per tenant?",
  "difficulty": "HARD",
  "skills": ["SaaS", "Multi-tenant", "Architecture", "Configuration"],
  "estimatedTime": "5-7 min",
  "guidance": {
    "keyPoints": [
      "Multi-tenant frontend serves multiple customers (tenants) from the same deployed application",
      "Tenant-specific theming uses CSS custom properties loaded at runtime based on the tenant configuration",
      "Feature flags enable phased rollouts to specific tenants � use a flag management service (LaunchDarkly, Flagsmith) for real-time updates",
      "Routing can be subdomain-based (tenant.app.com) or path-based (app.com/tenant) � subdomains allow better cookie isolation",
      "Data isolation is primarily a backend concern but frontend must never leak tenant data via cached API responses or stale state",
      "Single codebase with runtime config is simpler to deploy but riskier: one bad deploy affects all tenants; separate deploys isolate risk but increase operational overhead"
    ],
    "commonMistakes": [
      "Storing tenant-specific data in localStorage without prefixing by tenant � data leaks when switching tenants in the same browser tab",
      "Not clearing API response caches when switching tenants � stale data from tenant A shown to tenant B",
      "Hardcoding tenant configurations instead of loading them dynamically from the server",
      "Over-engineering: building a multi-tenant generic platform when the app only has 2-3 tenants"
    ],
    "answerStructure": [
      "Define the tenant model: how tenants are identified (subdomain, header, cookie), how configuration is loaded",
      "Design theming: tenant config returns CSS custom property overrides, applied to document root on login/route change",
      "Design feature flags: hierarchical flags (tenant ? user ? environment), evaluated at runtime, cached with TTL",
      "Implement data isolation: scoped API clients, clear caches on tenant switch, never use shared localStorage",
      "Discuss deployment strategy: single codebase with runtime isolation (simpler, riskier) vs per-tenant deployments (safer, costlier)",
      "Cover edge cases: switching tenants without full page reload, stale data prevention, error isolation per tenant"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "SENIOR",
  "category": "PROBLEM_SOLVING",
  "question": "Design a feature flag system for the frontend. How would you implement gradual rollouts, A/B testing, and kill switches? How do you handle flag evaluation performance, caching flag values, and ensuring flags work consistently across micro-frontends?",
  "difficulty": "HARD",
  "skills": ["Feature Flags", "A/B Testing", "Architecture", "Gradual Rollout"],
  "estimatedTime": "5-7 min",
  "guidance": {
    "keyPoints": [
      "Feature flags toggle behavior without deploys: boolean flags for on/off, multivariate flags for A/B/n testing",
      "Gradual rollouts use percentage-based targeting: hash the user ID to a bucket, enable flag for X% of buckets",
      "Kill switches immediately disable a feature across all users without deploy � critical for incident response",
      "Flag evaluation must be fast (sub-millisecond) � cache flag configurations in memory with a TTL and background refresh",
      "Consistency across micro-frontends requires a shared flag evaluation service or a broadcast channel for flag changes",
      "Stale flags accumulate technical debt � require flag cleanup tickets and automated stale-flag detection"
    ],
    "commonMistakes": [
      "Evaluating flags synchronously via API call on every check � adds latency to every render",
      "Not having a default value when the flag service is unreachable � the app should fall back to a safe default",
      "Using feature flags for permanent behavior changes � flags should be temporary, removed once the feature is fully rolled out",
      "Not targeting by user attributes � percentage-based rollouts without user targeting cannot debug issues with specific users"
    ],
    "answerStructure": [
      "Define flag types: boolean (on/off), multivariate (A/B/C), percentage (gradual rollout), targeted (specific users/segments)",
      "Design the flag evaluation pipeline: fetch flags from server ? cache in memory ? evaluate synchronously ? provide to components",
      "Implement gradual rollouts: hash user ID, mod by 100, compare to rollout percentage, ensure consistency across sessions",
      "Implement kill switches: highest priority flag category, evaluated before any other flag short-circuits the feature",
      "Handle micro-frontend consistency: shared flag library that connects to a common evaluation endpoint, or postMessage for real-time flag updates",
      "Discuss cleanup: CI check for flags older than N days, flag usage tracking, error when flag does not exist"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "SENIOR",
  "category": "PROBLEM_SOLVING",
  "question": "Design an offline-first application architecture. How would you handle data synchronization when the user comes back online? What conflict resolution strategy would you use for a shopping list app vs a collaborative document editor? How does IndexedDB fit into this architecture?",
  "difficulty": "HARD",
  "skills": ["Offline First", "Sync", "IndexedDB", "Conflict Resolution"],
  "estimatedTime": "5-7 min",
  "guidance": {
    "keyPoints": [
      "Offline-first means the app works fully without a network connection, syncing changes when connectivity returns",
      "IndexedDB stores structured data locally � use it as the primary data source, with the server as the sync target",
      "Synchronization requires change tracking (mutation log/timestamps) to know what changed while offline",
      "Conflict resolution strategies: last-write-wins (simplest, acceptable for non-critical data), CRDT (complex, needed for collaborative editing), custom merge (domain-specific)",
      "For a shopping list: last-write-wins with sync timestamps is sufficient � conflicts are rare and low-impact",
      "For a collaborative document: CRDT or OT is necessary � multiple users edit the same document concurrently"
    ],
    "commonMistakes": [
      "Treating the server as the source of truth when offline � the local store must be the primary data source",
      "Not handling partial sync � syncing a large dataset in one go blocks the main thread and fails on poor connections",
      "Assuming all data should be available offline � prioritize critical data, show placeholder for the rest",
      "Not detecting conflicts created by the same user on different devices � device-level sync is a distinct problem"
    ],
    "answerStructure": [
      "Define the architecture: IndexedDB as local primary store, server as sync target, Service Worker as network proxy",
      "Design the data layer: IDB schema with sync metadata (updatedAt, version, syncStatus), query through a local-first abstraction layer",
      "Implement change tracking: mutation log records every create/update/delete with timestamp, sync engine replays the log when online",
      "Implement sync engine: register online/offline events, replay mutation log in order, handle server responses (acknowledge or conflict)",
      "Choose conflict resolution: shopping list ? last-write-wins with versions; collaborative doc ? CRDT (yjs, automerge)",
      "Discuss edge cases: partial sync (sync in pages), large binary data (store locally, sync lazily), sync conflicts (UI resolution prompts)"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "SENIOR",
  "category": "PROBLEM_SOLVING",
  "question": "Design a migration strategy for moving a large legacy jQuery application to a modern React framework. How would you incrementally migrate without freezing feature development? How would you handle shared state between legacy and new code, and how would you validate that the new code produces identical results?",
  "difficulty": "HARD",
  "skills": ["Migration", "Legacy Code", "Architecture", "Incremental Adoption"],
  "estimatedTime": "5-7 min",
  "guidance": {
    "keyPoints": [
      "The Strangler Fig pattern incrementally replaces legacy code with new code � both live side by side during migration",
      "Mount React inside the legacy app starting with a single root � replace one page/component at a time",
      "Shared state between legacy and React can be bridged via a shared event bus, a global store, or DOM attribute synchronization",
      "Feature parity validation: write integration tests for the legacy behavior before migrating, then validate the React version produces the same output",
      "The micro-frontends approach (Module Federation) can serve both old and new apps from the same shell, routing to whichever implementation is ready",
      "Measure success by migration percentage: gradually increase the proportion of React-rendered DOM, with a kill switch to revert"
    ],
    "commonMistakes": [
      "Trying to rewrite the entire application at once � too risky, too slow, blocks feature development",
      "Not having a rollback plan � every migrated page should be togglable back to the legacy version",
      "Rewriting instead of refactoring � introduces new bugs even if the behavior should be identical",
      "Not involving QA in the migration � regression testing at scale requires dedicated effort"
    ],
    "answerStructure": [
      "Define the migration strategy: Strangler Fig � replace page by page or component by component, both systems coexist",
      "Design the integration layer: host React inside a legacy div, use Module Federation for routing, bridge state via events",
      "Plan the replacement order: start with low-risk, isolated pages, build confidence, then tackle high-complexity areas",
      "Implement feature parity validation: capture legacy component output (HTML snapshots), compare to React output",
      "Handle shared state: create a bridge service that translates events between jQuery event system and React state",
      "Discuss rollout: feature flag each migrated page, canary test with internal users, monitor error rates and performance"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "SENIOR",
  "category": "PROBLEM_SOLVING",
  "question": "Design a large-scale state management solution for an application with dozens of domains, real-time updates, and optimistic UI. How would you structure the state tree, handle side effects, and ensure predictable updates? When would you use global state vs server state vs local state?",
  "difficulty": "HARD",
  "skills": ["State Management", "Architecture", "Scalability", "Optimistic UI"],
  "estimatedTime": "5-7 min",
  "guidance": {
    "keyPoints": [
      "Separate state into three layers: server state (API data, cached/synced), app state (UI, modals, theme), and domain state (computed/derived business logic)",
      "Server state should use a dedicated library (React Query, SWR, RTK Query) that handles caching, deduplication, background refetch, and optimistic updates",
      "Domain/global state (auth, tenant, feature flags) uses Context or Zustand � kept minimal to avoid unnecessary re-renders",
      "Local state (form inputs, toggle states) stays in the component � only lifted when shared with siblings",
      "Side effects should be centralized (RxJS epics, Zustand middleware, React Query mutations) rather than scattered in useEffect",
      "Optimistic updates: snapshot the relevant state, apply the mutation optimistically, rollback on server error, refetch on success"
    ],
    "commonMistakes": [
      "Putting server data in Redux or another global store � duplicates cache responsibilities and adds manual sync work",
      "Using Context for high-frequency updates � cascading re-renders across the entire provider tree",
      "Having too many global state slices � most state should be local or server-cached",
      "Not normalizing the state � deep nested objects make partial updates expensive and error-prone"
    ],
    "answerStructure": [
      "Define the three state layers: server state (API data), app state (UI controls), domain state (auth, permissions, config)",
      "Design server state layer: React Query with structured query keys, stale-while-revalidate, background refetch on window focus, optimistic updates with rollback",
      "Design app state layer: Zustand store slices (notifications, modals, sidebar), selectors to prevent over-subscription",
      "Design domain state layer: Context for auth/profile, feature flags via a dedicated service with local caching",
      "Handle side effects: React Query mutations for API calls, Zustand subscribe for cross-store coordination, RxJS for complex event streams",
      "Discuss optimization: normalizr or RTK for normalized state, memoized selectors (createSelector for complex derivations), state change batching"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "SENIOR",
  "category": "PROBLEM_SOLVING",
  "question": "Design a frontend architecture for an e-commerce platform that handles product search, filtering, cart management, and checkout. How would you handle URL-based state for filters, shareable URLs, the back button, and deep linking? How would you optimize for SEO?",
  "difficulty": "HARD",
  "skills": ["E-commerce", "Architecture", "SEO", "URL State", "Deep Linking"],
  "estimatedTime": "5-7 min",
  "guidance": {
    "keyPoints": [
      "All filter/search state should be encoded in URL query parameters for shareability and back-button support",
      "Use the URL as the source of truth for list views � derive API query params from URL, update URL on filter change",
      "Server-side rendering or static generation is critical for SEO � product pages should be pre-rendered with metadata",
      "The back button requires synchronizing URL changes with the data fetch � use the browser popstate event or a router that handles this natively",
      "Deep linking to product pages with specific variants/options requires a canonical URL scheme (e.g., /product/sku?color=red&size=m)",
      "Cart state is session-level and should persist across pages � store in server session, local cache as fallback"
    ],
    "commonMistakes": [
      "Storing filter state only in component state � lost on page refresh, breaks URL sharing",
      "Using the URL as a second source of truth alongside component state � desync bugs are common",
      "Not pre-rendering product pages � Google can render JS but SSR/SSG yields better SEO results",
      "Pushing a new history entry on every filter change � the back button requires dozens of presses to return to the initial state; use replaceState for intermediate changes"
    ],
    "answerStructure": [
      "Define URL structure: /search?q=shoes&category=running&sort=price_asc&page=2 for listing, /product/acme-shoe-123 for detail",
      "Design the data flow: URL ? parse params ? fetch API ? render results; filter change ? update URL ? re-fetch � URL is the single source of truth",
      "Handle back/forward: listen to popstate, re-parse URL, re-fetch with new params, restore scroll position",
      "Implement deep linking: product page URL includes variant params, server renders the correct variant metadata",
      "Design cart architecture: server-backed with a guest cart ID stored in a cookie, optimistic localStorage cache for instant UI updates",
      "Optimize for SEO: SSR for listing and product pages, structured data (schema.org), canonical URLs, sitemaps, Open Graph tags"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "SENIOR",
  "category": "PROBLEM_SOLVING",
  "question": "Design a system for rendering dynamic, user-generated forms from a JSON schema. How would you handle complex validation rules, conditional logic, nested repeating groups, and custom field types? How would you optimize rendering performance for forms with hundreds of fields?",
  "difficulty": "HARD",
  "skills": ["Dynamic Forms", "JSON Schema", "Performance", "Validation"],
  "estimatedTime": "5-7 min",
  "guidance": {
    "keyPoints": [
      "Use JSON Schema (or JSON Forms, React JSON Schema Form) as the standard format � it supports validation rules, dependencies, and nested structures",
      "Conditional logic uses JSON Schema 'if/then/else' or 'dependencies' � fields can be shown/hidden based on other field values",
      "Repeating groups are arrays of sub-schemas � each item in the array renders the same sub-form with its own state",
      "Custom field types use a registry pattern: each field type maps to a React component registered by type name",
      "Performance optimization: virtualize the field list, only validate changed fields, use immutable updates with structural sharing",
      "Accessibility: dynamically rendered forms must maintain focus order, announce field errors, and support keyboard navigation"
    ],
    "commonMistakes": [
      "Re-rendering the entire form on every field change � use field-level subscriptions or memoization",
      "Not sanitizing the JSON schema � user-provided schemas can contain malicious configurations (XSS, infinite loops)",
      "Handling validation synchronously for async rules � some validations need API calls (e.g., uniqueness check)",
      "Not supporting undo/redo � user-generated forms need history tracking for configuration changes"
    ],
    "answerStructure": [
      "Define the schema format: JSON Schema subset with field types, validation rules, conditional visibility, and layout hints",
      "Design the rendering engine: recursive component that reads the schema and renders the appropriate field component",
      "Implement validation: compile JSON Schema validators (ajv) or implement custom validation runner",
      "Handle conditional logic: evaluate conditions on data change, show/hide fields with animation to avoid layout jumps",
      "Handle repeating groups: array item component that manages its own sub-form state with add/remove/reorder",
      "Optimize performance: virtualize long forms, use React.memo on field components, debounce validation on rapid input"
    ]
  }
})

# ============================================================
# SENIOR x BEHAVIORAL (8 questions)
# ============================================================

q({
  "role": "FRONTEND",
  "level": "SENIOR",
  "category": "BEHAVIORAL",
  "question": "Describe a time you led a major technical initiative that required coordination across multiple teams. How did you align stakeholders, manage dependencies, and ensure successful delivery?",
  "difficulty": "HARD",
  "skills": ["Leadership", "Cross-team Collaboration", "Delivery", "Stakeholder Management"],
  "estimatedTime": "5-7 min",
  "guidance": {
    "keyPoints": [
      "Leading cross-team initiatives requires influence without authority � you need buy-in, not just directives",
      "Stakeholder alignment starts with shared goals: what problem are we solving and why does it matter to each team",
      "Dependency management: map all inter-team dependencies, identify critical path, and establish clear ownership",
      "Communication rhythm: regular syncs with clear agendas, visible progress tracking (RACI, timeline), proactive risk reporting",
      "Escalation path: know when to escalate blockers and how to present options, not just problems",
      "Post-delivery: celebrate the win, document lessons learned, and improve the cross-team collaboration process"
    ],
    "commonMistakes": [
      "Assuming other teams have the same priorities � each team has their own roadmap and goals",
      "Not identifying dependencies early � discovering them mid-project causes delays",
      "Over-communicating with too many meetings � kills productivity; use async updates and targeted syncs",
      "Taking full ownership without delegating � leads to burnout and bottlenecks"
    ],
    "answerStructure": [
      "Set context: what was the initiative, how many teams were involved, what was the timeline?",
      "Describe the alignment process: how did you get all teams on the same page about goals and milestones?",
      "Explain dependency management: what were the critical dependencies, how did you track and resolve them?",
      "Detail the communication strategy: meeting cadence, progress tracking, escalation process",
      "Describe challenges: conflicting priorities, resource constraints, technical disagreements � how did you handle them?",
      "Share the outcome: was it delivered on time? What metrics improved? What did you learn about cross-team leadership?"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "SENIOR",
  "category": "BEHAVIORAL",
  "question": "How do you set technical vision and roadmap for a frontend platform? Give an example of a technical strategy you defined, how you communicated it, and how you got buy-in from engineering and product leadership.",
  "difficulty": "HARD",
  "skills": ["Technical Vision", "Strategy", "Leadership", "Communication"],
  "estimatedTime": "5-7 min",
  "guidance": {
    "keyPoints": [
      "Technical vision should be grounded in business outcomes, not technology for its own sake",
      "A good vision document articulates: where we are, where we want to be, why it matters, and how we get there",
      "Getting buy-in requires understanding stakeholder motivations: engineers want technical excellence, PMs want delivery speed, leadership wants ROI",
      "Break the vision into a phased roadmap: quick wins (0-3 months), strategic bets (3-12 months), aspirational (12+ months)",
      "Socialize early and often: RFC documents, brown bag sessions, 1:1s with key stakeholders before formal presentation",
      "Measure progress against the vision: define success metrics and review them quarterly"
    ],
    "commonMistakes": [
      "Presenting a fully-formed vision without early input � stakeholders feel excluded and resist adoption",
      "Focusing only on technology (e.g., 'we should use React 19') without tying it to business value",
      "Setting an overly ambitious roadmap without accounting for ongoing feature work",
      "Not revisiting the vision as circumstances change � a static vision becomes obsolete"
    ],
    "answerStructure": [
      "Describe the context: what was the state of the frontend platform, what problems existed?",
      "Explain the vision you defined: what was the target state, what principles guided the strategy?",
      "Describe the process: how did you gather input, research alternatives, and form the proposal?",
      "Explain how you communicated it: RFC, presentations, 1:1s, and how you addressed concerns",
      "Detail the roadmap: what was the phased plan, what were the quick wins vs long-term bets?",
      "Share the outcome: was the vision adopted? What impact did it have on engineering velocity, quality, or developer satisfaction?"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "SENIOR",
  "category": "BEHAVIORAL",
  "question": "Tell me about a time you had to drive a significant architectural change (e.g., migrating frameworks, adopting a new state management pattern, introducing micro-frontends). How did you manage the change, deal with resistance, and ensure the transition was smooth?",
  "difficulty": "HARD",
  "skills": ["Change Management", "Architecture", "Influence", "Migration"],
  "estimatedTime": "5-7 min",
  "guidance": {
    "keyPoints": [
      "Architectural changes are as much about people as they are about technology � resistance is natural",
      "Build a compelling case: benchmark current pain points (slow build times, bugs, developer frustration) and project future benefits",
      "Start with a well-scoped proof of concept to de-risk the change and build confidence",
      "Find early adopters who are excited about the change � their success stories convince skeptics",
      "Provide migration guides, codemods, and office hours to reduce the friction of adopting the change",
      "Set a sunset date for the old approach to force migration, but be flexible for genuinely blocked teams"
    ],
    "commonMistakes": [
      "Mandating the change without buy-in � creates resentment and passive resistance",
      "Underestimating migration effort � always scope 2-3x more time than you think",
      "Making the change a big bang instead of incremental � too risky and hard to roll back",
      "Not providing enough support � teams struggle and the change gets a bad reputation"
    ],
    "answerStructure": [
      "Set context: what was the current architecture, what problems motivated the change?",
      "Describe the proposed change: what new architecture or pattern did you advocate for?",
      "Explain your approach: how did you build the case, create a POC, and get initial buy-in?",
      "Describe the rollout: incremental adoption, early adopters, support structure (docs, office hours, codemods)",
      "Handle resistance: what were the common concerns and how did you address them?",
      "Share the outcome: adoption rate, measured impact, lessons learned about driving change"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "SENIOR",
  "category": "BEHAVIORAL",
  "question": "Describe a critical production incident you handled. How did you diagnose the issue under pressure, coordinate the response, and lead the post-mortem? What systemic changes did you implement to prevent recurrence?",
  "difficulty": "MEDIUM",
  "skills": ["Incident Response", "Leadership", "Reliability", "Post-mortem"],
  "estimatedTime": "5-7 min",
  "guidance": {
    "keyPoints": [
      "Incident response follows a clear protocol: stop the bleeding (mitigate), understand the root cause, fix, monitor",
      "Under pressure, the first step is to assess blast radius and decide: rollback, hotfix, or feature flag disable",
      "Communication is critical during incidents: status updates to stakeholders, clear ownership of actions, timeline tracking",
      "Post-mortems should be blameless � focus on systemic failures, not individual mistakes",
      "Action items from post-mortems must be tracked to completion � the real value is in prevention",
      "Game days and chaos engineering prepare the team to respond effectively when real incidents occur"
    ],
    "commonMistakes": [
      "Jumping to fix without understanding the root cause � can make the situation worse",
      "Poor communication during the incident � stakeholders are left in the dark, eroding trust",
      "Blaming individuals in the post-mortem � people hide mistakes instead of surfacing them",
      "Not following through on action items � the same incident happens again"
    ],
    "answerStructure": [
      "Set context: what was the service, what was the severity, how was it detected?",
      "Describe the immediate response: how did you assess impact, who did you notify, what mitigation was applied?",
      "Explain the diagnosis: what tools did you use (logs, metrics, tracing), how did you find the root cause?",
      "Detail the fix: what change resolved the incident, how was it deployed?",
      "Describe the post-mortem: who participated, what was the timeline, what were the root causes and contributing factors?",
      "Share the systemic changes: what action items came out of the post-mortem, how were they tracked and implemented?"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "SENIOR",
  "category": "BEHAVIORAL",
  "question": "Tell me about a time you drove adoption of a new technology or tool across your organization. How did you evaluate alternatives, build a proof of concept, convince others, and handle the migration?",
  "difficulty": "HARD",
  "skills": ["Technology Adoption", "Influence", "Strategy", "Evaluation"],
  "estimatedTime": "5-7 min",
  "guidance": {
    "keyPoints": [
      "Technology evaluation should be systematic: define criteria (performance, DX, ecosystem, learning curve, maintenance cost), score alternatives, and validate with a POC",
      "A POC should test the riskiest assumptions first � not just the happy path",
      "Convincing others requires understanding their perspective: engineers care about DX and performance, managers care about cost and risk, leaders care about strategic alignment",
      "Migration should be incremental with clear success criteria and a rollback plan",
      "Document the decision: what was evaluated, why this was chosen, what were the trade-offs",
      "Celebrate early wins and share metrics to build momentum for broader adoption"
    ],
    "commonMistakes": [
      "Falling in love with the technology and ignoring its downsides � every choice has trade-offs",
      "Building the POC in isolation without involving potential users � misses real-world constraints",
      "Assuming everyone will see the value � you need to actively sell the change, not just announce it",
      "Not planning for the long-term maintenance burden of the new technology"
    ],
    "answerStructure": [
      "Set context: what problem were you trying to solve, what technology areas were considered?",
      "Describe the evaluation process: what criteria, what alternatives, how did you score them?",
      "Explain the POC: what did you build, what did you learn, what risks did you validate?",
      "Describe how you convinced others: who were the key stakeholders, what arguments resonated, how did you address concerns?",
      "Detail the migration: was it incremental or big bang, what support did you provide, what were the challenges?",
      "Share the outcome: adoption metrics, before/after comparison, lessons learned about driving technology change"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "SENIOR",
  "category": "BEHAVIORAL",
  "question": "Describe a time when organizational changes (reorgs, changing priorities, team restructuring) affected your work. How did you adapt, maintain team morale, and continue delivering value?",
  "difficulty": "MEDIUM",
  "skills": ["Adaptability", "Resilience", "Leadership", "Change Management"],
  "estimatedTime": "5-7 min",
  "guidance": {
    "keyPoints": [
      "Organizational change creates uncertainty � the best response is to focus on what you can control",
      "Maintaining morale requires transparent communication: acknowledge the uncertainty, share what is known, and be honest about what is not",
      "Re-establishing team norms and goals quickly after a reorg prevents productivity loss",
      "Building relationships with new team members and stakeholders is a priority after restructuring",
      "Use the change as an opportunity to revisit priorities and shed work that is no longer aligned",
      "Lead by example: demonstrate adaptability and a positive attitude even when the situation is difficult"
    ],
    "commonMistakes": [
      "Ignoring the emotional impact of change on the team � pretending everything is normal",
      "Holding onto old ways of working instead of adapting to the new structure",
      "Spreading rumors or negativity � amplifies anxiety across the team",
      "Waiting for clarity instead of creating it � be proactive in defining your team new role and priorities"
    ],
    "answerStructure": [
      "Set context: what organizational change occurred (reorg, leadership change, priority shift)?",
      "Describe the impact: how did it affect your team, your projects, your role?",
      "Explain your response: how did you adapt personally, how did you support your team?",
      "Detail the actions you took: team building activities, priority reset sessions, new communication channels",
      "Share the outcome: how did the team navigate the change, what was the long-term result?",
      "Reflect on what you learned about navigating organizational change"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "SENIOR",
  "category": "BEHAVIORAL",
  "question": "What is your approach to interviewing and evaluating engineering candidates? Describe a time you improved your team hiring process. What do you look for beyond technical skills?",
  "difficulty": "MEDIUM",
  "skills": ["Hiring", "Interviewing", "Team Building", "Assessment"],
  "estimatedTime": "5-7 min",
  "guidance": {
    "keyPoints": [
      "Good hiring focuses on potential and trajectory, not just current knowledge � can they learn what they do not know?",
      "Beyond technical skills: communication clarity, collaboration style, ownership mindset, growth orientation, and cultural contribution",
      "Structured interviews with rubrics reduce bias and improve hiring consistency",
      "A good interview process evaluates signals that predict job performance: problem-solving, communication, collaboration, technical judgment",
      "Continuous improvement: collect interviewer feedback, track hire success, and iterate on the process",
      "Involve the team in hiring decisions but have clear ownership to avoid decision paralysis"
    ],
    "commonMistakes": [
      "Hiring for cultural fit instead of cultural contribution � hires should add diversity of thought",
      "Using unstructured interviews � questions vary by interviewer, making comparison impossible",
      "Over-weighting algorithmic skills for frontend roles � system design and real-world problem solving matter more",
      "Making hiring decisions based on gut feeling rather than structured feedback and data"
    ],
    "answerStructure": [
      "Describe your hiring philosophy: what do you look for in a candidate, what signals predict success?",
      "Explain the evaluation criteria: technical skills, problem-solving, communication, collaboration, growth potential",
      "Describe a process improvement you made: what was wrong, what did you change, what was the impact?",
      "Detail how you assess non-technical skills: situational questions, past behavior questions, pair programming observation",
      "Discuss how you involve the team: debrief sessions, structured feedback forms, decision framework",
      "Share results: did the process improvement lead to better hires, faster cycle time, or improved candidate experience?"
    ]
  }
})

q({
  "role": "FRONTEND",
  "level": "SENIOR",
  "category": "BEHAVIORAL",
  "question": "How do you balance technical excellence with business needs? Describe a specific situation where you had to compromise on engineering ideals to meet a business deadline, and how you handled it.",
  "difficulty": "HARD",
  "skills": ["Decision Making", "Pragmatism", "Business Acumen", "Trade-offs"],
  "estimatedTime": "5-7 min",
  "guidance": {
    "keyPoints": [
      "Engineering excellence serves business goals � perfect code that ships too late has zero value",
      "Intentional trade-offs: knowingly compromise non-critical quality dimensions while protecting critical ones (security, data integrity)",
      "Communicate the cost of shortcuts explicitly: 'This approach saves 2 weeks now but will cost 3 weeks in maintenance over the next year'",
      "Create a debt tracking system: document the shortcut, why it was necessary, and when it should be revisited",
      "Protect non-negotiables: security, accessibility, and core reliability should never be sacrificed for speed",
      "Build credibility by shipping: teams that consistently deliver earn the trust to invest in quality improvements"
    ],
    "commonMistakes": [
      "Always saying yes to business demands � burns out the team and creates unmanageable technical debt",
      "Always pushing back on timelines � loses credibility and misses market opportunities",
      "Not documenting the trade-off � the shortcut becomes permanent because no one remembers why it was taken",
      "Compromising on security or user data integrity � these compromises have real consequences"
    ],
    "answerStructure": [
      "Set context: what was the business need, what was the deadline, what was at stake?",
      "Describe the ideal approach: what would technical excellence have required in terms of time and effort?",
      "Explain the compromise: what quality dimension did you trade off, and what did you protect?",
      "Detail how you communicated: how did you explain the trade-off to stakeholders and get their agreement?",
      "Describe the mitigation: how did you track the debt, what was the plan to address it later?",
      "Share the outcome: did you meet the deadline? Did the shortcut cause problems? Was the debt eventually addressed?"
    ]
  }
})

# ============================================================
# Write JSON output
# ============================================================

output_path = r'A:\graudation-project\careerk\scripts\interview-questions\frontend.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print(f'Generated {len(questions)} questions')

# Validate
levels = {}
cats = {}
diffs = {}
for q in questions:
    levels[q["level"]] = levels.get(q["level"], 0) + 1
    cats[q["category"]] = cats.get(q["category"], 0) + 1
    diffs[q["difficulty"]] = diffs.get(q["difficulty"], 0) + 1

print(f'By level: {levels}')
print(f'By category: {cats}')
print(f'By difficulty: {diffs}')

for level in ['JUNIOR', 'MID', 'SENIOR']:
    for cat in ['TECHNICAL', 'PROBLEM_SOLVING', 'BEHAVIORAL']:
        subset = [q for q in questions if q["level"] == level and q["category"] == cat]
        e = sum(1 for q in subset if q["difficulty"] == "EASY")
        m = sum(1 for q in subset if q["difficulty"] == "MEDIUM")
        h = sum(1 for q in subset if q["difficulty"] == "HARD")
        print(f'  {level} x {cat}: {e}E {m}M {h}H')
