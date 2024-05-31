import { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';

export default function claim(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { address } = req.body;

        if (!address) {
            return res.status(400).json({ error: 'Address is required' });
        }

        const command = `sui client call --package 0x7ad34e7964c67b3e60d9698ef906ed304c477e2dfc022837085b93019e769563 --module mycoin --function issue_token --args 0xa8b555aee38100f747d2a10297435fcb4cd3d1d000c3ecad30bf3d73e609a382 0x5b00850d273f98e27a1dacfaa8d43232898ca6df4720a5cb418173eeb69f1d82 ${address} --gas-budget 30000000`;

        console.log("Executing command:", command);

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${error}`);
                return res.status(500).json({ error: 'Failed to execute command', details: stderr });
            }
            return res.status(200).json({ message: `Command executed successfully: ${stdout}` });
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
