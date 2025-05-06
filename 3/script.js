document.getElementById('calcForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const W = parseFloat(document.getElementById('W').value);
  const l = parseFloat(document.getElementById('l').value);
  const d = parseFloat(document.getElementById('d').value);

  const A = document.getElementById('A').value.split(',').map(Number);
  const B = document.getElementById('B').value.split(',').map(Number);
  const C = document.getElementById('C').value.split(',').map(Number);

  if (
    A.length !== 2 || B.length !== 2 || C.length !== 2 ||
    A.some(isNaN) || B.some(isNaN) || C.some(isNaN)
  ) {
    document.getElementById('error').textContent = "Invalid coordinates. Use format: x,y";
    document.getElementById('output').style.display = 'none';
    return;
  }

  const A3 = [A[0], A[1], 0];
  const B3 = [B[0], B[1], 0];
  const C3 = [C[0], C[1], 0];

  const W_vec = [0, 0, -W];
  const W_loc = [d / 2, l / 2, 0];

  const F_A = [0, 0, 'FA'];
  const F_B = [0, 0, 'FB'];
  const F_C = [0, 0, 'FC'];

  // Create symbolic variable array
  const vars = ['FA', 'FB', 'FC'];

  // ΣF = 0
  const eq1 = ['FA + FB + FC = ' + W]; // z direction only

  // ΣM = 0 (around x, y, z)
  const cross = (r, F) => ([
    math.subtract(math.multiply(r[1], F[2]), math.multiply(r[2], F[1])), // x
    math.subtract(math.multiply(r[2], F[0]), math.multiply(r[0], F[2])), // y
    math.subtract(math.multiply(r[0], F[1]), math.multiply(r[1], F[0]))  // z
  ]);

  const M_FA = cross(A3, F_A);
  const M_FB = cross(B3, F_B);
  const M_FC = cross(C3, F_C);
  const M_W  = cross(W_loc, W_vec);

  // Only z-component is nonzero
  const sum_Mz = [M_FA[2], M_FB[2], M_FC[2], M_W[2]];
  const eq2 = `${M_FA[2]} + ${M_FB[2]} + ${M_FC[2]} = ${-M_W[2]}`;

  // Convert to equations in terms of FA, FB, FC
  const Aeq = [
    [0, 0, 1],        // FA + FB + FC = W
    [A3[0], B3[0], C3[0]],  // Moment arm x * Fz
    [A3[1], B3[1], C3[1]]   // Moment arm y * Fz
  ];
  const beq = [
    W,
    -math.cross(W_loc, W_vec)[1],
    math.cross(W_loc, W_vec)[0]
  ];

  try {
    const result = math.lusolve(Aeq, beq);
    document.getElementById('F_A').textContent = result[0][0].toFixed(2);
    document.getElementById('F_B').textContent = result[1][0].toFixed(2);
    document.getElementById('F_C').textContent = result[2][0].toFixed(2);
    document.getElementById('output').style.display = 'block';
    document.getElementById('error').textContent = '';
  } catch (err) {
    document.getElementById('output').style.display = 'none';
    document.getElementById('error').textContent = "Error solving system. Check input values.";
    console.error(err);
  }
});
