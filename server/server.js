const express = require('express');
const app = express();
require('dotenv').config()
require('./config/db')
const ratingRoutes = require('./routes/ratingRoutes');
const storeRoutes = require('./routes/storeRoutes');
const userRoutes = require('./routes/userRoutes');
const statsRoutes = require('./routes/StateRoutes')


const cors = require('cors')

;

app.use(cors());
app.use(express.json());


app.use('/api/store', storeRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/rating', ratingRoutes);
app.use('/api/admin', statsRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
