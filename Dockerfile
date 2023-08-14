FROM ubuntu:22.04

RUN apt update && apt upgrade -y
RUN apt install -y python3 python3-pip ghc
RUN pip install fastapi uvicorn

WORKDIR /root
COPY server.py server.py
CMD python3 -m uvicorn server:app --host=0.0.0.0 --port=8080