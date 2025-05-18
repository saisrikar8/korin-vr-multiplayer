const express = require('express');
const app = express();
const path = require('path');

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    console.log("Sending html");
    res.sendFile(path.join(__dirname, 'pages', 'index.html'), { headers: { 'Content-Type': 'text/html' } });
});


app.listen(port, async () => {
    console.log(`App listening on http://localhost:${port}/`);
});
