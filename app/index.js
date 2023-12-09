import express from "express";
import { create } from 'express-handlebars'
import mongoose from "mongoose";
import session from "express-session";
import flash from 'connect-flash'
import cookieParser from "cookie-parser";
import * as dotenv from 'dotenv';


//MIDDLEWARE
import varMiddleware from './middleware/var.js'
import userMiddleware from "./middleware/user.js";
import hbsHelper from "./utils/index.js";
//ROUTES
import AuthRoutes from './routes/auth.js';
import ProductsRoutes from './routes/products.js'


dotenv.config()

const app = express()

const hbs = create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: hbsHelper
})

app.use(express.json())

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs');
app.set('views', './views');



app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public')) //papkani static qilish
app.use(cookieParser())
app.use(session({ secret: 'khamzat', resave: false, saveUninitialized: false }))
//resave degani qayta saqlash
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)


app.use(AuthRoutes);
app.use(ProductsRoutes)



const startApp = () => {
    try {
        mongoose.set('strictQuery', false)
        mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,useUnifiedTopology: true, 
        },
            console.log('Mongo DB connected'))

        const PORT = process.env.PORT || 1234

        app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
    } catch (error) {
        
        console.log(error)
    }
}

startApp()