# JWT-Based-User-Authentication-with-Todo-CRUD

A simple multi-user Todo application built with Node.js and Express.js that demonstrates JWT-based authentication, protected API routes, and user-specific Todo management.

The application allows users to register, sign in, receive a JWT token, and perform Todo operations only after authentication.

## Features

* User registration
* User login using username and password
* JWT-based authentication
* Protected API endpoints
* User-specific Todo retrieval
* Add Todo functionality
* Token-based authorization using request headers
* Axios integration with the frontend
* LocalStorage-based JWT token storage
* REST API architecture
* Error handling for missing and invalid tokens

## Technologies Used

* Node.js
* Express.js
* JSON Web Token (JWT)
* Axios
* HTML
* CSS
* JavaScript
* npm

## Project Structure

```text
JWT-Todo-App/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
└── README.md
```

The exact file structure may vary depending on the project setup.

## Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* Git

Check the installations:

```bash
node -v
npm -v
git --version
```

## Installation

Clone the repository:
git clone 

Move into the project directory 
cd JWT-Todo-App

Install the required dependencies:
npm install


## Required Dependencies

The backend uses:

npm install express jsonwebtoken
npm install axios

The dependencies will be recorded in `package.json`.

## Running the Backend

Start the Node.js server:
node server.js

The backend runs on:
http://localhost:3000


## Authentication Flow

The application uses JWT to authenticate users.

The flow is:

```text
User
  |
  | Sign Up
  v
Backend
  |
  | User stored
  v
Sign In
  |
  | username + password
  v
Backend
  |
  | JWT generated
  v
Frontend
  |
  | Token stored in localStorage
  v
Protected API Request
  |
  | Token sent in request header
  v
Backend
  |
  | jwt.verify()
  v
User-specific Todo
```

## API Endpoints

### 1. Sign Up

```http
POST /signUp
```

Request body:

```json
{
  "username": "sohail",
  "password": "1234"
}
```

Example:

```javascript
axios.post("http://localhost:3000/signUp", {
    username: "sohail",
    password: "1234"
});
```

### 2. Sign In

```http
POST /signIn
```

Request body:

```json
{
  "username": "sohail",
  "password": "1234"
}
```

Successful response:

```json
{
  "message": "Login successful",
  "token": "JWT_TOKEN"
}
```

The frontend stores the token:

```javascript
localStorage.setItem("token", res.data.token);
```

## JWT Token

The server generates the JWT after successful login.

Example:

```javascript
const token = jwt.sign(
    {
        username: user.username
    },
    "my-secret-key",
    {
        expiresIn: "1h"
    }
);
```

The token contains the username so that the backend can identify the logged-in user.

Passwords should never be stored inside a JWT.

## Protected Routes

Protected requests send the JWT through the `token` request header.

Example:

```javascript
const token = localStorage.getItem("token");

axios.post(
    "http://localhost:3000/add",
    {
        note: "Learn JWT"
    },
    {
        headers: {
            token: token
        }
    }
);
```

The backend reads the token:

```javascript
const token = req.headers.token;
```

Then verifies it:

```javascript
const decoded = jwt.verify(
    token,
    "my-secret-key"
);
```

The username can then be obtained from:

```javascript
const username = decoded.username;
```

## 3. Add Todo

```http
POST /add
```

Request:

```json
{
  "note": "Learn Node.js"
}
```

Header:

```text
token: JWT_TOKEN
```

The backend associates the Todo with the authenticated user.

Example stored data:

```javascript
[
    {
        note: "Learn Node.js",
        username: "sohail"
    },
    {
        note: "Learn JWT",
        username: "sohail"
    },
    {
        note: "Learn React",
        username: "rahul"
    }
]
```

## 4. Get Todos

```http
GET /get
```

Header:

```text
token: JWT_TOKEN
```

The backend first verifies the token and obtains the username.

It then filters the Todos:

```javascript
const notes = arr
    .filter(item => item.username === username)
    .map(item => item.note);
```

For example, if the authenticated user is `sohail`, the response will contain only Sohail's Todos:

```json
[
  "Learn Node.js",
  "Learn JWT"
]
```

The Todos belonging to other users are not returned.

## Frontend Example

Retrieve the authenticated user's Todos:

```javascript
async function gettodo() {

    const token = localStorage.getItem("token");

    const res = await axios.get(
        "http://localhost:3000/get",
        {
            headers: {
                token: token
            }
        }
    );

    const data = res.data;

    const list = document.getElementById("list");

    list.innerHTML = "";

    for (let i = 0; i < data.length; i++) {

        const div = document.createElement("div");

        div.classList.add("todo");

        div.textContent = data[i];

        list.appendChild(div);
    }
}
```

## JWT Error Handling

The application handles common authentication errors.

### Missing Token

If the request does not contain a token:

```text
401 Unauthorized
```

Example response:

```json
{
  "message": "You are not logged in"
}
```

### Invalid or Expired Token

If JWT verification fails:

```text
401 Unauthorized
```

Example response:

```json
{
  "message": "Invalid or expired token"
}
```

### Malformed Token

If the token does not contain the required user information:

```text
403 Forbidden
```

## Important Concepts Demonstrated

This project demonstrates the following backend concepts:

* REST APIs
* HTTP methods
* Express.js routing
* Request and response objects
* Middleware
* JWT authentication
* Authentication vs authorization
* HTTP status codes
* Request headers
* Request body
* Axios
* LocalStorage
* Protected routes
* User-specific data
* Array `filter()`
* Array `map()`
* Error handling

## Authentication vs Authorization

Authentication answers:

```text
Who are you?
```

For example:

```text
Username + Password → JWT
```

Authorization answers:

```text
What are you allowed to access?
```

In this project, the JWT identifies the logged-in user, and the backend uses that identity to return only that user's Todos.

## Current Data Storage

This learning project currently stores users and Todos in memory using JavaScript arrays.

Example:

```javascript
const credentials = [];

const arr = [];
```

This means the data will be lost whenever the Node.js server restarts.

For a production application, the data should be stored in a database such as:

* PostgreSQL
* MySQL
* MongoDB

A production application should also store passwords using secure password hashing such as bcrypt rather than storing plain-text passwords.

## Security Notes

The current project uses:

```javascript
"my-secret-key"
```

directly in the source code for learning purposes.

In a production application, use an environment variable:

```env
JWT_SECRET=your-secret-key
```

Then access it using:

```javascript
process.env.JWT_SECRET
```

Other production improvements would include:

* Password hashing
* Environment variables
* Database persistence
* Input validation
* Rate limiting
* HTTPS
* Secure token storage
* Proper authorization checks
* Centralized authentication middleware
* Better error handling

## Learning Outcome

After completing this project, you should understand how a frontend and backend communicate using REST APIs and how JWT can be used to authenticate users and protect API endpoints.

The main authentication flow is:

```text
Register
   ↓
Login
   ↓
Generate JWT
   ↓
Store JWT
   ↓
Send JWT with protected request
   ↓
Verify JWT
   ↓
Identify User
   ↓
Return User-specific Data
```

## Future Improvements

Possible improvements for this project:

* Add Update Todo
* Add Delete Todo
* Add Todo IDs
* Add database integration
* Add bcrypt password hashing
* Create authentication middleware
* Add JWT refresh tokens
* Add logout functionality
* Add React frontend
* Add input validation
* Add centralized error handling
* Deploy backend and frontend
* Add automated tests
