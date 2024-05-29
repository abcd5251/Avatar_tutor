import os
import requests
import shutil
from pinatapy import PinataPy
from dotenv import load_dotenv
load_dotenv()  # take environment variables from .env.

# Connect to the IPFS cloud service
pinata_api_key=str(os.environ.get('PINATA_API_KEY'))
pinata_secret_api_key=str(os.environ.get('PINATA_SECRET_API_KEY'))
pinata = PinataPy(pinata_api_key,pinata_secret_api_key)

# Upload the file
result = pinata.pin_file_to_ipfs("logo.png")

# Should return the CID (unique identifier) of the file
print("result", result)
gateway=os.environ.get('GATEWAY_URL')
url = gateway + "/ipfs/" + result['IpfsHash']
print(url)
