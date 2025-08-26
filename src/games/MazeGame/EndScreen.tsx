export default function EndScreen({ stats, onRestart }: { stats: any, onRestart: () => void }) {
  return (
    <div style={{ padding: 16, color: '#fff' }}>
      <h3>Result</h3>
      <div>Won: {String(!!stats?.won)}</div>
      <div>Time: {Math.round((stats?.timeMs ?? 0) / 1000)}s</div>
      <div>Moves: {stats?.moves ?? 0}</div>
      <div style={{ marginTop: 12 }}>
        <button onClick={onRestart} style={{ padding: '8px 12px', borderRadius: 8 }}>Play again</button>
      </div>
    </div>
  )
}
