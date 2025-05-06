function solveTraffic() {
  const W_arm = parseFloat(document.getElementById("W_arm").value);
  const Fx = parseFloat(document.getElementById("Fx").value);
  const Fy = parseFloat(document.getElementById("Fy").value);
  
  const Ax = parseFloat(document.getElementById("Ax").value);
  const Ay = parseFloat(document.getElementById("Ay").value);
  const Az = parseFloat(document.getElementById("Az").value);
  
  const Gx = parseFloat(document.getElementById("Gx").value);
  const Gy = parseFloat(document.getElementById("Gy").value);
  const Gz = parseFloat(document.getElementById("Gz").value);
  
  const Px = parseFloat(document.getElementById("Px").value);
  const Py = parseFloat(document.getElementById("Py").value);
  const Pz = parseFloat(document.getElementById("Pz").value);

  const W_vec = [0, 0, -W_arm];
  const F_vec = [Fx, Fy, 0];

  const FA = [0, 0, 0]; // Placeholder
  const M = [0, 0, 0];  // Placeholder

  function cross(a, b) {
    return [
      a[1]*b[2] - a[2]*b[1],
      a[2]*b[0] - a[0]*b[2],
      a[0]*b[1] - a[1]*b[0]
    ];
  }

  const r_W = [Gx - Ax, Gy - Ay, Gz - Az];
  const r_F = [Px - Ax, Py - Ay, Pz - Az];

  const M1 = cross(r_W, W_vec);
  const M2 = cross(r_F, F_vec);

  const F_sum = [
    Fx,
    Fy,
    -W_arm
  ];

  const M_sum = [
    M1[0] + M2[0],
    M1[1] + M2[1],
    M1[2] + M2[2]
  ];

  const Ax_res = -F_sum[0];
  const Ay_res = -F_sum[1];
  const Az_res = -F_sum[2];
  const Mx_res = -M_sum[0];
  const My_res = -M_sum[1];
  const Mz_res = -M_sum[2];

  document.getElementById("output").innerHTML =
    `Ax = ${Ax_res.toFixed(2)} N<br>
     Ay = ${Ay_res.toFixed(2)} N<br>
     Az = ${Az_res.toFixed(2)} N<br>
     Mx = ${Mx_res.toFixed(2)} Nm<br>
     My = ${My_res.toFixed(2)} Nm<br>
     Mz = ${Mz_res.toFixed(2)} Nm`;
}
