function parseVec2(str) {
  return str.split(',').map(Number);
}

function cross(a, b) {
  return [
    a[1]*b[2] - a[2]*b[1],
    a[2]*b[0] - a[0]*b[2],
    a[0]*b[1] - a[1]*b[0]
  ];
}

function solveStatics() {
  const W = parseFloat(document.getElementById("W").value);
  const l = parseFloat(document.getElementById("l").value);
  const d = parseFloat(document.getElementById("d").value);

  const A = [...parseVec2(document.getElementById("A").value), 0];
  const B = [...parseVec2(document.getElementById("B").value), 0];
  const C = [...parseVec2(document.getElementById("C").value), 0];
  const W_vec = [0, 0, -W];
  const W_loc = [d/2, l/2, 0];

  // Force vectors
  const FA = [0, 0, 1];
  const FB = [0, 0, 1];
  const FC = [0, 0, 1];

  // Moment arms
  const MA = cross(A, FA);
  const MB = cross(B, FB);
  const MC = cross(C, FC);
  const MW = cross(W_loc, W_vec);

  const A_matrix = [
    [FA[0], FB[0], FC[0]], // Fx
    [FA[1], FB[1], FC[1]], // Fy
    [FA[2], FB[2], FC[2]], // Fz
    [MA[0], MB[0], MC[0]], // Mx
    [MA[1], MB[1], MC[1]], // My
    [MA[2], MB[2], MC[2]]  // Mz
  ];

  const b_vector = [
    -W_vec[0],
    -W_vec[1],
    -W_vec[2],
    -MW[0],
    -MW[1],
    -MW[2]
  ];

  try {
    const solution = math.lusolve(A_matrix, b_vector);
    const F_A = solution[0][0].toFixed(2);
    const F_B = solution[1][0].toFixed(2);
    const F_C = solution[2][0].toFixed(2);

    document.getElementById("results").innerHTML = `
      <p><strong>Results:</strong></p>
      <p>F<sub>A</sub> = ${F_A} kN</p>
      <p>F<sub>B</sub> = ${F_B} kN</p>
      <p>F<sub>C</sub> = ${F_C} kN</p>
    `;
  } catch (err) {
    console.error(err);
    document.getElementById("results").innerHTML = "⚠️ Error: Unable to solve system. Check your inputs.";
  }
}
