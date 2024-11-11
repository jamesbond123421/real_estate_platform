const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());





// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',          // Database host, 'localhost' if it's on your local machine
    user: 'root',       // MySQL username
    password: 'moraks_1234',   // MySQL password
    database: 'mydatabase'    // Name of the database you're connecting to
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1); // Exit if database connection fails
    }
    console.log('Connected to MySQL database.');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


app.get('/api/update_insurance/:zip', (req, res) => {
    const zipCode = req.params.zip;
    const county = req.query.county;

    console.log("Received request for ZIP code:", zipCode, "and County:", county);

    const selectQuery = `
        SELECT Monthly_Property_Tax, Monthly_Interest, Monthly_Insurance_Cost 
        FROM dataset 
        WHERE zipcode = ? AND county = ?
    `;

    db.query(selectQuery, [zipCode, county], (err, result) => {
        if (err) {
            console.error("Select Query Error:", err);
            return res.status(500).json({ error: err.message });
        }

        console.log("Query Result:", result);  // Check the result structure


        const { Monthly_Property_Tax, Monthly_Interest, Monthly_Insurance_Cost } = result[0];

        const updatedInsuranceCost = Monthly_Insurance_Cost * 1.10; // Increase by 10%
    

        console.log(`Updated Insurance Cost on server start: $${updatedInsuranceCost}`);
        const updateQuery = 'UPDATE dataset SET Monthly_Insurance_Cost = ? WHERE zipcode = ? AND county = ?';

        db.query(updateQuery, [updatedInsuranceCost, zipCode, county], (updateErr) => {
            if (updateErr) {
                console.error("Update Query Error:", updateErr);
                return res.status(500).json({ error: updateErr.message });
            }

            res.json({ 
                updatedInsuranceCost,  // Ensure it's a number
                Monthly_Property_Tax,
                Monthly_Interest
        });
    });
});
});
