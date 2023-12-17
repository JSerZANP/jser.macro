import { MacroParams, createMacro, MacroError } from "babel-plugin-macros";
import t from "@babel/types";

function macro({ references }: MacroParams) {
  const { runCodeForEnvVar } = references;
  runCodeForEnvVar.forEach((path) => {
    const call = path.parent;
    if (t.isCallExpression(call)) {
      const [firstArg, secondArg] = call.arguments;
      if (!t.isStringLiteral(firstArg)) {
        throw new MacroError(
          "1st argument of runCodeForEnvVar() must be a string literal"
        );
      }
      if (
        !(
          t.isArrowFunctionExpression(secondArg) ||
          t.isFunctionExpression(secondArg)
        )
      ) {
        throw new MacroError(
          "2nd argument of runCodeForEnvVar() must be a function expression."
        );
      }

      // now check if the env var matches
      const isValid = process.env[firstArg.value] === "true";

      if (isValid) {
        path.parentPath?.replaceWith(t.callExpression(secondArg, []));
      } else {
        path.parentPath?.remove();
      }
    } else {
      throw new MacroError(
        "runCodeForEnvVar should be called as runCodeForEnvVar(envVarName, function)"
      );
    }
  });
}

export default createMacro(macro);
