// script.js
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

    const coeffs = [
      [0, 0, 1, 0, 0, 1, 0, 0, 1], // sum Fz
      ...[A, B, C, W_loc].map((pt, idx) => {
        const F = idx < 3 ? [0, 0, 1] : [-W_vec[0], -W_vec[1], -W_vec[2]];
        return cross(pt, F);
      })
    ];

    const rhs = [W, 0, 0, 0];

    const mathjs = window.math;
    const A_matrix = mathjs.matrix(coeffs);
    const b_vector = mathjs.matrix(rhs);
    const sol = mathjs.lusolve(A_matrix, b_vector);
    const [F_A, F_B, F_C] = sol._data;

    document.getElementById('output').textContent =
      `F_A = ${F_A.toFixed(3)} N\n` +
      `F_B = ${F_B.toFixed(3)} N\n` +
      `F_C = ${F_C.toFixed(3)} N`;

  } catch (error) {
    document.getElementById('output').textContent = 'Error solving system. Check input.';
  }
}
