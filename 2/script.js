function parseVec(str) {
  return str.split(',').map(Number);
}

function solveStatics() {
  const W_rod = Number(document.getElementById("wRod").value);
  const W_crate = Number(document.getElementById("wCrate").value);
  const A = parseVec(document.getElementById("aInput").value);
  const C = parseVec(document.getElementById("cInput").value);
  const D = parseVec(document.getElementById("dInput").value);

  const unit = v => math.divide(v, math.norm(v));
  const vec = (from, to) => math.subtract(to, from);
  const cross = (a, b) => [
    a[1]*b[2] - a[2]*b[1],
    a[2]*b[0] - a[0]*b[2],
    a[0]*b[1] - a[1]*b[0]
  ];

  // Unit vectors
  const uAC = unit(vec(A, C));
  const uAD = unit(vec(A, D));

  // Forces
  const WrodVec = [0, -W_rod, 0];
  const WcrateVec = [0, -W_crate, 0];

  // Force equations (F_sum = 0)
  const row1 = [uAC[0], uAD[0], 1, 0, 0]; // x-components
  const row2 = [uAC[1], uAD[1], 0, 1, 0]; // y-components
  const row3 = [uAC[2], uAD[2], 0, 0, 1]; // z-components

  const Fx = -(WrodVec[0] + WcrateVec[0]);
  const Fy = -(WrodVec[1] + WcrateVec[1]);
  const Fz = -(WrodVec[2] + WcrateVec[2]);

  // Moment equations (M_sum = 0)
  const AD_cross = (T) => cross(A, math.multiply(T, uAD));
  const AC_cross = (T) => cross(A, math.multiply(T, uAC));
  const Wc_cross = cross(A, WcrateVec);
  const Wr_cross = cross(math.divide(A, 2), WrodVec);

  // Only keep coefficients of T_AC, T_AD
  const m1 = cross(A, uAC);
  const m2 = cross(A, uAD);

  const row4 = [m1[0], m2[0], 0, 0, 0];
  const row5 = [m1[1], m2[1], 0, 0, 0];
  const row6 = [m1[2], m2[2], 0, 0, 0];

  const Mx = -(Wc_cross[0] + Wr_cross[0]);
  const My = -(Wc_cross[1] + Wr_cross[1]);
  const Mz = -(Wc_cross[2] + Wr_cross[2]);

  // Combine all rows
  const A_matrix = [
    row1,
    row2,
    row3,
    row4,
    row5,
    row6
  ];

  const b_vector = [Fx, Fy, Fz, Mx, My, Mz];

  try {
    const solution = math.lusolve(A_matrix, b_vector);
    const T_AC = solution[0][0].toFixed(2);
    const T_AD = solution[1][0].toFixed(2);

    document.getElementById("results").innerHTML = `
      <strong>Results:</strong><br>
      T<sub>AC</sub> = ${T_AC} N<br>
      T<sub>AD</sub> = ${T_AD} N
    `;
  } catch (err) {
    document.getElementById("results").innerHTML = "❌ Error solving. Check input values.";
    console.error(err);
  }
}
