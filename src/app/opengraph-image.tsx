import { ImageResponse } from 'next/og'

export const runtime = 'edge'

// Image metadata
export const alt = 'Best Universal Solutions'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#011627',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}>
        <h1 style={{ fontSize: 42, color: '#18f2e5', margin: 0 }}>
          Best Universal Solutions
        </h1>
        <h2 style={{ fontSize: 32, color: 'white', marginTop: 30, textAlign: 'center' }}>
          Leading Software Development & IT Consulting Agency
        </h2>
        <p style={{ fontSize: 24, color: '#607b96', marginTop: 20 }}>
          Innovative Tech Solutions for Your Business
        </p>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    },
  )
}
