# { "Depends": "py-genlayer:test" }
from genlayer import *

class Minimal(contract.Contract):
    def __init__(self):
        pass

    @public.view
    def hello(self) -> str:
        return "world"