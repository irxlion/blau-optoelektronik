
async function testLogin() {
    try {
        const response = await fetch("http://127.0.0.1:5000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: "admin", password: "password" }),
        });

        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Data:", data);
    } catch (error) {
        console.error("Error:", error.message);
    }
}

testLogin();
