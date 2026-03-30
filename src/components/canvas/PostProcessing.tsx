import { EffectComposer, Bloom, SSAO, ToneMapping } from '@react-three/postprocessing'
import { BlendFunction, ToneMappingMode } from 'postprocessing'
import { useRenderStore } from '@/store'

function SSAOEffect({ intensity }: { intensity: number }) {
  return (
    <SSAO
      blendFunction={BlendFunction.MULTIPLY}
      samples={31}
      radius={0.5}
      intensity={intensity}
      luminanceInfluence={0.5}
      bias={0.025}
    />
  )
}

function BloomEffect({ intensity, threshold }: { intensity: number; threshold: number }) {
  return (
    <Bloom
      intensity={intensity}
      luminanceThreshold={threshold}
      luminanceSmoothing={0.025}
      mipmapBlur
    />
  )
}

function ToneMappingEffect() {
  return (
    <ToneMapping
      mode={ToneMappingMode.AGX}
      resolution={256}
      whitePoint={4.0}
      middleGrey={0.6}
      minLuminance={0.01}
      averageLuminance={1.0}
      adaptationRate={1.0}
    />
  )
}

export default function PostProcessing() {
  const { config } = useRenderStore()

  // Skip post-processing if nothing is enabled
  if (!config.toneMapping && !config.ssao && !config.bloom) {
    return null
  }

  // Build effects array based on config
  const effects = []
  if (config.ssao) {
    effects.push(<SSAOEffect key="ssao" intensity={config.ssaoIntensity} />)
  }
  if (config.bloom) {
    effects.push(
      <BloomEffect key="bloom" intensity={config.bloomIntensity} threshold={config.bloomThreshold} />
    )
  }
  if (config.toneMapping) {
    effects.push(<ToneMappingEffect key="tone" />)
  }

  return <EffectComposer multisampling={4}>{effects}</EffectComposer>
}
