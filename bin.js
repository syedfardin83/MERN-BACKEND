const bcrypt = require('bcryptjs');
secPass = await bcrypt.genSalt(10);
console.log(secPass);
