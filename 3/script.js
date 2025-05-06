function solveSystem() {
  try {
    // Inputs: Parsing values from form fields
    const W = parseFloat(document.getElementById("W").value); // Weight in newtons
    const l = parseFloat(document.getElementById("l").value); // Length in meters
    const d = parseFloat(document.getElementById("d").value); // Width in meters

    const Ax = parseFloat(document.getElementById("Ax").value); // Coordinates of point A
    const Ay = parseFloat(document.getElementById("Ay").value);
    const Bx = parseFloat(document.getElementById("Bx").value); // Coordinates of point B
    const By = parseFloat(document.getElementById("By").value);
    const Cx = parseFloat(document.getElementById("Cx").value); // Coordinates of point C
    const Cy = parseFloat(document.getElementById("Cy").value);

    // Define points in 3D space (z-coordinate is 0 for all)
    const A = [Ax, Ay, 0];
    const B = [Bx, By, 0];
    const C = [Cx, Cy, 0];
    const W_vec = [0, 0, -W]; // Weight vector in negative z direction
    const W_loc = [d / 2, l / 2, 0]; // Location of the weight

    // Force vectors (unknowns)
    const FA = [0, 0, 1]; // Force at point A
    const FB = [0, 0, 1]; // Force at point B
    const FC = [0, 0, 1]; // Force at point C

    // Cross products for moment equations
    const cross = (r, f) => math.cross(r, f);
    const mA = cross(A, FA);
    const mB = cross(B, FB);
    const mC = cross(C, FC);
    const mW = cross(W_loc, W_vec);

    // Set up system of equations for force equilibrium and moment equilibrium
    const A_matrix = [
      [0, 0, 1],    // ΣFz = FA + FB + FC = W
      [mA[0], mB[0], mC[0]], // ΣMx (Moment about X)
      [mA[1], mB[1], mC[1]], // ΣMy (Moment about Y)
      [mA[2], mB[2], mC[2]]  // ΣMz (Moment about Z)
    ];
    const b_vector = [W, -mW[0], -mW[1], -mW[2]];

    // Convert to math.js matrix form
    const A_mat = math.matrix(A_matrix);
    const b_mat = math.matrix(b_vector);

    // Solve the system of equations
    const result = math.lusolve(A_mat, b_mat);
    const [FA_res, FB_res, FC_res] = result.map(v => v[0]);

    // Display the results
    document.getElementById("output").innerHTML = `
      F<sub>A</sub> = ${FA_res.toFixed(3)} N<br>
      F<sub>B</sub> = ${FB_res.toFixed(3)} N<br>
      F<sub>C</sub> = ${FC_res.toFixed(3)} N
    `;
  } catch (err) {
    console.error(err);
    document.getElementById("output").innerHTML = "Error solving system. Check input.";
  }
}
