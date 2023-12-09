import {Router} from 'express'
import User from '../models/User.js'
import bcrypt from 'bcrypt'
import { generateJWTToken } from '../services/token.js'
import nextMiddleware from '../middleware/next.js'


const router = Router()

router.get('/login', nextMiddleware ,(req,res)=>{
    res.render("login",{
        title: 'Login | App',
        isLogin: true,
        loginError:req.flash("loginError")
    })
})

router.get('/register',nextMiddleware,(req,res)=>{
    res.render("register",{
        title: 'Register | App',
        isRegister: true,
        registerError:req.flash('registerError')

    })
})

router.get('/logout' ,(req,res)=>{
    res.clearCookie('token')
    res.redirect('/')    
})

router.post('/login',async(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        req.flash('loginError','All fields is required')
        res.redirect('/login')
        return
    }
    const existUser = await User.findOne({email})
    if(!existUser){
        req.flash('loginError','User not found')
        res.redirect('/login')
        return
    }
    const isPassEqual = await bcrypt.compare(password, existUser.password)
    if(!isPassEqual){
        req.flash('loginError','Password wrong')
        res.redirect('/login')
        return
    }
    const token = generateJWTToken(existUser._id)
    res.cookie('token', token,{httpOnly:true,secure:true})
    console.log(token)    
    res.redirect('/')
})

router.post('/register',async(req,res)=>{
    const {firstname,lastname,email,password} = req.body
    if(!firstname || !lastname || !email || !password){
        req.flash('registerError','All fields isrequired is Register')
        res.redirect('/register')
        return
    }

    const candidade = await User.findOne({email})
    if(candidade){
        req.flash('registerError','User alrady exist ')
        res.redirect('/register')
        return
    }
    
    const hashedPassword = await bcrypt.hash(password,10)
    const userData ={
        firstName: firstname,
        lastName:lastname,
        email:email,
        password:hashedPassword
    }
    const user = await User.create(userData)
    const token = generateJWTToken(user._id)
    res.cookie('token', token,{httpOnly:true,secure:true})
    console.log(token)
    res.redirect('/')

})
export default router
