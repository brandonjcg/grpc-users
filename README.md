# user-grpc

Microservice for user notifications

## Installation

1. Clone the repository:

```bash
git clone https://github.com/brandonjcg/grpc-users
```

2. Run the following command to build and start the containers:

```bash
docker-compose up --build
```

## Testing for user microservice

To test all cases, you can use the following endpoints:

1. **Get list of users**:

   ```bash
   curl -X GET http://localhost:3000/api/v1/user
   ```

2. **Get user by id**:

   ```bash
   curl -X GET http://localhost:3000/api/v1/user/{id}
   ```

3. **Create a new user**:

   ```bash
   curl -X POST http://localhost:3000/api/v1/user -H "Content-Type: application/json" -d '{"name": "Pepe Panda", "email": "pepe.panda.doe@gmail.com", "age": 25}'
   ```

4. **Update a user**:

   ```bash
   curl -X PATCH http://localhost:3000/api/v1/user/{id} -H "Content-Type: application/json" -d '{"name": "John Smith", "email": "john.smith@example.com", "age": 30, "id": "id"}'
   ```

5. **Notify a user**:
   ```bash
   curl -X GET "http://localhost:3000/api/v1/user/{id}/notify?message=Hello%20Brandon"
   ```

Documentation for the REST API can be found at `http://localhost:3000/api/v1/docs`.

## Testing for notification microservice (In Postman)

1. **Send notification**:

   - **Method**: gRPC
   - **Service**: `NotificationService`
   - **RPC Method**: `SendNotification`
   - **URL**: `localhost:50052`
   - **Headers**:
     - `Content-Type`: `application/grpc`
   - **Body**:
     - **JSON Format** for the request:
       ```json
       {
         "user_id": "id",
         "message": "Hello Brandon"
       }
       ```
   - **Expected Response**:
     ```json
     {
       "message": "Notification sent successfully"
     }
     ```

2. **Get user by id**:

   - **Service**: `UserService`
   - **RPC Method**: `GetUserById`
   - **URL**: `localhost:50052`
   - **Headers**:
     - `Content-Type`: `application/grpc`
   - **Request Body**:

     - **JSON Format**:
       ```json
       {
         "id": "1"
       }
       ```

   - **Expected Response**:
     ```json
     {
       "success": true,
       "message": "User with id 1 found",
       "user": {
         "id": "1",
         "name": "John Smith",
         "email": "john.smith@example.com"
       }
     }
     ```

## Evidence of the functionality

https://jam.dev/c/0a1db0e7-bb06-4424-934a-49f4c9495eed

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Author

- [Brandon Castillo](https://github.com/brandonjcg) - Software developer 👨🏽‍💻
