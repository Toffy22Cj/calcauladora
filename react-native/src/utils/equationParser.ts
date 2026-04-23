export interface ParsedSystem {
  A: number[][];
  b: number[];
  vars: string[];
  error?: string;
}

export function parseLinearEquations(text: string): ParsedSystem {
  if (!text || text.trim() === '') {
    return { A: [], b: [], vars: [], error: 'El sistema está vacío' };
  }

  const lines = text.split('\n').map(l => l.trim()).filter(l => l);
  const equations = [];

  for (let i = 0; i < lines.length; i++) {
    const eqStr = lines[i];
    const eq = eqStr.replace(/\s+/g, "");
    const parts = eq.split("=");
    
    if (parts.length > 2) {
      return { A: [], b: [], vars: [], error: `Múltiples signos de igual en la línea ${i + 1}: ${eqStr}` };
    }

    const left = parts[0] || "";
    const right = parts[1] || "0";

    const terms: Record<string, number> = {};
    let constant = 0;

    const parseSide = (sideStr: string, multiplier: number) => {
      if (!sideStr) return true;
      
      // Add a leading + if it doesn't have a sign
      if (sideStr[0] !== '+' && sideStr[0] !== '-') {
        sideStr = '+' + sideStr;
      }
      
      const regex = /([+-])([0-9]*\.?[0-9]*)([a-zA-Z]*)/g;
      let match;
      let lastIndex = 0;
      let matchCount = 0;
      
      while ((match = regex.exec(sideStr)) !== null) {
        if (match.index !== lastIndex) {
          // There was some invalid character skipped by regex
          return false;
        }
        lastIndex = regex.lastIndex;
        matchCount++;

        const sign = match[1] === '-' ? -1 : 1;
        const numStr = match[2];
        const varName = match[3];

        let num = 1;
        if (numStr !== "") {
          num = parseFloat(numStr);
        }

        const value = sign * num * multiplier;

        if (varName) {
          terms[varName] = (terms[varName] || 0) + value;
        } else {
          constant += value;
        }
      }
      
      return lastIndex === sideStr.length;
    };

    const leftValid = parseSide(left, 1);
    const rightValid = parseSide(right, -1);

    if (!leftValid || !rightValid) {
      return { A: [], b: [], vars: [], error: `Error de sintaxis en la ecuación ${i + 1}: ${eqStr}` };
    }

    equations.push({ terms, constant });
  }

  // Find all unique variables
  const varSet = new Set<string>();
  equations.forEach(eq => {
    Object.keys(eq.terms).forEach(v => varSet.add(v));
  });

  const vars = Array.from(varSet).sort();

  if (vars.length === 0) {
    return { A: [], b: [], vars: [], error: 'No se encontraron variables en el sistema' };
  }

  // Build A and b
  const A: number[][] = [];
  const b: number[] = [];

  for (let i = 0; i < equations.length; i++) {
    const eq = equations[i];
    const row = vars.map(v => eq.terms[v] || 0);
    A.push(row);
    // Move constant to the other side: terms + constant = 0 => terms = -constant
    b.push(-eq.constant);
  }

  if (A.length !== vars.length) {
    return { 
      A, 
      b, 
      vars, 
      error: `Sistema no cuadrado: hay ${A.length} ecuaciones pero ${vars.length} variables (${vars.join(', ')}). Para Jacobi se requiere el mismo número.`
    };
  }

  return { A, b, vars };
}
