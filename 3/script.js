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

  try {
    // Convert to 3D
    const A3 = [A[0], A[1], 0];
    const B3 = [B[0], B[1], 0];
    const C3 = [C[0], C[1], 0];
    const W_vec = [0, 0, -W];
    const W_loc = [d / 2, l / 2, 0];

    // Cross product helper
    const crossZ = (r, Fz) => r[0] * 0 - r[1] * Fz; // only z component needed since force is vertical

    // Build coefficient matrix:
    // Row 1: F_A + F_B + F_C = W
    // Row 2: Moment about x (z-components from cross product with y)
    // Row 3: Moment about y (z-components from cross product with x)
    const Aeq = [
      [1, 1, 1],
      [-A3[1], -B3[1], -C3[1]],
      [A3[0], B3[0], C3[0]]
    ];

    // Right-hand side
    const M_W = [
      -W_loc[1] * W_vec[2], // moment about x (from y)
      W_loc[0] * W_vec[2]   // moment about y (from x)
    ];

    const beq = [
      W,
      -M_W[0],
      -M_W[1]
    ];

    const result = math.lusolve(Aeq, beq);

    const F_A = result[0][0];
    const F_B = result[1][0];
    const F_C = result[2][0];

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
