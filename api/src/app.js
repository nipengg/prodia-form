const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const configRoutes = require('./routes/configRoutes');

const app = express();
app.use(cors());
app.use(express.json());

sequelize.authenticate()
  .then(() => {
    console.log('✅ MySQL Connected via Docker!');
    return sequelize;
  })
  .catch(err => console.error('❌ SQL Connection Error:', err));

app.use('/users', userRoutes);
app.use('/config', configRoutes);

app.listen(3000, () => console.log('Server on port 3000'));