document.getElementById('calcForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Get inputs from form
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

  // Coordinates for points A, B, C (we add 0 in the z-axis to make them 3D)
  const A3 = [A[0], A[1], 0];
  const B3 = [B[0], B[1], 0];
  const C3 = [C[0], C[1], 0];
  const W_vec = [0, 0, -W];
  const W_loc = [d / 2, l / 2, 0];

  // Cross product function
  function cross(u, v) {
    return [
      u[1] * v[2] - u[2] * v[1],
      u[2] * v[0] - u[0] * v[2],
      u[0] * v[1] - u[1] * v[0]
    ];
  }

  // Force equilibrium equations
  const eqn1 = [1, 0, 0, 0, 0, 0]; // F_A
  const eqn2 = [0, 1, 0, 0, 0, 0]; // F_B
  const eqn3 = [0, 0, 1, 0, 0, 0]; // F_C

  // Moment equilibrium equations
  const M_A = cross(A3, [0, 0, 1]);
  const M_B = cross(B3, [0, 0, 1]);
  const M_C = cross(C3, [0, 0, 1]);

  const eqn4 = [...M_A]; // Moment balance for x, y, z
  const eqn5 = [...M_B];
  const eqn6 = [...M_C];

  // Building the Aeq matrix (6x6) for solving
  const Aeq = [
    eqn1, eqn2, eqn3, // Force equilibrium equations
    eqn4, eqn5, eqn6  // Moment equilibrium equations
  ];

  // Right-hand side (forces and moments)
  const b = [
    W_vec[0], W_vec[1], W_vec[2],  // Force balance equations
    ...cross(W_loc, W_vec)          // Moment balance equations
  ];

  try {
    // Solve the system of equations
    const result = math.lusolve(Aeq, b);
    const F_A = result[0][0];
    const F_B = result[1][0];
    const F_C = result[2][0];

    // Display the results
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
