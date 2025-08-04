Make It Installable as a CLI Tool
Install it locally with:

Make It Installable as a CLI Tool
```
pip install -e .
```
Now you can run it like:
```
price-tracker check
price-tracker start
```

Build the Docker Image
```
docker build -t price-tracker .
```
Run the Container
```
docker run --env-file .env price-tracker
```
