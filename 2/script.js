function parseVec(str) {
  return str.split(',').map(Number);
}

function solveStatics() {
  const W_rod = Number(document.getElementById("wRod").value);
  const W_crate = Number(document.getElementById("wCrate").value);
  const A = parseVec(document.getElementById("aInput").value);
  const C = parseVec(document.getElementById("cInput").value);
  const D = parseVec(document.getElementById("dInput").value);
  const O = [0, 0, 0];

  const unit = v => math.divide(v, math.norm(v));
  const vec = (p1, p2) => math.subtract(p2, p1);

  const uAC = unit(vec(A, C));
  const uAD = unit(vec(A, D));

  const T_AC = math.symbolicUtils.symbol('T_AC');
  const T_AD = math.symbolicUtils.symbol('T_AD');
  const Ax = math.symbolicUtils.symbol('Ax');
  const Ay = math.symbolicUtils.symbol('Ay');
  const Az = math.symbolicUtils.symbol('Az');

  const AC = math.multiply(uAC, T_AC);
  const AD = math.multiply(uAD, T_AD);
  const WrodVec = [0, -W_rod, 0];
  const WcrateVec = [0, -W_crate, 0];
  const A_vec = [Ax, Ay, Az];

  const F_sum = math.add(math.add(math.add(math.add(AC, AD), WrodVec), WcrateVec), A_vec);

  const cross = (a, b) => ([
    math.subtract(math.multiply(a[1], b[2]), math.multiply(a[2], b[1])),
    math.subtract(math.multiply(a[2], b[0]), math.multiply(a[0], b[2])),
    math.subtract(math.multiply(a[0], b[1]), math.multiply(a[1], b[0]))
  ]);

  const M_sum = math.add(
    cross(A, AD),
    cross(A, AC),
    cross(A, WcrateVec),
    cross(math.divide(A, 2), WrodVec)
  );

  const eqns = [
    math.equal(F_sum[0], 0),
    math.equal(F_sum[1], 0),
    math.equal(F_sum[2], 0),
    math.equal(M_sum[0], 0),
    math.equal(M_sum[1], 0),
    math.equal(M_sum[2], 0),
  ];

  try {
    const solution = math.solve(eqns, ['T_AC', 'T_AD', 'Ax', 'Ay', 'Az']);
    const res = solution[0]; // Assuming one solution

    const output = `T_AC = ${Number(res.T_AC).toFixed(2)}<br>` +
                   `T_AD = ${Number(res.T_AD).toFixed(2)}`;

    document.getElementById("results").innerHTML = output;
  } catch (err) {
    document.getElementById("results").innerHTML = "Error solving equations. Check inputs.";
    console.error(err);
  }
}
