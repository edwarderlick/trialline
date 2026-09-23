import json
from genlayer import *
import hashlib

@evm.contract_interface
class _Recipient:
    class View: pass
    class Write: pass

@storage.allow
class TestHash:
    def __init__(self):
        pass

    @public.write
    def test_hash(self) -> str:
        h = hashlib.sha256(b"hello").hexdigest()
        return h
