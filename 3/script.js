document.getElementById('calcForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Retrieve input values
    const W = parseFloat(document.getElementById('W').value);
    const l = parseFloat(document.getElementById('l').value);
    const d = parseFloat(document.getElementById('d').value);

    // Parse coordinates input
    const parseCoordinates = (coords) => {
        const [x, y] = coords.split(',').map(parseFloat);
        return [x, y, 0]; // Add the z-coordinate as 0
    };

    const A = parseCoordinates(document.getElementById('A').value);
    const B = parseCoordinates(document.getElementById('B').value);
    const C = parseCoordinates(document.getElementById('C').value);

    // Constants
    const d2 = d / 2;
    
    // Matrix setup
    const matrix = [
        [A[1], B[1], C[1]],  // force components for F_A, F_B, F_C (simplified)
        [A[0], B[0], C[0]],  // force components for F_A, F_B, F_C (simplified)
        [1, 1, 1]             // additional constraint equation
    ];

    const forces = solveSystem(matrix, [W, 0, 0]);

    // Display results
    document.getElementById('output').style.display = 'block';
    document.getElementById('F_A').textContent = forces.F_A.toFixed(2);
    document.getElementById('F_B').textContent = forces.F_B.toFixed(2);
    document.getElementById('F_C').textContent = forces.F_C.toFixed(2);
});

// Function to solve system of equations
function solveSystem(matrix, values) {
    try {
        // Using math.js to solve the system
        const math = window.math;
        const A = math.matrix(matrix);
        const b = math.matrix(values);
        
        // Solve the system Ax = b
        const x = math.lusolve(A, b);
        
        // Extract results
        return {
            F_A: x[0][0], // Force at point A
            F_B: x[1][0], // Force at point B
            F_C: x[2][0]  // Force at point C
        };
    } catch (error) {
        console.error("Error solving system: ", error);
        return { F_A: "Error", F_B: "Error", F_C: "Error" };
    }
}
