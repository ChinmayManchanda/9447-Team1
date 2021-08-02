# syntax=docker/dockerfile:1

FROM python:3.9.1-slim-buster
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip3 install --no-cache-dir -r requirements.txt
COPY . .
CMD [ "python", "-m" , "flask", "run", "--host=0.0.0.0"]
LABEL name=test
LABEL version=1.0
