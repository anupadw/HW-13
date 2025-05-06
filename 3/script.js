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

    const A3 = [A[0], A[1], 0]; // Adding 0 for z-coordinate
    const B3 = [B[0], B[1], 0]; // Adding 0 for z-coordinate
    const C3 = [C[0], C[1], 0]; // Adding 0 for z-coordinate
    const W_vec = [0, 0, -W]; // Weight as a force vector (only in the z-direction)
    const W_loc = [d / 2, l / 2, 0]; // The location of the weight

    // Cross product function for calculating moments
    function cross(u, v) {
        return [
            u[1] * v[2] - u[2] * v[1],
            u[2] * v[0] - u[0] * v[2],
            u[0] * v[1] - u[1] * v[0]
        ];
    }

    // Setting up equations for force and moment equilibrium
    const eqn1 = [1, 0, 0, 0, 0, 0]; // Force equilibrium in x-direction
    const eqn2 = [0, 1, 0, 0, 0, 0]; // Force equilibrium in y-direction
    const eqn3 = [0, 0, 1, 0, 0, 0]; // Force equilibrium in z-direction

    // Moment equilibrium equations
    const M_A = cross(A3, [1, 0, 0]); // Moment for point A (about x-axis)
    const M_B = cross(B3, [1, 0, 0]); // Moment for point B (about x-axis)
    const M_C = cross(C3, [1, 0, 0]); // Moment for point C (about x-axis)

    // Now creating the full system of equations
    const Aeq = [
        eqn1, eqn2, eqn3, 
        [...M_A], [...M_B], [...M_C]
    ];

    // Right-hand side vector (forces and moments)
    const b = [
        W_vec[0], W_vec[1], W_vec[2], 
        ...cross(W_loc, W_vec)  // Cross product of location and weight vector
    ];

    // Checking the matrix dimensions before solving
    console.log("Matrix Aeq:", Aeq);
    console.log("Vector b:", b);

    try {
        // Solving the system of equations
        const result = math.lusolve(Aeq, b);
        const F_A = result[0][0]; // Force at A
        const F_B = result[1][0]; // Force at B
        const F_C = result[2][0]; // Force at C

        // Display the results
        document.getElementById('F_A').textContent = F_A.toFixed(4);
        document.getElementById('F_B').textContent = F_B.toFixed(4);
        document.getElementById('F_C').textContent = F_C.toFixed(4);
        document.getElementById('output').style.display = 'block';
        document.getElementById('error').textContent = '';
    } catch (err) {
        // Handling error in case of any issues
        document.getElementById('error').textContent = "Error solving system. Check your input.";
        document.getElementById('output').style.display = 'none';
        console.error(err);
    }
});
