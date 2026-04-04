'use client'

import { useEffect, useRef, useState } from 'react'

type SolaceShaderBgProps = {
  enabled?: boolean
}

const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const FRAGMENT_SHADER = `
precision highp float;

varying vec2 v_uv;
uniform vec2 u_resolution;
uniform float u_time;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 3; i++) {
    value += amp * noise(p);
    p = p * 2.02 + vec2(13.5, 9.2);
    amp *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = v_uv;
  vec2 st = uv - 0.5;
  st.x *= u_resolution.x / u_resolution.y;

  float t = u_time * 0.025;

  vec2 flow = vec2(
    fbm(st * 0.55 + vec2(t * 0.12, -t * 0.08)),
    fbm(st * 0.50 + vec2(-t * 0.07, t * 0.10))
  );

  float n1 = fbm(st * 0.62 + flow * 0.16 + vec2(0.0, t * 0.03));
  float n2 = fbm(st * 0.48 + flow.yx * 0.14 + vec2(-t * 0.02, t * 0.015));
  float depthNoise = fbm(st * 0.22 + vec2(t * 0.006, -t * 0.004));

  float indigoField = smoothstep(0.28, 0.78, n1 * 0.62 + n2 * 0.38);
  float blueField = smoothstep(0.24, 0.82, n2);
  float tealField = smoothstep(0.52, 0.90, n1);
  float warmField = smoothstep(0.74, 0.98, n1 * n2);

  vec3 base = vec3(0.027, 0.043, 0.071);
  vec3 indigo = vec3(0.104, 0.138, 0.278);
  vec3 blueIndigo = vec3(0.082, 0.118, 0.226);
  vec3 teal = vec3(0.048, 0.116, 0.124);
  vec3 warm = vec3(0.122, 0.095, 0.080);

  vec3 color = base;
  color = mix(color, indigo, 0.18 * indigoField);
  color = mix(color, blueIndigo, 0.12 * blueField);
  color = mix(color, teal, 0.05 * tealField);
  color = mix(color, warm, 0.015 * warmField);

  float depthField = smoothstep(0.20, 0.82, depthNoise);
  color *= 0.99 + 0.02 * depthField;

  float vignette = smoothstep(1.18, 0.30, length(st));
  color *= 0.88 + 0.12 * vignette;

  float dither = (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  color += vec3(dither);

  gl_FragColor = vec4(color, 1.0);
}
`

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null

  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }

  return shader
}

function createProgram(gl: WebGLRenderingContext): WebGLProgram | null {
  const vertex = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
  const fragment = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
  if (!vertex || !fragment) {
    if (vertex) gl.deleteShader(vertex)
    if (fragment) gl.deleteShader(fragment)
    return null
  }

  const program = gl.createProgram()
  if (!program) {
    gl.deleteShader(vertex)
    gl.deleteShader(fragment)
    return null
  }

  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)

  gl.deleteShader(vertex)
  gl.deleteShader(fragment)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program)
    return null
  }

  return program
}

export function SolaceShaderBg({ enabled = false }: SolaceShaderBgProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const [shaderActive, setShaderActive] = useState(false)

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      setShaderActive(false)
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShaderActive(false)
      return
    }

    const canvas = canvasRef.current
    if (!canvas) {
      setShaderActive(false)
      return
    }

    const gl =
      canvas.getContext('webgl', {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        preserveDrawingBuffer: false,
        premultipliedAlpha: false,
      }) || canvas.getContext('experimental-webgl')

    if (!gl) {
      setShaderActive(false)
      return
    }

    const webgl = gl as WebGLRenderingContext
    const program = createProgram(webgl)
    if (!program) {
      setShaderActive(false)
      return
    }

    const positionLocation = webgl.getAttribLocation(program, 'a_position')
    const resolutionLocation = webgl.getUniformLocation(program, 'u_resolution')
    const timeLocation = webgl.getUniformLocation(program, 'u_time')

    const positionBuffer = webgl.createBuffer()
    if (!positionBuffer || positionLocation < 0 || !resolutionLocation || !timeLocation) {
      if (positionBuffer) webgl.deleteBuffer(positionBuffer)
      webgl.deleteProgram(program)
      setShaderActive(false)
      return
    }

    webgl.bindBuffer(webgl.ARRAY_BUFFER, positionBuffer)
    webgl.bufferData(
      webgl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      webgl.STATIC_DRAW,
    )

    webgl.useProgram(program)
    webgl.enableVertexAttribArray(positionLocation)
    webgl.vertexAttribPointer(positionLocation, 2, webgl.FLOAT, false, 0, 0)
    webgl.clearColor(0.027, 0.043, 0.071, 1)

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const width = Math.floor(window.innerWidth)
      const height = Math.floor(window.innerHeight)

      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      webgl.viewport(0, 0, canvas.width, canvas.height)
      webgl.uniform2f(resolutionLocation, width, height)
    }

    const start = performance.now()

    const render = () => {
      const elapsed = (performance.now() - start) / 1000
      webgl.uniform1f(timeLocation, elapsed)
      webgl.clear(webgl.COLOR_BUFFER_BIT)
      webgl.drawArrays(webgl.TRIANGLE_STRIP, 0, 4)
      rafRef.current = window.requestAnimationFrame(render)
    }

    resize()
    setShaderActive(true)
    render()
    window.addEventListener('resize', resize)

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      window.removeEventListener('resize', resize)
      webgl.deleteBuffer(positionBuffer)
      webgl.deleteProgram(program)
      setShaderActive(false)
    }
  }, [enabled])

  return (
    <div
      aria-hidden="true"
      className="solace-shader-bg pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div
        className="solace-shader-fallback"
        style={{
          position: 'absolute',
          inset: 0,
          background: '#070b12',
        }}
      />
      {enabled ? (
        <canvas
          ref={canvasRef}
          className="pointer-events-none fixed inset-0 h-screen w-screen"
          style={{ opacity: shaderActive ? 1 : 0 }}
        />
      ) : null}
    </div>
  )
}
