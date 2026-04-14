import { ImageResponse } from 'next/og'

export const size        = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width:          '100%',
          height:         '100%',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          background:     '#090d14',
          borderRadius:   '36px',
        }}
      >
        <span
          style={{
            color:      '#ffffff',
            fontSize:   130,
            fontWeight: 300,
            fontFamily: 'Georgia, serif',
            lineHeight: 1,
            marginTop:  12,
          }}
        >
          S
        </span>
      </div>
    ),
    { ...size },
  )
}
