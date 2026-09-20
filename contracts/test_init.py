# { "Depends": "py-genlayer:test" }
from genlayer import *

class TestInit(contract.Contract):
    def __init__(self):
        owner = str(message.sender_address)