import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'Tính năng AI dịch không khả dụng.' },
    { status: 503 }
  )
}
