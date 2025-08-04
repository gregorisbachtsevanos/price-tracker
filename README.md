Build the Docker Image
```
docker build -t price-tracker .
```
Run the Container
```
docker run --env-file .env price-tracker
```
