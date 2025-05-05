Thank you for the interesting assignment! 🙂

I explored two solutions to the problem. One of them — Queue-first-version-not-liked.ts — I ultimately discarded because
it involved unnecessary iterations and had poor algorithmic complexity.

The final implementation can be found in Queue.ts.

While working on the first version, I realized that scenarios where a single worker handles multiple items break the
logic — this led me to rethink the design.

In the second version, I solved this by assigning one item to a single worker. This guarantees that only one worker
processes a given item at a time. As a result, some workers may remain idle, but the processing remains correct and
consistent.

Most of the methods and variable names are self-explanatory. So you'll easily understand the reason of them.

The current solution ensures full concurrency safety with O(1) operations for enqueuing and dequeuing messages. It’s
scalable and maintains a clear separation of concerns for worker–item coordination.

I considered writing a few test cases as well, but since it wasn’t part of the requirements, I decided to skip that for
now.

Total time spent on this task: ~2–3 hours including exploration, debugging, and final polishing.

Notes for improvement:

- If we'll need worker result, we should consider adding await Promise.all() for worker completion.
- Worker dies silently when queue is empty. That’s fine for this test, but in a real system you might want
  retry,wait,backoff logic.
