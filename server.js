const express = require('express');

const app = express();

app.get('/', (res, req) => {
    res.send('API Running...');
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));