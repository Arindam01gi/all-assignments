const express = require('express');
const app = express();
const jwt = require('jsonwebtoken')

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const secret_key = '33d327d6b6714add6267a1ae3fdfd748489c1636dffa4b57dbc939327186b42d'

const generatejwt=(user)=>{
  const payload = {username:user.username , password:user.password}
  return jwt.sign(payload,secret_key,{expiresIn:'1h'})

}

const authenticateJwt = (req,res,next) =>{
  const authHeaders = req.headers.authorization

  if(authHeaders){
    // const token = authHeader.split(' ')[1];
    const token = authHeaders
    jwt.verify(token,secret_key,(err,data)=>{
      if(err){
        res.status(403)
      }
      req.user = user 
      next()
    })
  }
}



// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const admin = req.body
  const adminExists = ADMINS.find((a) =>a.username === admin.username)
  if (adminExists){
    res.status(403).send({message:"Admin username already exists"})
  }else{
    ADMINS.push(admin)
    const token = generatejwt(admin)
    // console.log(token)
    res.status(201).send({message:"Admin created successfully", token})
  }

});

app.post('/admin/login',  (req, res) => {
  const { username, password } = req.headers;
  const admin = ADMINS.find(a => a.username === username && a.password === password);


  

  if (!admin){
      res.status(403).send({message:"Authentication Failed"})
  }else{
    const token = generatejwt(admin)
      res.send({message:"Admin logged in successfully",token})
  }

});

app.post('/admin/courses', authenticateJwt ,(req, res) => {
  // logic to create a course
  const course = req.body
  course.id = Date.now()

  COURSES.push(course)

  res.send({message:"Course created successfully"})

});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
});

app.post('/users/login', (req, res) => {
  // logic to log in user
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
