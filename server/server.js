const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST || "db",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "numericalmethod",
    port: process.env.DB_PORT || "3306",
})

app.get("/graphical" , (req , res) =>{
    db.query("SELECT * FROM graphical" , (err , data)=>{
        if(err){
            console.error("❌ Graphical Query error:", err.message);
            return res.status(500).json({ error: err.message });
        }
        console.log("✅ Fetch Graphical:", data.length, "rows");
        return res.json(data);
    })
})

app.get("/bisection" , (req , res) =>{
    db.query("SELECT * FROM bisection" , (err , data)=>{
        if(err){
            console.error("❌ Bisection Query error:", err.message);
            return res.status(500).json({ error: err.message });
        }
        console.log("✅ Fetech Bisection:", data.length, "rows");
        return res.json(data);
    })
})


app.get("/falseposition" , (req , res) =>{
    db.query("SELECT * FROM falseposition" , (err , data)=>{
        if(err){
            console.error("❌ False-Position Query error:", err.message);
            return res.status(500).json({ error: err.message });
        }
        console.log("✅ Fetch False-Position:", data.length, "rows");
        return res.json(data);
    })
})


app.post('/graphical' , (req , res) =>{
    const sql = "INSERT INTO graphical (`fx` ,`xstart`,`xend`) VALUES (?)";
    const values =[
        req.body.fx,
        req.body.xstart,
        req.body.xend,
    ]
    db.query(sql,[values] , (err , data) =>{
        if(err) {
            console.error("❌ Insert error:", err.message);
            return res.status(500).json({ error: err.message }); 
        }
        console.log("✅ Graphical inserted successfully"); 
        return res.json({ message: "Graphical Insert to Database Success" });
    })
})

app.post('/bisection' , (req , res) =>{
    const sql = "INSERT INTO bisection (`fx` ,`xl`,`xr`,`tolerance`) VALUES (?)";
    const values =[
        req.body.fx,
        req.body.xl,
        req.body.xr,
        req.body.tolerance
    ]
    db.query(sql,[values] , (err , data) =>{
        if(err) {
            console.error("❌ Insert error:", err.message);
            return res.status(500).json({ error: err.message }); 
        }
        console.log("✅ Bisection inserted successfully"); 
        return res.json({ message: "Bisection Insert to Database Success" });
    })
})

app.post('/falseposition' , (req , res) =>{
    const sql = "INSERT INTO falseposition (`fx` ,`xl`,`xr`,`tolerance`) VALUES (?)";
    const values =[
        req.body.fx,
        req.body.xl,
        req.body.xr,
        req.body.tolerance
    ]
    db.query(sql,[values] , (err , data) =>{
        if(err) {
            console.error("❌ False-Position Insert error:", err.message);
            return res.status(500).json({ error: err.message }); 
        }
        console.log("✅ False-Position inserted successfully"); 
        return res.json({ message: "False-Position Insert to Database Success" });
    })
})


const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
app.use('/api-docs', swaggerUi.serve , swaggerUi.setup(swaggerDocument));

app.listen(8080 , () => {
    console.log("Connected to Backend");
})