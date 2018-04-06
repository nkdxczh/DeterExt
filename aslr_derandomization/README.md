# Description
The ASLR Derandomization attack seeks to use Javascript and timing attack methods to derandomize
the locations of memory

# Our Precise Timer
Browsers have decreased the precisions of JS timers in an effort to reduce the effectiveness of timing
attacks. We seek to develop a precise timer using performance.now()

Performance.now() returns a timestamp, although the set of values that the function can return is not
continuous. There is a delay on the order of microseconds in which the return value of performance.now is
incremented. Knowing this, we attempt to first find the average value of this "tick" time. Upon running a
tight loop of counter incrementations until the tick occurs, we find that we can fit in approximately 270
iterations of a loop before the return value is modified.

Now, instead of measuring how long memory references take using native Javascript functions, we first wait for performance.now() to tick, so that we catch it at the start of its interval. We then execute the memory reference, and count how long it takes for performance.now to reach its next tick. If the memory access was a fast cache access, there is greater time left until the second tick than if we accessed the memory in DRAM.