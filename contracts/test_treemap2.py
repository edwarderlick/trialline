# { "Depends": "py-genlayer:test" }
from genlayer import *

class TestTreeMap2(contract.Contract):
    config: TreeMap[str, str]

    def __init__(self):
        pass