document.getElementById('search').addEventListener('click', async () => {
    const zipcode = document.getElementById('zipcode').value;
    const county = document.getElementById('county').value;

    if (!zipcode || !county) {
        alert("Please enter both a ZIP code and a county.");
        return;
    }

    try {
        console.log("Sending request to the server...");
        const response = await fetch(`http://localhost:3000/api/update_insurance/${zipcode}?county=${encodeURIComponent(county)}`);
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Data received:", data);

        // Safely handle the Monthly_Property_Tax and other fields
        const monthlyPropertyTax = parseFloat(data.Monthly_Property_Tax);
        const monthlyInterest = parseFloat(data.Monthly_Interest);
        const updatedInsuranceCost = parseFloat(data.updatedInsuranceCost);

        // Open a new window and display the data
        const resultWindow = window.open("", "_blank", "width=400,height=300");
        resultWindow.document.write(`
            <html>
                <head>
                    <title>Monthly Fees for ZIP: ${zipcode}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h3 { color: #333; }
                        p { margin: 10px 0; }
                    </style>
                </head>
                <body>
                    <h3>Monthly Insurance Update for ZIP: ${zipcode} in ${county}</h3>
                    <p>Updated Monthly Insurance Cost: $${!isNaN(updatedInsuranceCost) ? updatedInsuranceCost.toFixed(2) : 'N/A'}</p>
                    <p>Monthly Property Tax: $${!isNaN(monthlyPropertyTax) ? monthlyPropertyTax.toFixed(2) : 'N/A'}</p>
                    <p>Monthly Interest: $${!isNaN(monthlyInterest) ? monthlyInterest.toFixed(2) : 'N/A'}</p>
                </body>
            </html>
        `);
        resultWindow.document.close();

    } catch (error) {
        console.error("Error fetching data:", error.message);
        alert("No access!");
    }
});
