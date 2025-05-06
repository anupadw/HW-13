function parsePoint(input) {
  return input.split(',').map(Number).concat(0);
}

function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function solveStatics() {
  try {
    const W = parseFloat(document.getElementById('W').value);
    const l = parseFloat(document.getElementById('l').value);
    const d = parseFloat(document.getElementById('d').value);
    const A = parsePoint(document.getElementById('A').value);
    const B = parsePoint(document.getElementById('B').value);
    const C = parsePoint(document.getElementById('C').value);

    const W_vec = [0, 0, -W];
    const W_loc = [d / 2, l / 2, 0];

    const FA = [0, 0, 1];
    const FB = [0, 0, 1];
    const FC = [0, 0, 1];

    // Force equations: sum Fz
    const row1 = [0, 0, 1, 0, 0, 1, 0, 0, 1]; // Fz total = W

    // Moment equations: sum moments about origin
    const mA = cross(A, FA);
    const mB = cross(B, FB);
    const mC = cross(C, FC);
    const mW = cross(W_loc, [-W_vec[0], -W_vec[1], -W_vec[2]]);

    const row2 = [mA[0], mB[0], mC[0]];
    const row3 = [mA[1], mB[1], mC[1]];
    const row4 = [mA[2], mB[2], mC[2]];

    const A_matrix = math.matrix([
      row1,
      row2,
      row3,
      row4
    ]);

    const b_vector = math.matrix([
      W,
      mW[0],
      mW[1],
      mW[2]
    ]);

    const sol = math.lusolve(A_matrix, b_vector);
    const [F_A, F_B, F_C] = sol.map(row => row[0]);

    document.getElementById('output').textContent =
      `F_A = ${F_A.toFixed(3)} kN\n` +
      `F_B = ${F_B.toFixed(3)} kN\n` +
      `F_C = ${F_C.toFixed(3)} kN`;

  } catch (error) {
    document.getElementById('output').textContent = 'Error solving system. Check input.';
  }
}
