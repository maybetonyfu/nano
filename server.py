from fastapi import FastAPI, Body
from subprocess import run
from fastapi.middleware.cors import CORSMiddleware

import tempfile
app = FastAPI()
origins = [
    "https://nano-gray.vercel.app",
    "https://nano-gray.vercel.app/",
    "http://localhost:4000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/{name}")
def query(name: str, body:str = Body()):
    fp = tempfile.NamedTemporaryFile(suffix='.hs', delete=False)
    file = f'''
{{-# LANGUAGE NoImplicitPrelude #-}}
module Main where
import Prelude (undefined, Char, Int, Bool, Integer, Float, Double)
main = undefined

{body}
        '''
    fp.write(str.encode(file))
    file_name = fp.name
    fp.close()
    result = run(f'ghc -e ":t {name}" {file_name}', shell=True, capture_output=True, text=True)
    if result.returncode == 0:
        return {'status': 'ok', 'file': file_name, 'message': result.stdout, 'text': file}
    else:
        print(result.stderr)
        return {"status": "failed", 'file': file_name, 'message': result.stderr, 'text': file}


@app.post("/")
def check(body:str = Body()):
    fp = tempfile.NamedTemporaryFile(suffix='.hs', delete=False)
    file = f'''
{{-# LANGUAGE NoImplicitPrelude #-}}
module Main where
import Prelude (undefined, Char, Int, Bool, Integer, Float, Double)
main = undefined

{body}
        '''
    fp.write(str.encode(file))
    name = fp.name
    fp.close()
    result = run(f'ghc -fno-code {name}', shell=True, capture_output=True, text=True)
    if result.returncode == 0:
        return {'status': 'ok', 'file': name, 'message': result.stdout, 'text': file}
    else:
        print(result.stderr)
        return {"status": "failed", 'file': name, 'message': result.stderr}
