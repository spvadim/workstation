FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8
# install snap7 library
RUN apt-get update
RUN apt-get install p7zip
RUN wget -O snap7-full-1.4.2.7z https://sourceforge.net/projects/snap7/files/1.4.2/snap7-full-1.4.2.7z/download
RUN p7zip -d snap7-full-1.4.2.7z
RUN cd snap7-full-1.4.2 && cd build/unix && make -f x86_64_linux.mk install
RUN ldconfig
# copy contents of project into docker
COPY ./ /app

# install poetry
RUN pip install poetry

# disable virtualenv for peotry
RUN poetry config virtualenvs.create false

# install dependencies
RUN poetry install --no-dev

ENV PORT=8080
