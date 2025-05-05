function parseVec(str) {
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
  const L = parseFloat(document.getElementById("L").value);
  const W = parseFloat(document.getElementById("W").value);
  const D = parseVec(document.getElementById("D").value);
  const E = parseVec(document.getElementById("E").value);

  const A = [0, L / 2, 0];
  const B = [0, L, 0];
  const W_vec = [0, 0, -W];

  const AD_dir = math.subtract(D, A);
  const uAD = math.divide(AD_dir, math.norm(AD_dir));

  const BE_dir = math.subtract(E, B);
  const uBE = math.divide(BE_dir, math.norm(BE_dir));

  const rAD = A;
  const rBE = B;
  const rW = B;

  const crossA_AD = cross(rAD, uAD);
  const crossB_BE = cross(rBE, uBE);
  const crossB_W = cross(rW, W_vec);

  const A_matrix = [
    [ uAD[0], uBE[0], 1, 0, 0, 0 ], // Fx
    [ uAD[1], uBE[1], 0, 1, 0, 0 ], // Fy
    [ uAD[2], uBE[2], 0, 0, 1, 0 ], // Fz
    [ crossA_AD[0], crossB_BE[0], 0, 0, 0, 1 ], // Mx
    [ crossA_AD[1], crossB_BE[1], 0, 0, 0, 0 ], // My
    [ crossA_AD[2], crossB_BE[2], 0, 0, 0, 0 ]  // Mz
  ];

  const b_vector = [
    -W_vec[0],
    -W_vec[1],
    -W_vec[2],
    -crossB_W[0],
    -crossB_W[1],
    -crossB_W[2]
  ];

  try {
    const solution = math.lusolve(A_matrix, b_vector);
    const T_AD = solution[0][0].toFixed(2);
    const T_BE = solution[1][0].toFixed(2);
    const Ox = solution[2][0].toFixed(2);
    const Oy = solution[3][0].toFixed(2);
    const Oz = solution[4][0].toFixed(2);

    document.getElementById("results").innerHTML = `
      <p><strong>Results:</strong></p>
      <p>T<sub>AD</sub> = ${T_AD} N</p>
      <p>T<sub>BE</sub> = ${T_BE} N</p>
      <p>O<sub>x</sub> = ${Ox} N</p>
      <p>O<sub>y</sub> = ${Oy} N</p>
      <p>O<sub>z</sub> = ${Oz} N</p>
    `;
  } catch (err) {
    document.getElementById("results").innerHTML = "Error solving system. Check input.";
    console.error(err);
  }
}
