import { Router } from "express";
import Product from "../models/Product.js";
import authMiddleware from "../middleware/auth.js";
import userMiddlewre from "../middleware/user.js";
import user from "../middleware/user.js";
import { get } from "mongoose";
const router = Router()


router.get('/', async (req, res) => {
    const products = await Product.find().lean()

    console.log(req.userId)

    res.render("index", {
        title: 'App shop | Khamzat',
        products:products.reverse(),
        userId: req.userId ? req.userId.toString(): null, 
    })
    
});

router.get('/products', async (req, res) => {
    const user = req.userId?req.userId.toString(): null;
    const myProducts = await Product.find({user}).populate('user').lean()
      console.log(myProducts)
    res.render("products", {
        title: 'Product | Khamzat',
        isProducts:true,
        myProducts: myProducts
    })
})

router.get('/add', authMiddleware, (req, res) => {
    res.render("add", {
        title: 'Add | Khamzat',
        isAdd: true,
        errorAddProducts:req.flash('errorAddProducts')
    })
})

router.get('/product/:id', async(req,res)=>{
    const id = req.params.id
    const product = await Product.findById(id).populate('user').lean()
    res.render('product',{
        product:product
    })
})

router.get('/edit-product/:id', async(req,res)=>{
    const id = req.params.id
    const product = await Product.findById(id).populate('user').lean()
    res.render('edit-product',{
        product:product,
        errorEditProduct:req.flash('errorEditProduct')
    })
})

router.post('/add-products', userMiddlewre ,async(req,res)=>{
    const {title,description,image,price} = req.body
    if(!title || !description || !image || !price ){
        req.flash('errorAddProducts','All fields is required is Register')
        res.redirect('/add')
        return
    }
    await Product.create({...req.body, user:req.userId})
    res.redirect('/')
})

router.post('/edit-product/:id', async(req,res)=>{
    const {title,description,image,price} = req.body
    const id = req.params.id
    if(!title || !description || !image || !price ){
        req.flash('errorEditProduct','All fields is required is Register')
        res.redirect(`/edit-product/${id}`)
        return
    }

    await Product.findByIdAndUpdate(id,req.body,{new:true})
    res.redirect('/products')
})

router.post('/delete-product/:id', async(req,res)=>{
    const id = req.params.id
    
    await Product.findByIdAndRemove(id)
    res.redirect('/')
})

export default router  