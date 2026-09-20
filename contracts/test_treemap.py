# { "Depends": "py-genlayer:test" }
from genlayer import *

class TestTreeMap(contract.Contract):
    config: TreeMap[str, str]

    def __init__(self):
        self.config = TreeMap()
        self.config["owner"] = "me"