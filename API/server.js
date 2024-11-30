// app.js
const express = require("express");
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const seedDatabase = require('./databaseControl/seedDatabase')
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerOptions');
const db = require('./models');

dotenv.config();

//SERVER BASE SECTION
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true 
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//===========================================================================================

//SWAGGER SECTION
//http://localhost:3000/api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});
//===========================================================================================


//===========================================================================================
//===========================================================================================
//OBJECT APIS
const categoryRoutes = require('./routes/object/categoryRoutes')
const gradeRoutes = require('./routes/object/gradeRoutes')
const threadRoutes = require('./routes/object/thread/threadRoutes')

app.use('/api/categories', categoryRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/threads', threadRoutes);

//===========================================================================================
//ACCOUNT APIS
const accountRoutes = require('./routes/account/accountRoutes')
const roleRoutes = require('./routes/account/roleRoutes')
const authRoutes = require('./routes/account/authRoutes')

app.use('/api/account', accountRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/auth', authRoutes);

//===========================================================================================
//THREAD APIS
const threadCommentRoutes = require('./routes/object/thread/commentRoutes')
app.use('/api/threads', threadCommentRoutes);

//===========================================================================================
//USER APIS
const userRoutes = require('./routes/user/userRoutes')
app.use('/api/user', userRoutes);

app.use((req, res) => {
    res.status(404).json({
        error: "Endpoint not found. Please check the URL or contact the API provider."
    });
});

//===========================================================================================
//===========================================================================================
//DB INITIALIZE
db.sequelize.sync({ force: false, logging: false }).then(async () => {
    await seedDatabase();
    app.listen(process.env.PORT, () => {
        console.log(`Database server is running on port: ${process.env.PORT}`);
    });
});
//===========================================================================================

//Thread edit
//Blogiems request 405 rez, neleistinoms operacijoms
//Path scope mažinti, category, thread -> comment