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

  const Wrod = [0, -W_rod, 0];
  const Wcrate = [0, -W_crate, 0];

  // Unit vectors
  const AC_dir = math.subtract(C, A);
  const AD_dir = math.subtract(D, A);
  const uAC = math.divide(AC_dir, math.norm(AC_dir));
  const uAD = math.divide(AD_dir, math.norm(AD_dir));

  // Cross products for moments
  const crossA_AC = cross(A, uAC);
  const crossA_AD = cross(A, uAD);
  const crossA_Wcrate = cross(A, Wcrate);
  const crossA2_Wrod = cross(math.divide(A, 2), Wrod);

  // System matrix (6 equations, 6 unknowns: T_AC, T_AD, Ax, Ay, Az, Mz helper)
  const A_matrix = [
    [ uAC[0], uAD[0], 1, 0, 0, 0 ],  // Fx
    [ uAC[1], uAD[1], 0, 1, 0, 0 ],  // Fy
    [ uAC[2], uAD[2], 0, 0, 1, 0 ],  // Fz
    [ crossA_AC[0], crossA_AD[0], 0, 0, 0, 1 ],  // Mx
    [ crossA_AC[1], crossA_AD[1], 0, 0, 0, 0 ],  // My
    [ crossA_AC[2], crossA_AD[2], 0, 0, 0, 0 ]   // Mz
  ];

  const b_vector = [
    -Wrod[0] - Wcrate[0],
    -Wrod[1] - Wcrate[1],
    -Wrod[2] - Wcrate[2],
    -crossA_Wcrate[0] - crossA2_Wrod[0],
    -crossA_Wcrate[1] - crossA2_Wrod[1],
    -crossA_Wcrate[2] - crossA2_Wrod[2]
  ];

  try {
    const result = math.lusolve(A_matrix, b_vector);
    const T_AC = result[0][0].toFixed(2);
    const T_AD = result[1][0].toFixed(2);

    document.getElementById("results").innerHTML = `
      <p><strong>Results:</strong></p>
      <p>T<sub>AC</sub> = ${T_AC} N</p>
      <p>T<sub>AD</sub> = ${T_AD} N</p>
    `;
  } catch (err) {
    document.getElementById("results").innerHTML = "Error solving equations. Check inputs.";
    console.error(err);
  }
}
