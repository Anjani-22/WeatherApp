const express = require("express");
const cors = require("cors"); // Enable CORS (optional)
const weatherRoutes = require("./routes/weather");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Enable CORS (optional)
app.use(express.json());

app.use("/", weatherRoutes);

app.listen(port, () => console.log(`Server listening on port ${port}`));
