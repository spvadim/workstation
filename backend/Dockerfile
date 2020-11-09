FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8

# copy contents of project into docker
COPY ./ /app

# install poetry
RUN pip install poetry

# disable virtualenv for peotry
RUN poetry config virtualenvs.create false

# install dependencies
RUN poetry install

ENV PORT=8080