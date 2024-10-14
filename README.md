# How To

## 1. Docker

```bash
# Builds, (re)creates, starts, and attaches to containers for a service.
docker compose up -d

# rebuild backend service without using cache
docker compose build backend --no-cache
```

### 1.1 MongoDB

```bash
# Logs
docker logs skeleton_mern_rest-mongo -f

# Connect to mongodb
# from host
mongosh -u root -p admin
mongosh mongodb://dev:dev@127.0.0.1:27017/skeleton
# from container
docker exec -it skeleton_mern_rest-mongo mongosh -u root -p admin
docker exec -it skeleton_mern_rest-mongo mongosh mongodb://dev:dev@127.0.0.1:27017/skeleton
```

### 1.2 Backend (ExpressJS)

```bash
# Logs
docker logs skeleton_mern_rest-backend -f

# interract with container
docker exec -it skeleton_mern_rest-backend sh
```

#### Testing backend

```sh
# jest
npm i -D jest ts-jest @types/jest supertest @types/supertest
npm i -D @shelf/jest-mongodb

# run all tests (under __tests__/*)
npm test
# OR a single test file
npm test -- __tests__/user/user.integration.test.ts
```
