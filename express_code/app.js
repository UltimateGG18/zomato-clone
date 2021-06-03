const express=require('express');
const mongoose=require('mongoose');
const routes=require('./routes/index');
const cors=require('cors');

const port=1998;
const host='localhost';

const app=express();

const localUrl='mongodb://127.0.0.1:27017/Zomato';
const cloudUrl='mongodb+srv://GauravGavkar:Gaurav@18@cluster0.dfdws.mongodb.net/Zomato?retryWrites=true&w=majority';

app.use(cors());
app.use(express.json());
app.use('/',routes);

mongoose.connect(cloudUrl,{ useNewUrlParser: true,useUnifiedTopology: true })
.then(()=>{
    app.listen(port,host,()=>{
        console.log(`Server is successfully running at ${host} : ${port}`);
    });    
})
.catch()



