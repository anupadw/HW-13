function solveStatics() {
  const W_arm = parseFloat(document.getElementById("W_arm").value);
  const Fx = parseFloat(document.getElementById("F_x").value);
  const Fy = parseFloat(document.getElementById("F_y").value);
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

  try {
    // Force vectors
    const W_vec = [0, 0, -W_arm];
    const F_vec = [Fx, Fy, 0];

    // Moments about A = origin
    const cross = (r, f) => [
      r[1]*f[2] - r[2]*f[1],
      r[2]*f[0] - r[0]*f[2],
      r[0]*f[1] - r[1]*f[0]
    ];

    const M_G = cross(G, W_vec);
    const M_P = cross(P, F_vec);

    const Ax = -Fx;
    const Ay = -Fy;
    const Az = W_arm;

    const Mx = -(M_G[0] + M_P[0]);
    const My = -(M_G[1] + M_P[1]);
    const Mz = -(M_G[2] + M_P[2]);

    document.getElementById("output").innerHTML =
      `Ax = ${Ax.toFixed(2)}<br>
       Ay = ${Ay.toFixed(2)}<br>
       Az = ${Az.toFixed(2)}<br>
       Mx = ${Mx.toFixed(2)}<br>
       My = ${My.toFixed(2)}<br>
       Mz = ${Mz.toFixed(2)}`;
  } catch (err) {
    document.getElementById("output").innerText = "Error solving system. Check input.";
  }
}
