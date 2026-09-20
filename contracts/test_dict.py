# { "Depends": "py-genlayer:test" }
from genlayer import *

class TestDict(contract.Contract):
    config: dict

    def __init__(self):
        self.config = {}
        self.config["owner"] = str(message.sender_address)