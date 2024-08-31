# Backend
**ExpressJS** Restful-API back-end project

## Endpoints

### Root
```bash
curl http://localhost:5000/api/v1/ | json_pp
```

returns project metadata informations, eg:
```json
{
  "application": "MERN Skeleton project in Docker environment.",
  "version": "1.0.0",
  "documentation": "http://localhost/docs",
  "contact": {
    "email": "support@example.com"
  }
}
```

### JWT Authentication
```bash
# returns {accessToken, refreshToken}
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H 'Content-type:application/json' \
  -d '{"name": "user", "email": "user@example.com", "password": "user"}' \
  | json_pp

# returns {accessToken, refreshToken}
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H 'Content-type:application/json' \
  -d '{"identifier": "user", "password": "user"}' \
  | json_pp

# REFRESH_TOKEN from register or login
# returns {accessToken, refreshToken}
curl -X POST http://localhost:5000/api/v1/auth/refresh-tokens \
  -H 'Content-type:application/json' \
  -d '{"refreshToken": "REFRESH_TOKEN"}' \
  | json_pp
```

### Users
```bash
# POST /users
curl -X POST http://localhost:5000/api/v1/users \
  -H 'Content-type:application/json' \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Y2RhNmQ2ZmM5MWM0NjZkYzA1ZTY2ZSIsImlhdCI6MTcyNTEyMzMyNSwiZXhwIjoxNzI1MjA5NzI1fQ.0vrj53FUF36EK6Pl0P0J4KeLUSyA1O-x6htvP0bijmw" \
  -d '{"name": "user3", "email": "user3@example.com", "password": "user3"}' \
  | json_pp

# GET /users
curl GET http://localhost:5000/api/v1/users \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Y2RhNmQ2ZmM5MWM0NjZkYzA1ZTY2ZSIsImlhdCI6MTcyNTEyMzMyNSwiZXhwIjoxNzI1MjA5NzI1fQ.0vrj53FUF36EK6Pl0P0J4KeLUSyA1O-x6htvP0bijmw" \
  | json_pp

# GET /users/{id}
curl GET http://localhost:5000/api/v1/users/66d34d894ec2f5b4ea7d20b5 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Y2RhNmQ2ZmM5MWM0NjZkYzA1ZTY2ZSIsImlhdCI6MTcyNTEyMzMyNSwiZXhwIjoxNzI1MjA5NzI1fQ.0vrj53FUF36EK6Pl0P0J4KeLUSyA1O-x6htvP0bijmw" \
  | json_pp

# PUT /users/{id}
curl -X PUT http://localhost:5000/api/v1/users/66d34d894ec2f5b4ea7d20b5 \
  -H 'Content-type:application/json' \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Y2RhNmQ2ZmM5MWM0NjZkYzA1ZTY2ZSIsImlhdCI6MTcyNTEyMzMyNSwiZXhwIjoxNzI1MjA5NzI1fQ.0vrj53FUF36EK6Pl0P0J4KeLUSyA1O-x6htvP0bijmw" \
  -d '{"name": "userX"}' \
  | json_pp

# DELETE /users/{id}
# returns 204 No Content
curl -X DELETE http://localhost:5000/api/v1/users/66d34d894ec2f5b4ea7d20b5 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Y2RhNmQ2ZmM5MWM0NjZkYzA1ZTY2ZSIsImlhdCI6MTcyNTEyMzMyNSwiZXhwIjoxNzI1MjA5NzI1fQ.0vrj53FUF36EK6Pl0P0J4KeLUSyA1O-x6htvP0bijmw" \
  | json_pp
```
