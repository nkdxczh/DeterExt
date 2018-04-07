import java.io.PrintWriter;

public class AsmModule {
    public static void main(String[] argv) {

        // Create the strings that represent repeated bodies of code in the file to write
        String moduleHeader = "/** THE FOLLOWING CODE HAS BEEN GENERATED. DO NOT MODIFY */" +
        "function asmModule(stdlib, foreign, heap) {" +
        "\"use asm\";";
        String functionContents = "if (x !== 0) {" +
        "x = +x;" +
        "var y = x + 2 * x;" +
        "var y = (x << 4) * 5;" +
        "var z = y * y / x;" +
        "z = z >> 2 * y;" +
        "return +(x * z);" +
        "}";
        String moduleReturn = "return {";

        try {
            // Open a new file for writing
            PrintWriter writer = new PrintWriter("../js/asm_module.js", "UTF-8");

            // Write the initial contents
            writer.println(moduleHeader);
            writer.println();

            // Write out 131072 (2^17) functions to the file, all with the same contents, but with different names
            System.out.println("Writing out all 131072 functions...");
            for (int i = 1; i < 131072; i++) {
                writer.println("function func" + i + "(x) {" + functionContents + "}");
                writer.println();
                moduleReturn += ("func" + i + ": " + "func" + i + ",\n");
            }

            // Take care of the final case
            writer.println("function func" + 131072 + "(x) {" + functionContents + "}");
            writer.println();
            moduleReturn += ("func" + 131072 + ": " + "func" + 131072 + "};");

            // Close the module
            writer.println(moduleReturn);
            writer.println("}");

            System.out.println("Done!");

            // Close the writer
            writer.close();
        } catch (Exception e) {
            e.printStackTrace();
            return;
        }
    }
}