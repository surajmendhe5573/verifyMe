const express= require('express');
const app= express();
require('dotenv').config();

const port= process.env.PORT || 4000

// middleware
app.use(express.json());

require('./db/DB');

app.get('/', (req,res)=>{{
    res.send('Jai Shree Ram');
}});

app.use('/api/users', require('./routes/User'));

app.listen(port, ()=>{
    console.log(`server is running on http://localhost:${port}`); 
})