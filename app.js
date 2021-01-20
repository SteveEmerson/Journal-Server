require("dotenv").config();
let express = require('express');
let app = express();

let sequelize = require('./db');

let journal = require('./controllers/journalcontroller');
let user = require('./controllers/usercontroller');
let calc = require('./controllers/calculatorcontroller');

sequelize.sync();
//sequelize.sync({force: true});

app.use(require('./middleware/headers'));
app.use(express.json());

/*********************************
 * Exposed Route
 * ******************************/
app.use('/user', user);
app.use('/calculator', calc);

/********************************
 * Protected Route
 *******************************/
// This would require a token for the journal route but not for the user route ... not the way to go
//app.use(require('./middleware/validate-session')); 
app.use('/journal', journal);


app.listen(3000, function(){
  console.log('App is listening on port 3000');
})