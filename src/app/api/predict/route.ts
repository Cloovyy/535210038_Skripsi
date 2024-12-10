import { NextResponse } from "next/server";
import { spawn } from "child_process";

export async function POST(request: Request) {
    const data = await request.json();

    //menerima data pemain
    return new Promise((resolve, reject) => {
        const predictionData = {
            position : data.position,  // 'C', 'G', or 'F'
            player_data: {
                HANDLENGTH: data.handLength,
                HANDWIDTH: data.handWidth,
                HEIGHTWOSHOES: data.heightWoShoes,
                HEIGHTWSHOES: data.heightWShoes,
                STANDINGREACH: data.standingReach,
                WEIGHT: data.weight,
                WINGSPAN: data.wingspan,
            },
        }

        const pythonProcess = spawn('python', ['public/prediction.py', JSON.stringify(predictionData)]); 
        let result = '';
        let error = '';

        // Mengumpulkan output dari skrip Python
        pythonProcess.stdout.on('data', (chunk) => {
            result += chunk.toString();
        });

        // Kumpulkan kesalahan apa pun dari skrip Python
        pythonProcess.stderr.on('data', (chunk) => {
            error += chunk.toString();
        });

        // Membungkus hasil eksekusi Python ke dalam format JSON.
        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Python process exited with code ${code}: ${error}`));
            } else {
                // Parsing hasil JSON dari skrip Python
                try {
                    const resultJson = {
                        message: result
                    };
                    const parsedResult = JSON.stringify(resultJson);
                    resolve(NextResponse.json(parsedResult));
                } catch (parseError) {
                    reject(new Error('Failed to parse Python response: ' + parseError.message));
                }
            }
        });
    });
}