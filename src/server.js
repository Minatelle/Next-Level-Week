const express = require("express")
const server = express()
const nunjucks = require("nunjucks")


//get db
const db = require("./database/db")

//config public
server.use(express.static("public"))

//turn on req.body
server.use(express.urlencoded({ extended: true }))

//template engine

nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

//home page
server.get("/", (req, res) => {
    return res.render("index.html", {title: "Um titulo"})
})



//home create-point
server.get("/create-point", (req, res) => {

   //console.log(req.query)

    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {

    const search = req.query.search

    console.log(req.body)

    const query = `
    INSERT INTO places (
        image,
        name,
        address,
        address2,
        state,
        city,
        items
        ) VALUES (?,?,?,?,?,?,?);
    `

    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if(err) {
            console.log(err)
            return res.send("Erro no cadastro")
        }

        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.html", { saved: true})
    }

    db.run(query, values, afterInsertData)


})


//home search-results
server.get("/search", (req, res) => {

    const search = req.query.search

    if (search == "") {

        db.all(`SELECT * FROM places`, function(err, rows) {
            if(err) {
                return console.log(err)
            }
            const total = rows.length
            return res.render("search-results.html", { places: rows, total, search })
        }) 

    } else {

         db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
            if(err) {
                return console.log(err)
            }
            const total = rows.length
            return res.render("search-results.html", { places: rows, total, search})
         }) 
    }


})

//server on
server.listen(3000)