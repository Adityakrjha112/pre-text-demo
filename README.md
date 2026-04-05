# ⚡ Pretext.js Guide (Simple Demo)

This project demonstrates how to use **Pretext.js** to manually control and customize text layout.

## 🔗 Live Demo
👉 https://adityakrjha112.github.io/pre-text-demo/

Pretext.js allows you to:

* Split text into segments (words, spaces, emojis)
* Measure text width accurately
* Create custom layouts (single-line, multi-line, or dynamic rendering)

---

## 🚀 Getting Started

### Option 1: Local Setup

```html
<script type="module">
import {
  prepare,
  prepareWithSegments,
  layout,
  layoutWithLines,
  layoutNextLine,
  walkLineRanges,
  setLocale,
  clearCache,
  profilePrepare
} from './pretext.js';
</script>
```

---

## 📦 Pretext Functions Explained

---

### 🔹 1. `prepare`

**What it does:**
Creates a basic text setup without splitting it into segments.

```js
const prepared = prepare("Hello world", "16px Arial");
```

**Output / Behavior:**
Text is prepared for layout but remains as a single block.

**When to use:**
Use when you only need simple layout handling.

---

### 🔹 2. `prepareWithSegments`

**What it does:**
Splits text into smaller segments like words, spaces, and emojis.

```js
const prepared = prepareWithSegments("Hello world 👋", "16px Arial");
console.log(prepared.segments);
```

**Output:**

```js
["Hello", " ", "world", " ", "👋"]
```

**When to use:**
Best for animations and fine-grained control over text.

---

### 🔹 3. `layout`

**What it does:**
Fits text into a single line within a given width.

```js
const result = layout(prepared, 200);
```

**Output / Behavior:**
Returns one line that fits inside `200px`.

**When to use:**
When only a single-line layout is required.

---

### 🔹 4. `layoutWithLines`

**What it does:**
Breaks text into multiple lines based on width.

```js
const layoutData = layoutWithLines(prepared, 200, 24);

layoutData.lines.forEach(line => {
  console.log(line.text);
});
```

**Output Example:**

```
Hello world
👋
```

**When to use:**
Use for responsive layouts and multi-line text rendering.

---

### 🔹 5. `layoutNextLine`

**What it does:**
Generates text line-by-line dynamically.

```js
let cursor = 0;

while (true) {
  const result = layoutNextLine(prepared, cursor, 200);
  if (!result) break;

  console.log(result.line.text);
  cursor = result.next;
}
```

**Output / Behavior:**
Prints lines one by one.

**When to use:**
Useful for streaming text or lazy rendering.

---

### 🔹 6. `walkLineRanges`

**What it does:**
Iterates through all lines automatically.

```js
walkLineRanges(prepared, 200, (line) => {
  console.log(line.width, line.start, line.end);
});
```

**Output / Behavior:**
Provides width and position of each line.

**When to use:**
Best for custom rendering or animations.

---

### 🔹 7. `setLocale`

**What it does:**
Applies language-specific rules for text breaking.

```js
setLocale("hi");
```

**Output / Behavior:**
Text breaks correctly for the selected language.

**When to use:**
Use for multilingual or non-English text.

---

### 🔹 8. `clearCache`

**What it does:**
Clears cached measurements.

```js
clearCache();
```

**Output / Behavior:**
Forces fresh calculations on the next layout.

**When to use:**
Use after font or style changes.

---

### 🔹 9. `profilePrepare`

**What it does:**
Measures performance of text preparation.

```js
const stats = profilePrepare("Hello world 👋", "16px Arial");
console.log(stats);
```

**Output Example:**

```js
{ totalMs: 0, preparedSegments: 5 }
```

**When to use:**
Use for performance testing and optimization.

---


