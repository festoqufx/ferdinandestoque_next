import { NextResponse } from 'next/server'

let sessions: Record<string, { t: number; name: string }> = {}
const PRESENCE_TTL = 25000 // 25s

const names = [
  'Ava', 'Mia', 'Leo', 'Kai', 'Noa', 'Eli', 'Zoe', 'Ian', 'Liv', 'Max',
  'Aria', 'Cole', 'Eden', 'Jade', 'Remy', 'Sage', 'Quinn', 'Nico', 'Wren', 'Lux',
]

function getPresenceName(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i)
    hash |= 0
  }
  const index = Math.abs(hash) % names.length
  return names[index]
}

function pruneSessions() {
  const now = Date.now()
  for (const [id, session] of Object.entries(sessions)) {
    if (now - session.t > PRESENCE_TTL) {
      delete sessions[id]
    }
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('sessionId')

  pruneSessions()

  if (sessionId) {
    sessions[sessionId] = {
      t: Date.now(),
      name: getPresenceName(sessionId),
    }
  }

  const avatars = Object.values(sessions).map((s) => s.name)
  const count = Math.max(1, Object.keys(sessions).length)

  return NextResponse.json({
    type: 'presence',
    count,
    viewers: count,
    avatars: avatars.slice(0, 8),
  })
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('sessionId')
  const leave = searchParams.get('leave')

  if (leave && sessionId) {
    delete sessions[sessionId]
  }

  pruneSessions()

  const count = Math.max(1, Object.keys(sessions).length)
  return NextResponse.json({
    type: 'presence',
    count,
    viewers: count,
  })
}