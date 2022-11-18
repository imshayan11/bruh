
const bodyParser = require('body-parser')
const { response } = require('express')
const express = require('express')
const app = express()
const port = 3000
const pool = require('./dbconnection')
const TodoRepo = require ('./repository/todoRepository')
const TodoController = require ('./controllers/todoControllers')

const TODO_BASE_ROUTE = '/main'
const TODO_DELETE_ROUTE = '/deletetask'

const todoControllers = new TodoController()

app.get('/', (request, response) => {
  response.json({info : 'Node.js,Express, and Postgres API'})
})

// app.get('/testdb', async(request, response) => {
//     let res = await pool.query('select * from public.mytable2')
//     console.log(res.rows);
//     response.json({info : res.rows})
// })

app.use(bodyParser.json())

app.use(
  bodyParser.urlencoded({
    extended: true,
  }
  )
)

app.post('/create', async(req,res)=> {
  let result = await pool.query('INSERT INTO public.mytable2 (task,done, description) VALUES($1,$2,$3)', [ req.body.task, req.body.done, req.body.description])
  
  res.end('Created')
})

app.put('/update', async(req,res)=>{
  let result = await pool.query('update public.mytable2 SET task = $1  where id = $2', [req.body.task, req.body.id])
  res.send('UPDATED')
} )


app.put('/updatedesc', async(req,res)=>{
  let result = await pool.query('update public.mytable2 SET Description = $1  where id = $2', [req.body.Description, req.body.id])
  res.send('UPDATED')
} )



//  app.get('/count', async(req,res)=>{
//    let result = await pool.query('select * from public.mytable2 where done = false group by  ', [req.body.done])
//    res.send('count done')
//  })

app.get('/count', async (req,res)=>{
  let result = await pool.query(`select count(*) as total,
   count(done) filter (where done = 'true') as Done,
   count(done) filter (where done = 'false') as Pending
   from public.mytable2 `)
   //res.json({todo: result.rows})

  //res.parse(result.rows)
  
  //var b = result.rows
  ///var a= JSON.stringify(b)
  //res.send(a)
  //console.log(result)
  var answer = result.rows
  console.log(JSON.stringify(result.rows[0], '{}', 2));

})
// app.delete('/Delete', async(req,res)=>{
//   let result = await pool.query('DELETE FROM public.mytable2 where task = $1', [req.body.task])

//   res.send('Deleted')
// })

app.get(TODO_BASE_ROUTE, TodoController.getAll)
app.delete(TODO_DELETE_ROUTE, TodoController.deleteTask)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})