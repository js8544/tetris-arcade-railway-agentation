import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import './App.css'

const BOARD_COLS = 10
const BOARD_ROWS = 20
const PREVIEW_SIZE = 4

type Cell = string | null
type Board = Cell[][]
type GameStatus = 'idle' | 'running' | 'paused' | 'over'

type PieceKey = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z'

type Piece = {
  key: PieceKey
  shape: number[][]
  color: string
  x: number
  y: number
}

type GameState = {
  board: Board
  active: Piece
  next: PieceKey
  status: GameStatus
  score: number
  level: number
  lines: number
}

type Tetromino = {
  shape: number[][]
  color: string
}

const TETROMINOS: Record<PieceKey, Tetromino> = {
  I: {
    shape: [[1, 1, 1, 1]],
    color: '#56d5ff',
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: '#4d7dff',
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: '#ffa23c',
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: '#ffe263',
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: '#4fe37b',
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: '#d378ff',
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: '#ff6f6f',
  },
}

const PIECE_KEYS = Object.keys(TETROMINOS) as PieceKey[]

function getRandomPieceKey(): PieceKey {
  return PIECE_KEYS[Math.floor(Math.random() * PIECE_KEYS.length)]
}

function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(null))
}

function rotateClockwise(shape: number[][]): number[][] {
  return shape[0].map((_, index) => shape.map((row) => row[index]).reverse())
}

function createPiece(key: PieceKey): Piece {
  const { shape, color } = TETROMINOS[key]
  return {
    key,
    shape,
    color,
    x: Math.floor(BOARD_COLS / 2) - Math.ceil(shape[0].length / 2),
    y: -1,
  }
}

function collides(board: Board, piece: Piece): boolean {
  for (let y = 0; y < piece.shape.length; y += 1) {
    for (let x = 0; x < piece.shape[y].length; x += 1) {
      if (!piece.shape[y][x]) {
        continue
      }
      const nextX = piece.x + x
      const nextY = piece.y + y
      if (nextX < 0 || nextX >= BOARD_COLS || nextY >= BOARD_ROWS) {
        return true
      }
      if (nextY >= 0 && board[nextY][nextX]) {
        return true
      }
    }
  }
  return false
}

function mergePiece(board: Board, piece: Piece): Board {
  const merged = board.map((row) => [...row])
  for (let y = 0; y < piece.shape.length; y += 1) {
    for (let x = 0; x < piece.shape[y].length; x += 1) {
      if (!piece.shape[y][x]) {
        continue
      }
      const boardX = piece.x + x
      const boardY = piece.y + y
      if (boardY >= 0 && boardY < BOARD_ROWS && boardX >= 0 && boardX < BOARD_COLS) {
        merged[boardY][boardX] = piece.color
      }
    }
  }
  return merged
}

function clearFullLines(board: Board): { board: Board; cleared: number } {
  const keptRows = board.filter((row) => row.some((cell) => cell === null))
  const cleared = BOARD_ROWS - keptRows.length
  const padding = Array.from({ length: cleared }, () => Array(BOARD_COLS).fill(null))
  return {
    board: [...padding, ...keptRows],
    cleared,
  }
}

function scoreForCleared(lines: number, level: number): number {
  const table = [0, 100, 300, 500, 800]
  return table[lines] * level
}

function lockPiece(prev: GameState, piece: Piece, extraScore = 0): GameState {
  const merged = mergePiece(prev.board, piece)
  const { board: clearedBoard, cleared } = clearFullLines(merged)
  const nextLines = prev.lines + cleared
  const nextLevel = Math.floor(nextLines / 10) + 1
  const nextPiece = createPiece(prev.next)
  const nextPieceKey = getRandomPieceKey()
  const isGameOver = collides(clearedBoard, nextPiece)

  return {
    ...prev,
    board: clearedBoard,
    active: nextPiece,
    next: nextPieceKey,
    score: prev.score + scoreForCleared(cleared, prev.level) + extraScore,
    lines: nextLines,
    level: nextLevel,
    status: isGameOver ? 'over' : prev.status,
  }
}

function getInitialGameState(): GameState {
  const first = getRandomPieceKey()
  const next = getRandomPieceKey()
  return {
    board: createEmptyBoard(),
    active: createPiece(first),
    next,
    status: 'idle',
    score: 0,
    level: 1,
    lines: 0,
  }
}

function getTickSpeed(level: number): number {
  return Math.max(120, 900 - (level - 1) * 80)
}

function App() {
  const [game, setGame] = useState<GameState>(() => getInitialGameState())

  const displayBoard = useMemo(() => {
    const frame = game.board.map((row) => [...row])
    const { active } = game
    for (let y = 0; y < active.shape.length; y += 1) {
      for (let x = 0; x < active.shape[y].length; x += 1) {
        if (!active.shape[y][x]) {
          continue
        }
        const boardX = active.x + x
        const boardY = active.y + y
        if (
          boardY >= 0 &&
          boardY < BOARD_ROWS &&
          boardX >= 0 &&
          boardX < BOARD_COLS
        ) {
          frame[boardY][boardX] = active.color
        }
      }
    }
    return frame
  }, [game.active, game.board])

  const nextPreview = useMemo(() => {
    const matrix = Array.from({ length: PREVIEW_SIZE }, () =>
      Array(PREVIEW_SIZE).fill(null as Cell),
    )
    const nextPiece = TETROMINOS[game.next]
    const offsetX = Math.floor((PREVIEW_SIZE - nextPiece.shape[0].length) / 2)
    const offsetY = Math.floor((PREVIEW_SIZE - nextPiece.shape.length) / 2)

    nextPiece.shape.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell) {
          matrix[offsetY + rowIndex][offsetX + cellIndex] = nextPiece.color
        }
      })
    })

    return matrix
  }, [game.next])

  const startGame = () => {
    setGame((prev) => {
      if (prev.status === 'paused') {
        return { ...prev, status: 'running' }
      }
      const fresh = getInitialGameState()
      return { ...fresh, status: 'running' }
    })
  }

  const pauseGame = () => {
    setGame((prev) => (prev.status === 'running' ? { ...prev, status: 'paused' } : prev))
  }

  const restartGame = () => {
    setGame({ ...getInitialGameState(), status: 'running' })
  }

  useEffect(() => {
    if (game.status !== 'running') {
      return
    }

    const timer = window.setInterval(() => {
      setGame((prev) => {
        if (prev.status !== 'running') {
          return prev
        }
        const moved: Piece = { ...prev.active, y: prev.active.y + 1 }
        if (!collides(prev.board, moved)) {
          return { ...prev, active: moved }
        }
        return lockPiece(prev, prev.active)
      })
    }, getTickSpeed(game.level))

    return () => {
      window.clearInterval(timer)
    }
  }, [game.level, game.status])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key
      if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' ', 'Spacebar'].includes(key)) {
        event.preventDefault()
      }

      if ((key === 'Enter' || key === 'N') && game.status !== 'running') {
        startGame()
        return
      }
      if ((key === 'p' || key === 'P') && game.status === 'running') {
        pauseGame()
        return
      }
      if ((key === 'p' || key === 'P') && game.status === 'paused') {
        startGame()
        return
      }

      if (game.status !== 'running') {
        return
      }

      setGame((prev) => {
        if (prev.status !== 'running') {
          return prev
        }

        if (key === 'ArrowLeft') {
          const moved = { ...prev.active, x: prev.active.x - 1 }
          return collides(prev.board, moved) ? prev : { ...prev, active: moved }
        }

        if (key === 'ArrowRight') {
          const moved = { ...prev.active, x: prev.active.x + 1 }
          return collides(prev.board, moved) ? prev : { ...prev, active: moved }
        }

        if (key === 'ArrowDown') {
          const moved = { ...prev.active, y: prev.active.y + 1 }
          if (collides(prev.board, moved)) {
            return lockPiece(prev, prev.active)
          }
          return { ...prev, active: moved, score: prev.score + 1 }
        }

        if (key === 'ArrowUp' || key === 'x' || key === 'X') {
          const rotatedShape = rotateClockwise(prev.active.shape)
          const kicks = [0, -1, 1, -2, 2]
          for (const kick of kicks) {
            const rotatedPiece: Piece = {
              ...prev.active,
              x: prev.active.x + kick,
              shape: rotatedShape,
            }
            if (!collides(prev.board, rotatedPiece)) {
              return { ...prev, active: rotatedPiece }
            }
          }
          return prev
        }

        if (key === ' ' || key === 'Spacebar') {
          let dropped = { ...prev.active }
          let steps = 0
          while (!collides(prev.board, { ...dropped, y: dropped.y + 1 })) {
            dropped = { ...dropped, y: dropped.y + 1 }
            steps += 1
          }
          return lockPiece(prev, dropped, steps * 2)
        }

        return prev
      })
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [game.status])

  const statusText =
    game.status === 'idle'
      ? '待机中，点击开始进入游戏'
      : game.status === 'running'
        ? '进行中'
        : game.status === 'paused'
          ? '已暂停'
          : '游戏结束'

  return (
    <main className="app-shell">
      <section className="brand-panel glass-card">
        <p className="badge">Ralph Arcade Studio</p>
        <h1>俄罗斯方块 Tetris</h1>
        <p className="brand-copy">
          一个可上线的 Web 版本：完整玩法、完整键盘交互、响应式界面与清晰状态反馈。
        </p>
        <div className="action-row">
          <button onClick={startGame} disabled={game.status === 'running'}>
            开始
          </button>
          <button onClick={pauseGame} disabled={game.status !== 'running'}>
            暂停
          </button>
          <button onClick={startGame} disabled={game.status !== 'paused'}>
            继续
          </button>
          <button onClick={restartGame}>重开</button>
        </div>
        <p className="game-status">状态：{statusText}</p>
      </section>

      <section className="playground">
        <div className="board-wrap glass-card" role="img" aria-label="Tetris board">
          <div className="board-grid">
            {displayBoard.map((row, rowIndex) =>
              row.map((cell, cellIndex) => (
                <span
                  key={`${rowIndex}-${cellIndex}`}
                  className={`cell ${cell ? 'filled' : ''}`}
                  style={cell ? ({ '--cell-color': cell } as CSSProperties) : undefined}
                />
              )),
            )}
          </div>
        </div>

        <aside className="side-panel">
          <div className="glass-card stat-grid">
            <article>
              <p className="label">score</p>
              <strong>{game.score}</strong>
            </article>
            <article>
              <p className="label">level</p>
              <strong>{game.level}</strong>
            </article>
            <article>
              <p className="label">lines</p>
              <strong>{game.lines}</strong>
            </article>
          </div>

          <div className="glass-card next-card">
            <p className="label">next</p>
            <div className="preview-grid">
              {nextPreview.map((row, rowIndex) =>
                row.map((cell, cellIndex) => (
                  <span
                    key={`preview-${rowIndex}-${cellIndex}`}
                    className={`cell preview ${cell ? 'filled' : ''}`}
                    style={cell ? ({ '--cell-color': cell } as CSSProperties) : undefined}
                  />
                )),
              )}
            </div>
          </div>

          <div className="glass-card guide-card">
            <h2>操作说明</h2>
            <ul>
              <li>← / →：左右移动</li>
              <li>↑ 或 X：旋转方块</li>
              <li>↓：软降（加速下落）</li>
              <li>Space：硬降到底</li>
              <li>P：暂停 / 继续</li>
              <li>Enter：开始新局</li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  )
}

export default App
