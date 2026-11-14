# DSA Studio

A private, buildless learning studio made with HTML, compiled Tailwind CSS, vanilla JavaScript, GSAP 3.12.2, and D3 7.9.0. All runtime assets are bundled locally.

## Topics
- Arrays: insert, delete, update, search, reverse.
- Linked lists: singly, doubly, circular; insert/delete at start/end/position, search, reverse, sort. Wide chains scroll within the visualization.
- BST and AVL: insert, delete, search, in-order traversal, visible edges, explicit AVL rotation frames and balance factors. Duplicate tree keys are ignored.
- Stack and queue: push/pop/peek/isEmpty and enqueue/dequeue/front/isEmpty.
- Hash table: 12 buckets, normalized modulo, chaining and linear probing with tombstones.
- Graphs: editable positive-weight undirected graphs; BFS, DFS, Dijkstra.
- Dynamic programming: Fibonacci and LCS tabulation, with one reconstructed LCS.
- Sorting: bubble, selection, insertion, merge, quick, heap, radix, counting.

## Controls
Apply edits before running. Start/pause, stop, previous/next step, reset, random input, speed adjustment, and operation-specific pseudocode are shared across topics. Space toggles playback, Right Arrow steps, S stops, R resets when focus is outside a control. Switching topics loads its default example. This client-only application does not save sessions across reloads.

Input bounds keep diagrams readable: 5–24 sorting values, up to 14 list nodes, 20 tree nodes, 9 graph nodes, Fibonacci N up to 18, and LCS strings up to 8 letters. Counting and radix accept 0–999. Other numeric structures accept −99 to 999. Empty linear structures can be loaded and built interactively. The visual stack permits 8 push-generated items; user-loaded longer stacks scroll.

## Validation
Run `npm test` for deterministic engine checks, including randomized sort cases and AVL invariants after insertion/deletion. `npm run build` recompiles Tailwind. Browser QA verified player controls, custom inputs, array insertion, list types, AVL rotations/edges, stack/queue operations, probing collisions, graph distances, DP outputs, invalid input, and a 375px responsive viewport. The queue view uses a JavaScript array, so front removal is O(n); the interface explains the distinction from linked/ring queues.

## Run locally

The compiled app can run without installing dependencies:

```sh
python -m http.server 8000 --directory dist
```

Open http://localhost:8000. For Tailwind changes, install dependencies with `npm ci`, then run `npm run build`. Run `npm test` for the algorithm validation suite.

## Hosting and synchronization

The existing hosted website is private and managed separately. This repository contains the application, bundled runtime assets, tests, and build inputs. A push here does not automatically update that deployment. No GitHub Pages or public deployment workflow is configured.
