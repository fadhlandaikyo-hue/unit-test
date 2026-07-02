# User api Spec

## Register User API

Endpoint : POST /api/users

Request Body:

```json
{
  "username": "pzn",
  "password": "secret",
  "name": "Programmer Zaman Now",
  "email": "muhammadfadhlan6gmail.com",
  "role": "employee"
}
```

Response Body Success :

```json
{
  "data": {
    "username": "pzn",
    "name": "Programmer Zaman Now",
    "email": "muhammadfadhlan6gmail.com"
  }
}
```

Response Body Error :

```json
{
  "errors": "Username already registered"
}
```

## Login User API

Endpoint : POST /api/users/login

Request Body :

```json
{
  "username": "pzn",
  "password": "rahasia"
}
```

Response Body Success :

```json
{
  "data": {
    "token": "unique-token"
  }
}
```

Response Body Error :

```json
{
  "errors": "Username or password wrong"
}
```

## Update User API

Endpoint : PATCH /api/users/current

Headers :

- Authorization : token

Request Body :

```json
{
  "name": "Programmer Zaman Now Lagi",
  "password": "new password",
  "email": "new email",
  "role": "admin"
}
```

Response Body Success :

```json
{
  "data": {
    "username": "pzn",
    "name": "Programmer Zaman Now Lagi",
    "email": "new email",
    "role": "admin"
  }
}
```

Response Body Error :

```json
{
  "errors": "Name length max 100"
}
```

## Get User API

Endpoint : GET /api/users/current

Headers :

- Authorization : token

Response Body Success:

```json
{
  "data": {
    "username": "pzn",
    "name": "Programmer Zaman Now",
    "email": "muhammadfadhlan6gmail.com",
    "role": "employee"
  }
}
```

Response Body Error :

```json
{
  "errors": "Unauthorized"
}
```

## Logout User API

Endpoint : DELETE /api/users/logout

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": "OK"
}
```

Response Body Error :

```json
{
  "errors": "Unauthorized"
}
```