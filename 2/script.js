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
  const W_rod = Number(document.getElementById("wRod").value);
  const W_crate = Number(document.getElementById("wCrate").value);
  const A = parseVec(document.getElementById("aInput").value);
  const C = parseVec(document.getElementById("cInput").value);
  const D = parseVec(document.getElementById("dInput").value);

  // Unit vectors
  const AC_dir = math.subtract(C, A);
  const AD_dir = math.subtract(D, A);
  const uAC = math.divide(AC_dir, math.norm(AC_dir));
  const uAD = math.divide(AD_dir, math.norm(AD_dir));

  // Forces
  const Wrod = [0, -W_rod, 0];
  const Wcrate = [0, -W_crate, 0];

  // Set up system of 6 equations: 3 for force, 3 for moment
  const A_matrix = [
    [ uAC[0], uAD[0], 1, 0, 0 ], // Fx
    [ uAC[1], uAD[1], 0, 1, 0 ], // Fy
    [ uAC[2], uAD[2], 0, 0, 1 ], // Fz
    cross(A, uAC)[0], cross(A, uAD)[0], 0, 0, 0, // Mx
    cross(A, uAC)[1], cross(A, uAD)[1], 0, 0, 0, // My
    cross(A, uAC)[2], cross(A, uAD)[2], 0, 0, 0  // Mz
  ];

  const b_vector = [
    -Wrod[0] - Wcrate[0],
    -Wrod[1] - Wcrate[1],
    -Wrod[2] - Wcrate[2],
    -cross(A, Wcrate)[0] - cross(math.divide(A, 2), Wrod)[0],
    -cross(A, Wcrate)[1] - cross(math.divide(A, 2), Wrod)[1],
    -cross(A, Wcrate)[2] - cross(math.divide(A, 2), Wrod)[2]
  ];

  try {
    const result = math.lusolve(A_matrix, b_vector);
    const T_AC = result[0][0].toFixed(2);
    const T_AD = result[1][0].toFixed(2);

    document.getElementById("results").innerHTML = `
      <strong>Results:</strong><br>
      T<sub>AC</sub> = ${T_AC} N<br>
      T<sub>AD</sub> = ${T_AD} N
    `;
  } catch (err) {
    document.getElementById("results").innerHTML = "Error solving equations.";
    console.error(err);
  }
}
