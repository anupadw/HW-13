function parseVec2(str) {
  return str.split(',').map(Number);
}

function solveStatics() {
  const W = parseFloat(document.getElementById("W").value);
  const l = parseFloat(document.getElementById("l").value);
  const d = parseFloat(document.getElementById("d").value);

  const A = parseVec2(document.getElementById("A").value);
  const B = parseVec2(document.getElementById("B").value);
  const C = parseVec2(document.getElementById("C").value);
  const W_loc = [d/2, l/2];

  // Force equilibrium: F_A + F_B + F_C = W
  // Moment about A and B: use 2D cross products (scalar)
  const rB_A = [B[0] - A[0], B[1] - A[1]];
  const rC_A = [C[0] - A[0], C[1] - A[1]];
  const rW_A = [W_loc[0] - A[0], W_loc[1] - A[1]];

  const rA_B = [A[0] - B[0], A[1] - B[1]];
  const rC_B = [C[0] - B[0], C[1] - B[1]];
  const rW_B = [W_loc[0] - B[0], W_loc[1] - B[1]];

  function cross2D(r, fz = 1) {
    return r[0] * 0 - r[1] * fz; // 2D moment (z = r_x * Fy - r_y * Fx) -> only Fy = Fz matters
  }

  const A_matrix = [
    [1, 1, 1],
    [0, cross2D(rB_A), cross2D(rC_A)],
    [cross2D(rA_B), 0, cross2D(rC_B)]
  ];

  const b_vector = [
    W,
    cross2D(rW_A, W),
    cross2D(rW_B, W)
  ];

  try {
    const result = math.lusolve(A_matrix, b_vector);
    const F_A = result[0][0].toFixed(2);
    const F_B = result[1][0].toFixed(2);
    const F_C = result[2][0].toFixed(2);

    document.getElementById("results").innerHTML = `
      <p><strong>Results:</strong></p>
      <p>F<sub>A</sub> = ${F_A} kN</p>
      <p>F<sub>B</sub> = ${F_B} kN</p>
      <p>F<sub>C</sub> = ${F_C} kN</p>
    `;
  } catch (err) {
    console.error(err);
    document.getElementById("results").innerHTML = "⚠️ Error solving system. Check input.";
  }
}
