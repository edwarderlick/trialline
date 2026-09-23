import json
from genlayer import *

@dataclass
class Contract:
    def __init__(self):
        pass

    @public.read
    def get_dir(self) -> str:
        import genlayer
        import genlayer.message
        try:
            import genlayer.evm
            evm_dir = dir(genlayer.evm)
        except:
            evm_dir = []
        return json.dumps({
            "gl": dir(genlayer),
            "msg": dir(genlayer.message),
            "evm": evm_dir
        })
