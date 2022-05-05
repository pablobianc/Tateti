import { useEffect, useState } from "react";

import "./App.css";

const WINNING_COMPS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const INITIAL_STATE = new Array(9).fill("");

enum Player {
  X = "X",
  O = "O",
}

enum Status {
  Playing = "PLAYING",
  DRAW = "DRAW",
  XWON = "XWON",
  OWON = "OWON",
}

function App() {
  const [turn, setTurn] = useState<Player>(Player.X);
  const [cells, setCells] = useState<(Player | "")[]>(INITIAL_STATE);
  const [status, setStatus] = useState<Status>(Status.Playing);
  const [scoreboard, setScoreboard] = useState<Record<Player, number>>({
    [Player.X]: 0,
    [Player.O]: 0,
  });

  function handleClick(index: number) {
    if (status !== Status.Playing) return;
    const draft = [...cells];

    if (draft[index] == "") {
      draft[index] = turn;
      setTurn((turn) => (turn === Player.X ? Player.O : Player.X));
      setCells(draft);
    }
  }

  function handleReset() {
    setCells(INITIAL_STATE);
    setStatus(Status.Playing);
  }

  useEffect(() => {
    let winner: Player | undefined;

    for (let player of [Player.X, Player.O]) {
      const hasWon = WINNING_COMPS.some((comp) =>
        comp.every((cell) => player === cells[cell])
      );

      if (hasWon) {
        winner = player;
      }

      console.log(winner);
    }

    if (winner === Player.X) {
      setStatus(Status.XWON);
      setScoreboard((scoreboard) => ({
        ...scoreboard,
        [Player.X]: scoreboard[Player.X] + 1,
      }));
    } else if (winner === Player.O) {
      setStatus(Status.OWON);
      setScoreboard((scoreboard) => ({
        ...scoreboard,
        [Player.O]: scoreboard[Player.O] + 1,
      }));
    } else if (
      cells.every((cell) => [Player.O, Player.X].includes(cell as any))
    ) {
      setStatus(Status.DRAW);
    }
  }, [cells]);

  return (
    <main>
      <section>
        <p className='turn'> TATETI: Turno de: {turn}</p>
        <p className='team'>
          X Ganó: {scoreboard[Player.X]}, O Ganó: {scoreboard[Player.O]}{" "}
        </p>
      </section>
      <div className='board'>
        {cells.map((cell, index) => (
          <div key={index} className='cell' onClick={() => handleClick(index)}>
            {cell}
          </div>
        ))}
      </div>
      {status !== Status.Playing && (
        <section>
          <article className='item' role='alert'>
            {status == Status.DRAW && "Empate!"}
            {status == Status.OWON && "Gano O!"}
            {status == Status.XWON && "Gano X!"}
          </article>
          <button className='buttonContainer' onClick={handleReset}>
            Reiniciar
          </button>
        </section>
      )}
    </main>
  );
}

export default App;
