FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8
# install snap7 library
RUN apt-get update
RUN apt-get install p7zip
RUN wget -O snap7-full-1.4.2.7z https://sourceforge.net/projects/snap7/files/1.4.2/snap7-full-1.4.2.7z/download
RUN p7zip -d snap7-full-1.4.2.7z
RUN cd snap7-full-1.4.2 && cd build/unix && make -f x86_64_linux.mk install
RUN ldconfig

ENV PYTHONFAULTHANDLER=1 \
  PYTHONUNBUFFERED=1 \
  PYTHONHASHSEED=random \
  PIP_NO_CACHE_DIR=off \
  PIP_DISABLE_PIP_VERSION_CHECK=on \
  PIP_DEFAULT_TIMEOUT=100

# install poetry
RUN pip install poetry

# Copy only requirements to cache them in docker layer
WORKDIR /app
COPY poetry.lock pyproject.toml /app/

# disable virtualenv for peotry
RUN poetry config virtualenvs.create false

# install dependencies
RUN poetry install --no-dev --no-interaction --no-ansi

COPY ./ /app
ENV PORT=8080
