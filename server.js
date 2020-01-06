const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const customer = require('./controllers/customer')
const product = require('./controllers/product')
const order = require('./controllers/order')

const app = express()
const port = process.env.PORT || 3000

// engine
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(cors({origin:'*'}));


customer.router.get('/getAll', customer.getALLCustomer)
customer.router.get('/get/:customer_id',  customer.getCustomer)
customer.router.put('/update', customer.updateCustomer)
customer.router.delete('/delete/:customer_id', customer.deleteCustomer)
customer.router.post('/add', customer.addCustomer)

product.router.get('/getAll', product.getALLProduct)
product.router.get('/get/:product_id',  product.getProduct)
product.router.put('/update', product.updateProduct)
product.router.delete('/delete/:product_id', product.deleteProduct)
product.router.post('/add', product.addProduct)

order.router.get('/get/:customer_id', order.getAllOrderByCustomer)
order.router.post('/add', order.addOrder)

app.use("/customer", customer.router)
app.use("/product", product.router)
app.use("/order", order.router)
app.listen(port,()=>{
    console.log(`listening to ${port}`)
})