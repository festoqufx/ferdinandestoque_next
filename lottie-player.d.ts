declare namespace JSX {
  interface IntrinsicElements {
    'lottie-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      autoPlay?: boolean
      loop?: boolean
      mode?: string
      background?: string
      src?: string
      controls?: boolean
      hover?: boolean
      speed?: number
      direction?: number
      renderer?: 'svg' | 'canvas' | 'html'
      preserveAspectRatio?: string
    }
  }
}
