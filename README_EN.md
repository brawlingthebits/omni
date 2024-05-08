# Omni Application Documentation

## 1. General Overview

Omni is a Node.js web application that supports user authentication and real-time communication via a chat interface. It is designed to demonstrate fundamental backend operations, real-time interaction with Socket.io, and REST API usage for user management.

## 2. Technology Stack

- **Node.js**: The runtime environment for the server-side logic.
- **Express**: Framework used to build the web server.
- **Sequelize**: ORM for interacting with the MySQL database.
- **MySQL**: The relational database to store user data and chat messages.
- **Socket.io**: Enables real-time bi-directional communication between web clients and the server.
- **JWT**: Used for securing and authenticating API requests and socket connections.
- **Passport**: Authentication middleware for Node.js.

## 3. Setup Instructions

### Prerequisites
- Node.js installed on your machine.
- MySQL server running locally or accessible remotely.
- Postman or any API client for testing endpoints.

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone [repository URL]
   cd omni

2. Install dependencies:
```bash
npm install
```
3. Database Setup:
Ensure MySQL is running and create a database named according to the .env configuration.

4. Environment Configuration:
Create a .env file in your root directory with the following keys:

```bash
DB_NAME=omni_db
DB_USER=root
DB_PASSWORD=password
DB_HOST=localhost
JWT_SECRET=your_jwt_secret
```

5. Start the Server:

```bash
npm start
```
This will start the server on http://localhost:3000.


## 4. User Guide

### Testing with Postman

#### User Registration
- **Endpoint:** POST `/users/`
- **Body:** 
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "123456"
  }
#### User Login

- **Endpoint:** POST `/users/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "123456"
  }
Note: Upon successful login, use the returned JWT for authenticating chat requests. Store this token on the web browser using:
```shell
localStorage.setItem('jwtToken', 'Bearer <your_jwt_token>');
```
#### Chat Interface
After logging in and setting the JWT token, load the chat interface by navigating to http://localhost:3000/chat.

## 5. API Documentation

### Endpoints

#### Create User
- **Endpoint:** POST `/users/`
- **Body:**
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
### Login
- **Endpoint:** POST /users/login
- **Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

### Chat Routes
### Chat Room Interface
- Endpoint: GET /chat
- Authentication: JWT required in the query parameter.

### Retrieve All Users
To fetch all users in the database, send a GET request to the /users endpoint:

```bash
curl -X GET http://localhost:3000/users
```
This will return a list of all users with their id, name, and email.

### Retrieve a Single User
To fetch a specific user by ID, you need the user's ID from the previous output. Replace :id with the actual user ID.

```bash
curl -X GET http://localhost:3000/users/:id
```
Replace :id with the actual ID of the user you wish to retrieve. This should return the user's details if found.

### Update User Information
To update information for an existing user, use the PUT method. You'll need to include the new name and/or email in the request body.

```bash
curl -X PUT http://localhost:3000/users/:id \
-H "Content-Type: application/json" \
-d '{"name": "Jane Doe", "email": "janedoe@example.com"}'
```
Replace :id with the user ID. This should update the user's name and email if the user exists.

### Delete a User
To delete a user, send a DELETE request with the user ID:

```bash
curl -X DELETE http://localhost:3000/users/:id
```
Replace :id with the actual user ID. This should delete the user and return a 204 status code if successful.

### Error Handling
You should also test how the API handles errors, such as trying to retrieve, update, or delete a non-existent user. For instance, attempting to get a user that doesn't exist should return a 404 status code:

```bash
curl -X GET http://localhost:3000/users/99999
```
Assuming 99999 is an ID that does not exist in the database.

## 6. Error Handling
Errors are logged on the console and returned to the client with appropriate HTTP status codes. Authentication errors prevent users from accessing the chat functionality and require checking the JWT validity.

## 7. Conclusion
This documentation should provide all the necessary information to set up, test, and understand the Omni application. For any additional queries or troubleshooting, refer to the source code and error logs.