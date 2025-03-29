import LiquidChrome from '@/blocks/Backgrounds/LiquidChrome/LiquidChrome';
import Iridescence from '@/blocks/Backgrounds/Iridescence/Iridescence';
import Balatro from '@/blocks/Backgrounds/Balatro/Balatro';
import Dither from '@/blocks/Backgrounds/Dither/Dither';
import Threads from '@/blocks/Backgrounds/Threads/Threads';
import LetterGlitch from '@/blocks/Backgrounds/LetterGlitch/LetterGlitch';
import Particles from '@/blocks/Backgrounds/Particles/Particles';
import Waves from '@/blocks/Backgrounds/Waves/Waves';

export default function Backgrounds({
  colorTheme, type, small = true
}: { colorTheme: { hex: string; rgb: number[] }, type:string, small?: boolean }) {
  function getBackground(type: string) {
    switch (type) {
      case 'LiquidChrome':
        return <LiquidChrome
          baseColor={
            colorTheme?.rgb.map((num) => num / 255)! as [number, number, number]
          }
          speed={0.5}
          amplitude={0.6}
          interactive={true}
        />;
      case 'Iridescence':
        return <Iridescence
          color={
            colorTheme?.rgb.map((num) => num / 255)! as [number, number, number]
          }
          mouseReact={false}
          amplitude={0.1}
          speed={1.0}
        />;
      case 'Balatro':
        return <Balatro
          isRotate={false}
          mouseInteraction={true}
          pixelFilter={700}
          color1={colorTheme?.rgb[0].toString()}
          color2={colorTheme?.rgb[1].toString()}
          color3={colorTheme?.rgb[2].toString()}
        />;
      // case 'Dither':
      //   return <Dither
      //     waveColor={[0.5, 0.5, 0.5]}
      //     disableAnimation={false}
      //     enableMouseInteraction={true}
      //     mouseRadius={0.3}
      //     colorNum={4}
      //     waveAmplitude={0.3}
      //     waveFrequency={3}
      //     waveSpeed={0.05}
      //   />;
      case 'Threads':
        return <Threads amplitude={2} distance={0} enableMouseInteraction={true} color={
          colorTheme?.rgb.map((num) => num / 255)! as [number, number, number]
        }/>;
      case 'LetterGlitch':
        return <LetterGlitch
          glitchColors={[colorTheme.hex]}
          glitchSpeed={50}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
        />;
      case 'Particles':
        return <Particles
          particleColors={[colorTheme?.hex!]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={1000}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />;
      case 'Waves':
        return <Waves
          lineColor={colorTheme?.hex}
          backgroundColor="rgba(255, 255, 255, 0.2)"
          waveSpeedX={0.02}
          waveSpeedY={0.01}
          waveAmpX={40}
          waveAmpY={20}
          friction={0.9}
          tension={0.01}
          maxCursorMove={120}
          xGap={12}
          yGap={36}
        />;
      default:
        return <LiquidChrome
          baseColor={
            colorTheme?.rgb.map((num) => num / 255)! as [number, number, number]
          }
          speed={0.5}
          amplitude={0.6}
          interactive={true}
        />;
    }
  }
  return (
    <div
      style={{
        width: '100%',
        height: small ? ['LiquidChrome','Balatro','Dither'].includes(type) ? '600px' : '200px' : '600px',
        position: 'relative',
        objectPosition: 'center',
      }}
    >
      {getBackground(type)}
    </div>
  );
}
