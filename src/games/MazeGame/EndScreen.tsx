export default function EndScreen({ stats, onRestart }: { stats: any, onRestart: () => void }) {
  return (
    <div style={{ padding: 16, color: '#fff' }}>
      <h3>{stats?.won ? 'You Win!' : 'Game Over'}</h3>
      <pre style={{ color: '#ddd' }}>{JSON.stringify(stats, null, 2)}</pre>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onRestart}>Back</button>
      </div>
    </div>
  )
}
