function solveTrafficLight() {
  try {
    const W_arm = parseFloat(document.getElementById("W_arm").value);
    const F_x = parseFloat(document.getElementById("F_x").value);
    const F_y = parseFloat(document.getElementById("F_y").value);

    const Ax_input = parseFloat(document.getElementById("Ax_input").value);
    const Ay_input = parseFloat(document.getElementById("Ay_input").value);
    const Az_input = parseFloat(document.getElementById("Az_input").value);

    const G = [
      parseFloat(document.getElementById("Gx").value),
      parseFloat(document.getElementById("Gy").value),
      parseFloat(document.getElementById("Gz").value)
    ];

    const P = [
      parseFloat(document.getElementById("Px").value),
      parseFloat(document.getElementById("Py").value),
      parseFloat(document.getElementById("Pz").value)
    ];

    const A_pos = [Ax_input, Ay_input, Az_input];

    const F_vec = [F_x, F_y, 0];
    const W_vec = [0, 0, -W_arm];

    // Unknowns: Ax, Ay, Az, Mx, My, Mz
    const vars = math.symbols('Ax Ay Az Mx My Mz');
    const [Ax, Ay, Az, Mx, My, Mz] = vars;

    // Equations
    const eqns = [];

    // Force equilibrium
    eqns.push(math.equal(math.add(F_vec[0], W_vec[0], Ax), 0));
    eqns.push(math.equal(math.add(F_vec[1], W_vec[1], Ay), 0));
    eqns.push(math.equal(math.add(F_vec[2], W_vec[2], Az), 0));

    // Moment equilibrium
    const r1 = math.subtract(G, A_pos);
    const r2 = math.subtract(P, A_pos);

    const M1 = math.cross(r1, W_vec);
    const M2 = math.cross(r2, F_vec);

    eqns.push(math.equal(math.add(M1[0], M2[0], Mx), 0));
    eqns.push(math.equal(math.add(M1[1], M2[1], My), 0));
    eqns.push(math.equal(math.add(M1[2], M2[2], Mz), 0));

    const solutions = math.solve(eqns, vars);

    document.getElementById("Ax").textContent = "Ax = " + solutions[Ax].toFixed(3);
    document.getElementById("Ay").textContent = "Ay = " + solutions[Ay].toFixed(3);
    document.getElementById("Az").textContent = "Az = " + solutions[Az].toFixed(3);
    document.getElementById("Mx").textContent = "Mx = " + solutions[Mx].toFixed(3);
    document.getElementById("My").textContent = "My = " + solutions[My].toFixed(3);
    document.getElementById("Mz").textContent = "Mz = " + solutions[Mz].toFixed(3);
    document.getElementById("error").textContent = "";

  } catch (err) {
    document.getElementById("error").textContent = "Error solving system. Check input.";
    console.error(err);
  }
}
