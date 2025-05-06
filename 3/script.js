function solveSystem() {
  const W = parseFloat(document.getElementById("W").value);
  const l = parseFloat(document.getElementById("l").value);
  const d = parseFloat(document.getElementById("d").value);

  const A = [6, 1.8, 0];
  const B = [0.4, 4.8, 0];
  const C = [5.6, 10.2, 0];
  const W_vec = [0, 0, -W];
  const W_loc = [d / 2, l / 2, 0];

  const F_A = [0, 0, 1];
  const F_B = [0, 0, 1];
  const F_C = [0, 0, 1];

  const equations = [
    [0, 0, 1, 0, 0, 1, 0, 0, 1], // Fz sum = F_A + F_B + F_C - W = 0
    [0, 0, 0, 0, 0, 0, 0, 0, 0], // Fx sum = 0
    [0, 0, 0, 0, 0, 0, 0, 0, 0], // Fy sum = 0
  ];

  const rhs = [
    W, // Fz equilibrium
    0, // Fx
    0  // Fy
  ];

  // Moment equations
  const momentAbout = (r, f) => math.cross(r, f);

  const mA = momentAbout(A, F_A);
  const mB = momentAbout(B, F_B);
  const mC = momentAbout(C, F_C);
  const mW = momentAbout(W_loc, W_vec);

  const coeffs = (vec) => [vec[0], vec[1], vec[2]];

  const Mx = [mA[0], mB[0], mC[0]];
  const My = [mA[1], mB[1], mC[1]];
  const Mz = [mA[2], mB[2], mC[2]];

  equations.push(Mx);
  equations.push(My);
  equations.push(Mz);

  rhs.push(-mW[0], -mW[1], -mW[2]);

  try {
    const A_matrix = math.matrix(equations);
    const b_matrix = math.matrix(rhs);
    const result = math.lusolve(A_matrix, b_matrix);
    const [FA, FB, FC] = result.map(r => r[0]);

    document.getElementById("output").innerHTML = `
      F_A = ${FA.toFixed(3)} N<br>
      F_B = ${FB.toFixed(3)} N<br>
      F_C = ${FC.toFixed(3)} N
    `;
  } catch (err) {
    document.getElementById("output").innerHTML = "Error solving system. Check input.";
    console.error(err);
  }
}
