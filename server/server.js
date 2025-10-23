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
db.connect((err)=>{
    if(err){
        console.error("Database connection failed" , err.message);
    }else{
        console.log("Database connec to MySQL Success")
    }
})

app.get("/graphical" , (req , res) =>{
    db.query("SELECT * FROM graphical" , (err , data)=>{
        if(err){
            console.error(" Graphical Query error:", err.message);
            return res.status(500).json({ error: err.message });
        }
        console.log("Fetch Graphical:", data.length, "rows");
        return res.json(data);
    })
})

app.get("/bisection" , (req , res) =>{
    db.query("SELECT * FROM bisection" , (err , data)=>{
        if(err){
            console.error(" Bisection Query error:", err.message);
            return res.status(500).json({ error: err.message });
        }
        console.log("Fetch Bisection:", data.length, "rows");
        return res.json(data);
    })
})


app.get("/falseposition" , (req , res) =>{
    db.query("SELECT * FROM falseposition" , (err , data)=>{
        if(err){
            console.error(" False-Position Query error:", err.message);
            return res.status(500).json({ error: err.message });
        }
        console.log("Fetch False-Position:", data.length, "rows");
        return res.json(data);
    })
})

app.get("/newtonraphson" , (req , res) =>{
    db.query("SELECT * FROM newtonraphson" , (err , data)=>{
        if(err){
            console.error(" Newtonraphson Query error:", err.message);
            return res.status(500).json({ error: err.message });
        }
        console.log("Fetch Newtonraphson:", data.length, "rows");
        return res.json(data);
    })
})


app.get("/onepoint" , (req , res) =>{
    db.query("SELECT * FROM onepoint" , (err , data)=>{
        if(err){
            console.error(" OnePoint Query error:", err.message);
            return res.status(500).json({ error: err.message });
        }
        console.log("Fetch OnePoint:", data.length, "rows");
        return res.json(data);
    })
})

app.get("/secant" , (req , res) =>{
    db.query("SELECT * FROM secant" , (err , data)=>{
        if(err){
            console.error(" Secant Query error:", err.message);
            return res.status(500).json({ error: err.message });
        }
        console.log("Fetch Secant:", data.length, "rows");
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
            console.error(" Insert error:", err.message);
            return res.status(500).json({ error: err.message }); 
        }
        console.log("Graphical inserted successfully"); 
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
            console.error(" Insert error:", err.message);
            return res.status(500).json({ error: err.message }); 
        }
        console.log("Bisection inserted successfully"); 
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
            console.error(" False-Position Insert error:", err.message);
            return res.status(500).json({ error: err.message }); 
        }
        console.log("False-Position inserted successfully"); 
        return res.json({ message: "False-Position Insert to Database Success" });
    })
})

app.post('/newtonraphson' , (req , res) =>{
    const sql = "INSERT INTO newtonraphson (`fx` ,`guess`,`tolerance`) VALUES (?)";
    const values =[
        req.body.fx,
        req.body.guess,
        req.body.tolerance
    ]
    db.query(sql,[values] , (err , data) =>{
        if(err) {
            console.error(" Newtonraphson Insert error:", err.message);
            return res.status(500).json({ error: err.message }); 
        }
        console.log("Newtonraphson inserted successfully"); 
        return res.json({ message: "Newtonraphson Insert to Database Success" });
    })
})

app.post('/onepoint' , (req , res) =>{
    const sql = "INSERT INTO onepoint (`fx` ,`guess`,`tolerance`) VALUES (?)";
    const values =[
        req.body.fx,
        req.body.guess,
        req.body.tolerance
    ]
    db.query(sql,[values] , (err , data) =>{
        if(err) {
            console.error(" OnePoint Insert error:", err.message);
            return res.status(500).json({ error: err.message }); 
        }
        console.log("OnePoint inserted successfully"); 
        return res.json({ message: "OnePoint Insert to Database Success" });
    })
})

app.post('/secant' , (req , res) =>{
    const sql = "INSERT INTO secant (`fx` ,`x0`,`x1`,`tolerance`) VALUES (?)";
    const values =[
        req.body.fx,
        req.body.x0,
        req.body.x1,
        req.body.tolerance
    ]
    db.query(sql,[values] , (err , data) =>{
        if(err) {
            console.error(" Secant Insert error:", err.message);
            return res.status(500).json({ error: err.message }); 
        }
        console.log("Secant inserted successfully"); 
        return res.json({ message: "Secant Insert to Database Success" });
    })
})


const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
app.use('/api-docs', swaggerUi.serve , swaggerUi.setup(swaggerDocument));

app.listen(8080 , () => {
    console.log("Connected to Backend");
})