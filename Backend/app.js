const express = require('express');
const mongoose = require('mongoose');
const orderRoutes = require('./routes/order');

require('dotenv').config();
var cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Backend is working perfectly');
});

app.use('/api/order', orderRoutes);


const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

