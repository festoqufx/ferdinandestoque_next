import { NextResponse } from 'next/server'

const GH_USERNAME = 'festoqufx'

export async function GET() {
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${GH_USERNAME}?y=last`, {
      next: { revalidate: 1800 },
    })

    if (res.ok) {
      const data = await res.json()
      return NextResponse.json(data)
    }

    return NextResponse.json({
      total: { lastYear: 0 },
      contributions: [],
      username: GH_USERNAME,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Unable to load GitHub contributions' },
      { status: 500 }
    )
  }
}