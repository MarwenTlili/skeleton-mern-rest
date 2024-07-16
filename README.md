# How To

## 1. Docker

```bash
# Builds, (re)creates, starts, and attaches to containers for a service.
docker compose up -d
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
