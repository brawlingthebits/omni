1. Create a New User
To create a new user, send a POST request with the required user information (name, email, and password). You'll use JSON format for the body.

```bash
curl -X POST http://localhost:3000/users \
-H "Content-Type: application/json" \
-d '{"name": "John Doe", "email": "johndoe@example.com", "password": "mypassword"}'
```
This should return a 201 status code with the created user's information if the request is successful.

2. Retrieve All Users
To fetch all users in the database, send a GET request to the /users endpoint:

```bash
curl -X GET http://localhost:3000/users
```
This will return a list of all users with their id, name, and email.

3. Retrieve a Single User
To fetch a specific user by ID, you need the user's ID from the previous output. Replace :id with the actual user ID.

```bash
curl -X GET http://localhost:3000/users/:id
```
Replace :id with the actual ID of the user you wish to retrieve. This should return the user's details if found.

4. Update User Information
To update information for an existing user, use the PUT method. You'll need to include the new name and/or email in the request body.

```bash
curl -X PUT http://localhost:3000/users/:id \
-H "Content-Type: application/json" \
-d '{"name": "Jane Doe", "email": "janedoe@example.com"}'
```
Replace :id with the user ID. This should update the user's name and email if the user exists.

5. Delete a User
To delete a user, send a DELETE request with the user ID:

```bash
curl -X DELETE http://localhost:3000/users/:id
```
Replace :id with the actual user ID. This should delete the user and return a 204 status code if successful.

6. Error Handling
You should also test how the API handles errors, such as trying to retrieve, update, or delete a non-existent user. For instance, attempting to get a user that doesn't exist should return a 404 status code:

```bash
curl -X GET http://localhost:3000/users/99999
```
Assuming 99999 is an ID that does not exist in the database.