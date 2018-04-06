# ASLR Derandomization Attack

## Description
The ASLR Derandomization attack seeks to use Javascript and timing attack methods to derandomize
the locations of memory

## Our Precise Timers
Performance.now() returns a timestamp, although the set of values that the function can return is not continuous. There is a delay on the order of microseconds in which the return value of performance.now is incremented. To prove this, upon running a tight loop of counter incrementations until the tick occurs, we find that we can fit in a large number of iterations before the return value of performance.now is changed.

Browsers have decreased the precisions of JS timers in an effort to reduce the effectiveness of timing attacks. We seek to develop timers that have a higher level of precision. Below are two such examples.

- **Time To Tick Timer**
Now, instead of measuring how long memory references take using native Javascript functions, we first wait for performance.now() to tick, so that we catch it at the start of its interval. We then execute the memory reference, and count how long it takes for performance.now to reach its next tick. If the memory access was a fast cache access, there is greater time left until the second tick than if we accessed the memory in DRAM.

- **Shared Memory Counter**
In this timer, we use a seperate core for counting. In a seperate thread, we have a counter incrementing. In the main thread, we grab the value of that counter (c1), perform the access, and then grab the counter again (c2). Slow memory accesses to main memory will have a larger c2-c1 than fast memory accesses.