const User = require('../models/User');

User.sync()
  .then(() => console.log('Database synced'))