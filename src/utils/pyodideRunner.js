// Pyodide Python execution engine with fallback evaluator
// IMPORTANT: Each run uses an isolated namespace to prevent variable leakage between activities.

let pyodideInstance = null;
let isLoadingPyodide = false;

export async function initPyodideEngine() {
  if (pyodideInstance) return pyodideInstance;
  if (isLoadingPyodide) {
    while (isLoadingPyodide) {
      await new Promise(r => setTimeout(r, 200));
      if (pyodideInstance) return pyodideInstance;
    }
  }

  if (window.loadPyodide) {
    isLoadingPyodide = true;
    try {
      pyodideInstance = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/'
      });
      isLoadingPyodide = false;
      return pyodideInstance;
    } catch (e) {
      console.warn('Pyodide CDN load failed, using fallback evaluator.', e);
      isLoadingPyodide = false;
    }
  }
  return null;
}

export async function runPythonCode(code) {
  try {
    const pyodide = await initPyodideEngine();
    if (pyodide) {
      // Each run gets a FRESH isolated namespace — prevents variable leakage between activities!
      const isolatedSetup = `
import sys
import io

# Fresh isolated stdout/stderr per run
_stdout = io.StringIO()
_stderr = io.StringIO()
sys.stdout = _stdout
sys.stderr = _stderr

# Run user code in a clean local namespace
_user_ns = {}
`;
      await pyodide.runPythonAsync(isolatedSetup);

      let error = null;

      try {
        // Execute user code in isolated namespace using exec()
        const wrappedCode = `
exec(${JSON.stringify(code)}, _user_ns)
`;
        await pyodide.runPythonAsync(wrappedCode);
      } catch (err) {
        error = err.message;
      }

      const stdout = await pyodide.runPythonAsync('_stdout.getvalue()');
      const stderr = await pyodide.runPythonAsync('_stderr.getvalue()');

      return {
        output: (stdout + stderr).trim(),
        error: error ? error : null
      };
    }
  } catch (err) {
    console.error('Pyodide execution error:', err);
  }

  // Fallback Python code output evaluator for simple print statements / arithmetic
  return evaluatePythonFallback(code);
}

function evaluatePythonFallback(code) {
  let output = [];
  let error = null;

  try {
    const lines = code.split('\n');
    // Fresh scope for every run — no cross-activity pollution
    let scope = {};

    for (let line of lines) {
      line = line.trim();
      if (!line || line.startsWith('#')) continue;

      if (line.startsWith('print(') && line.endsWith(')')) {
        const expr = line.substring(6, line.length - 1).trim();
        if (expr.startsWith('"') && expr.endsWith('"')) {
          output.push(expr.slice(1, -1));
        } else if (expr.startsWith("'") && expr.endsWith("'")) {
          output.push(expr.slice(1, -1));
        } else if (scope[expr] !== undefined) {
          output.push(String(scope[expr]));
        } else if (!isNaN(Number(expr))) {
          output.push(expr);
        } else {
          // Simple arithmetic evaluator using scope vars
          try {
            // Substitute known scope variables in expr
            let evalExpr = expr;
            for (const [varName, varVal] of Object.entries(scope)) {
              evalExpr = evalExpr.replace(new RegExp(`\\b${varName}\\b`, 'g'), varVal);
            }
            const val = Function('"use strict"; return (' + evalExpr + ')')();
            output.push(String(val));
          } catch (e) {
            output.push(`NameError: name '${expr}' is not defined`);
            error = `NameError: name '${expr}' is not defined`;
          }
        }
      } else if (line.includes('=') && !line.startsWith('if') && !line.startsWith('while')) {
        // Simple assignment parser
        const eqIdx = line.indexOf('=');
        const varName = line.substring(0, eqIdx).trim();
        const valExpr = line.substring(eqIdx + 1).trim();

        if (varName && !varName.includes(' ')) {
          if (!isNaN(Number(valExpr))) {
            scope[varName] = Number(valExpr);
          } else if ((valExpr.startsWith('"') && valExpr.endsWith('"')) || (valExpr.startsWith("'") && valExpr.endsWith("'"))) {
            scope[varName] = valExpr.slice(1, -1);
          } else {
            // Try evaluating rhs with scope substitution
            try {
              let evalExpr = valExpr;
              for (const [vn, vv] of Object.entries(scope)) {
                evalExpr = evalExpr.replace(new RegExp(`\\b${vn}\\b`, 'g'), vv);
              }
              const val = Function('"use strict"; return (' + evalExpr + ')')();
              scope[varName] = val;
            } catch (e) {
              // Ignore unparseable assignments
            }
          }
        }
      }
    }
  } catch (e) {
    error = e.message;
  }

  return {
    output: output.join('\n'),
    error: error
  };
}
