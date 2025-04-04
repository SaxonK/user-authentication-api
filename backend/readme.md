# Auth
## Register
Creates a new user in the 'User' table.
### HTTP Request
```http
POST http://example.com/api/auth/register
```

### Query Parameters

| Parameter | Type | Required | Description |
| ----------- | ----------- | ----------- | ----------- |
| `firstName` | string | true | The first name of the user |
| `lastName` | string | true | The last name / surname of the user |
| `email` | string | true | The email address for the user account. Must be unique and used to login to user account |
| `password` | string | true | The password for the user account |

### Response - 201 Success 
```json
{
  "message": "User create for user@example.com"
}
```
### Response - 400 Generic
```json
{
  "message": "Unable to create user"
}
```
### Response - 400 Duplicate Email
```json
{
  "message": "An account already exists for the email address user@example.com"
}
```
## Login
Authenticates user credentials and assigns http only refresh and access token cookies.
### HTTP Request
```http
POST http://example.com/api/auth/login
```

### Query Parameters

| Parameter | Type | Required | Description |
| ----------- | ----------- | ----------- | ----------- |
| `email` | string | true | The email address for the user account |
| `password` | string | true | The password for the user account |

### Response - 200 Success 
```json
{
  "message": "Logged in successfully as user@example.com"
}
```
### Response - 400 Generic
```json
{
  "message": "Invalid username or password"
}
```
### Response - 400 Account Disabled
```json
{
  "message": "User account disabled"
}
```
### Response - 500 Unexpected Error
```json
{
  "message": "An unknown error occurred"
}
```
## Logout
Sets last logout date to time of request. Last logout date is used to invalidate access and refresh tokens and as such prevents users from accessing resources until the user has been reissued a new refresh token.
### HTTP Request
```http
POST http://example.com/api/auth/logout
```

### Query Parameters
Not required.

### Response - 200 Success 
```json
{
  "message": "User logged out."
}
```
### Response - 400 Generic
```json
{
  "message": "No user found."
}
```
### Response - 404 No valid logged in user
```json
{
  "message": "No logged in user."
}
```
## Refresh
Reissue an access token by providing a valid refresh token.
### HTTP Request
```http
POST http://example.com/api/auth/refresh
```

### Query Parameters
Not required.

### Response - 200 Success 
```json
{
  "message": "New access token assigned"
}
```
### Response - 400 Generic
```json
{
  "message": "Unauthorised"
}
```
### Response - 401 Expired Refresh Token
```json
{
  "message": "Refresh token expired, please re-authenticate"
}
```
# User
## User
Get authenticated users record from the 'User' table.
### HTTP Request
```http
GET http://example.com/api/user
```

### Query Parameters
Not required.

### Response - 200 Success 
```json
{
  "user": {
    "id": "123",
    "firstName": "John",
    "lastName": "Smith",
    "email": "jsmith@example.com",
    "company": null,
    "country": null,
    "phoneNumber": null,
    "profilePicture": null,
    "lastLogoutDateTime": null,
    "isActive": true
  }
}
```
### Response - 404 Generic
```json
{
  "message": "No logged in user."
}
```
## Deactivate
Sets the 'isActive' value on the 'User' table to false for the  authenticated user.
### HTTP Request
```http
POST http://example.com/api/deactivate
```

### Query Parameters
Not required.

### Response - 200 Success 
```json
{
  "message": "User account has been deactivated."
}
```
### Response - 404 Generic
```json
{
  "message": "No logged in user."
}
```
### Response - 500 Unexpected Error
```json
{
  "message": "An unexpected error occured."
}
```
## Update
Updates user records in the 'User' table for the authenticated user.
### HTTP Request
```http
PUT http://example.com/api/update
```

### Query Parameters

| Parameter | Type | Required | Description |
| ----------- | ----------- | ----------- | ----------- |
| `firstName` | string | true | The first name of the user |
| `lastName` | string | true | The last name / surname of the user |
| `email` | string | true | The email address for the user account. Must be unique and used to login to user account |
| `company` | string | false | The company the user works for/associated with |
| `country` | string | false | The users country |
| `phoneNumber` | string | false | The users phone number |
| `profilePicture` | string | false | An image url that is used for the users profile picture |

### Response - 200 Success 
```json
{
  "message": "User details have been updated."
}
```
### Response - 404 Generic
```json
{
  "message": "No logged in user."
}
```
### Response - 500 Unexpected Error
```json
{
  "message": "An unexpected error occured."
}
```
