require('dotenv').config()
require('express-async-errors');

// extra security packages
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

// Swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const express = require('express')
const app = express();

// connect DB
const connectDatabase = require('./db/connect');

// routes
const menuItemRoute = require('./routes/menuItemRouter');
const authRoute = require('./routes/authRouter');
const userRoute = require('./routes/userRouter');
const tableRoute = require('./routes/tableRouter');
const reservationRoute = require('./routes/reservationRouter');
const reviewRoute = require('./routes/reviewRouter');

// error handler
const notFoundMiddleware = require('./middlewares/not-found');
const errorHandlerMiddleware = require('./middlewares/error-handler');


app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(mongoSanitize())


app.get('/', (req, res) => {
    res.send('<h1>Restaurant Booking API</h1><a href="/api-docs">Documentation</a>');
});
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));



// routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/menu', menuItemRoute);
app.use('/api/v1/tables', tableRoute);
app.use('/api/v1/reservations', reservationRoute);
app.use('/api/v1/reviews', reviewRoute);




app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDatabase(process.env.MONGODB_URI);
        app.listen(port, () => {
            console.log(`server is listening on port ${port} ...`);
        })



    } catch (error) {
        console.log(error)
    }
}
start();