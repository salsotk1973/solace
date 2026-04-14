import { ImageResponse } from 'next/og'

export const size        = { width: 192, height: 192 }
export const contentType = 'image/png'

export default function Icon() {
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
          borderRadius:   '38px',
        }}
      >
        <span
          style={{
            color:      '#ffffff',
            fontSize:   140,
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
