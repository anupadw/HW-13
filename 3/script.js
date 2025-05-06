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
  const A_2D = parseVec2(document.getElementById("A").value);
  const B_2D = parseVec2(document.getElementById("B").value);
  const C_2D = parseVec2(document.getElementById("C").value);

  const A = [...A_2D, 0];
  const B = [...B_2D, 0];
  const C = [...C_2D, 0];
  const W_vec = [0, 0, -W];
  const W_loc = [d/2, l/2, 0];

  const FA = [0, 0, 1];
  const FB = [0, 0, 1];
  const FC = [0, 0, 1];

  const A_matrix = [
    // Sum of forces (z only)
    [FA[0], FB[0], FC[0]],
    [FA[1], FB[1], FC[1]],
    [FA[2], FB[2], FC[2]],
    // Moments
    cross(A, FA),
    cross(B, FB),
    cross(C, FC)
  ].map(row => row.map(val => val));

  const M_W = cross(W_loc, W_vec);

  const b_vector = [
    -W_vec[0],
    -W_vec[1],
    -W_vec[2],
    -M_W[0],
    -M_W[1],
    -M_W[2]
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
    document.getElementById("results").innerHTML = "Error solving system. Check input.";
    console.error(err);
  }
}
