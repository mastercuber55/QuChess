let engine;
let resolveQueue = [];

let pvLines = {};

export function getBestMove(fen, depth = 1, multiPV = 1) {
    if (!engine) {
        engine = new Worker("/stockfish.js");

        engine.onmessage = (e) => {
            const line = e.data;

            if (line.includes("multipv")) {
                const match = line.match(/multipv (\d+).* pv ([a-h1-8]+)/);
                if (match) {
                    const index = match[1];
                    const move = match[2];

                    pvLines[index] = move;
                }
            }

            if (line.startsWith("bestmove")) {
                const bestMove = line.split(" ")[1];

                const moves = Object.values(pvLines);

                const pool = moves.length ? moves : [bestMove];

                const chosen =
                    pool[Math.floor(Math.random() * Math.min(pool.length, multiPV))];

                resolveQueue.shift()?.(chosen);

                pvLines = {};
            }
        };

        engine.postMessage("uci");
        engine.postMessage("isready");

        engine.postMessage("setoption name Skill Level value 0");
        engine.postMessage("setoption name Contempt value 100");
    }

    return new Promise((resolve) => {
        resolveQueue.push(resolve);

        engine.postMessage(`setoption name MultiPV value ${multiPV}`);

        engine.postMessage(`position fen ${fen}`);
        engine.postMessage(`go depth ${depth}`);
        // engine.postMessage(`go movetime 50`);
    });
}