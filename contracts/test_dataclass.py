# { "Depends": "py-genlayer:test" }
from dataclasses import dataclass
from genlayer import *

@allow_storage
@dataclass
class Dummy:
    a: str

class TestDC(contract.Contract):
    d: TreeMap[str, Dummy]
    def __init__(self):
        pass