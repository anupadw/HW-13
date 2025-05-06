document.getElementById('calcForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const W = parseFloat(document.getElementById('W').value);
  const l = parseFloat(document.getElementById('l').value);
  const d = parseFloat(document.getElementById('d').value);

  const A = document.getElementById('A').value.split(',').map(Number);
  const B = document.getElementById('B').value.split(',').map(Number);
  const C = document.getElementById('C').value.split(',').map(Number);

  if ([A, B, C].some(p => p.length !== 2 || p.some(isNaN))) {
    document.getElementById('error').textContent = "Please enter coordinates in x,y format.";
    document.getElementById('output').style.display = 'none';
    return;
  }

  const A3 = [A[0], A[1], 0];
  const B3 = [B[0], B[1], 0];
  const C3 = [C[0], C[1], 0];
  const W_vec = [0, 0, -W];
  const W_loc = [d / 2, l / 2, 0];

  function cross(u, v) {
    return [
      u[1] * v[2] - u[2] * v[1],
      u[2] * v[0] - u[0] * v[2],
      u[0] * v[1] - u[1] * v[0]
    ];
  }

  // System of equations setup for forces and moments
  const Aeq = [
    // Force equilibrium equations
    [0, 0, 1], // F_A
    [0, 0, 1], // F_B
    [0, 0, 1], // F_C

    // Moment equilibrium equations (cross products for the 3 components)
    cross(A3, [0, 0, 1]),
    cross(B3, [0, 0, 1]),
    cross(C3, [0, 0, 1])
  ];

  const b = [
    // Force equations
    W_vec[0], W_vec[1], W_vec[2],

    // Moment balance
    ...cross(W_loc, W_vec)
  ];

  try {
    const result = math.lusolve(Aeq, b);
    const F_A = result[0][0];
    const F_B = result[1][0];
    const F_C = result[2][0];

    document.getElementById('F_A').textContent = F_A.toFixed(4);
    document.getElementById('F_B').textContent = F_B.toFixed(4);
    document.getElementById('F_C').textContent = F_C.toFixed(4);
    document.getElementById('output').style.display = 'block';
    document.getElementById('error').textContent = '';
  } catch (err) {
    document.getElementById('error').textContent = "Error solving system. Check your input.";
    document.getElementById('output').style.display = 'none';
    console.error(err);
  }
});
