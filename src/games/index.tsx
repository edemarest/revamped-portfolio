import MazeGame from './MazeGame/MazeGame'

const Preview = () => <div style={{ width: 160, height: 160, background: '#0f1724', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>Maze</div>

const games = [
  {
    id: 'maze',
    title: 'MazeGame',
    componentPreview: Preview,
    open: undefined,
    component: MazeGame,
  },
]

export default games
