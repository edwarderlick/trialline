WARNING: File `gltest.config.yaml` not found in the current directory, using default config, create a `gltest.config.yaml` file to manage multiple networks
INFO: Clearing artifacts directory: artifacts
INFO: Using the following configuration:
INFO:   RPC URL: http://127.0.0.1:4000/api
INFO:   Selected Network: localnet
INFO:   Available networks: ['localnet', 'studio_devnet', 'studionet', 'testnet_asimov', 'testnet_bradbury']
INFO:   Selected chain type: localnet
INFO:   Available chains: localnet, studio_devnet, studionet, testnet_asimov, testnet_bradbury
INFO:   Contracts directory: contracts
INFO:   Artifacts directory: artifacts
INFO:   Environment: .env
INFO:   Default wait interval: 3000 ms
INFO:   Default wait retries: 50
INFO:   Leader only mode: False
============================= test session starts =============================
platform win32 -- Python 3.12.10, pytest-9.1.1, pluggy-1.6.0 -- C:\Users\samir\AppData\Local\Programs\Python\Python312\python.exe
cachedir: .pytest_cache
rootdir: D:\trialline
plugins: anyio-4.14.2, genlayer-test-0.30.0rc2
collecting ... collected 4 items

tests/direct/test_trialline.py::test_post_stamp_unique_hashes PASSED     [ 25%]
tests/direct/test_trialline.py::test_match PASSED                        [ 50%]
tests/direct/test_trialline.py::test_miss PASSED                         [ 75%]
tests/direct/test_trialline.py::test_thin PASSED                         [100%]

============================== 4 passed in 0.04s ==============================
