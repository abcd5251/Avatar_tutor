from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Address(BaseModel):
    address: str

@app.post("/claim")
async def claim(address: Address):
    if not address.address:
        raise HTTPException(status_code=400, detail="Address is required")

    command = [
        "sui", "client", "call",
        "--package", "0x7ad34e7964c67b3e60d9698ef906ed304c477e2dfc022837085b93019e769563",
        "--module", "mycoin",
        "--function", "issue_token",
        "--args", "0xa8b555aee38100f747d2a10297435fcb4cd3d1d000c3ecad30bf3d73e609a382",
        "0x5b00850d273f98e27a1dacfaa8d43232898ca6df4720a5cb418173eeb69f1d82",
        address.address,
        "--gas-budget", "30000000"
    ]

    print("Command to be executed:", ' '.join(command))
    try:
        result = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = result.communicate()

        if result.returncode != 0:
            print('stderr:', stderr.decode())
            raise HTTPException(status_code=500, detail="Error executing command")
        
        return {"message": f"Reward sent to address: {address.address}", "result": stdout.decode()}
    except subprocess.CalledProcessError as e:
        print('Error executing command:', e)
        raise HTTPException(status_code=500, detail="Internal Server Error")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
