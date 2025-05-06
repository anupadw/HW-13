document.getElementById('calcForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Get inputs
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

  try {
    // 3D vectors
    const A3 = [A[0], A[1], 0];
    const B3 = [B[0], B[1], 0];
    const C3 = [C[0], C[1], 0];
    const W_vec = [0, 0, -W];
    const W_loc = [d / 2, l / 2, 0];

    // Cross product utility
    const cross = (u, v) => [
      u[1] * v[2] - u[2] * v[1],
      u[2] * v[0] - u[0] * v[2],
      u[0] * v[1] - u[1] * v[0],
    ];

    // Only z-component of forces: [0, 0, F]
    // So we only use the third component of the moment (x,y parts cancel)
    const Aeq = [
      [0, 0, 1],                        // ΣFz = W
      [A3[0], B3[0], C3[0]],            // ΣMy (x components)
      [A3[1], B3[1], C3[1]]             // ΣMx (y components)
    ];
    const M_W = cross(W_loc, W_vec);   // Moment due to weight
    const beq = [
      W,
      -M_W[1],
      M_W[0]
    ];

    const solution = math.lusolve(Aeq, beq);

    const F_A = solution[0][0];
    const F_B = solution[1][0];
    const F_C = solution[2][0];

    document.getElementById('F_A').textContent = F_A.toFixed(2);
    document.getElementById('F_B').textContent = F_B.toFixed(2);
    document.getElementById('F_C').textContent = F_C.toFixed(2);
    document.getElementById('output').style.display = 'block';
    document.getElementById('error').textContent = '';
  } catch (err) {
    console.error("Error solving system:", err);
    document.getElementById('output').style.display = 'none';
    document.getElementById('error').textContent = "Error solving system. Check input values.";
  }
});
