# ASM Module-Maker

## Motivation
In an effort to implement the AnC attack described by the paper in the parent directory,
we must first develop a module of code that will contain functions scattered uniformly across
our pages in memory. Each function has a predictable machine-code size in target browsers, and
the machine code of these functions start at a browser-dependent but known offset in the page.
Given all of this, we can figure out the relative offset of each function in the asm object.

Each function's contents is blocked by an if statement to minimize the effect they have on the cache
(without affecting the function size). Our goal is to hit a single cache line when executing a function,
but still maintain a large enough offset from the next function in the module.

## Description
The Java code included in this directory generates a Javascript file containing an asm.js module with
approximately 2^17 functions. Each function, as previously stated, should contain an if statement to
block actual execution. At the bottom of the module, we also return an object that makes all of our
functions visible to callers.

## Compilation, Packaging, & Running
In order to compile and run successfully, ensure you have the JDK installed on your machine, and that you hava a JAVA_HOME environment variable set to its location.

To compile the java code, run:
    **javac AsmModule.java**

To package the java class file into a JAR file, run:
    **jar cfmv AsmModule.jar Manifest.txt AsmModule.class**

Lastly, to run the program:
    **java -jar AsmModule.jar**