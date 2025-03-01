import TextPressure from '../../blocks/TextAnimations/TextPressure/TextPressure';
import MetaBalls from '../../blocks/Animations/MetaBalls/MetaBalls';
import Waves from '../../blocks/Backgrounds/Waves/Waves';
import Squares from '../../blocks/Backgrounds/Squares/Squares';

const Hero = () => {
    return <section className='flex flex-col justify-center items-center w-screen h-screen'> <div className=''> 
    <TextPressure
    text="AInstein"
    flex={false}
    alpha={false}
    stroke={false}
    width={true}
    weight={false}
    italic={false}
    textColor="#000000"
    strokeColor="#ff0000"
    minFontSize={100}
  /></div>
  <div className='grid grid-cols-3 gap-4'>
    <div className='relative aspect-square border-4 border-white rounded-full hover:scale-90 group transition-all duration-300'>
      <div className='absolute w-full h-full bg-black/50 font-bold text-2xl z-10 rounded-full flex justify-center items-center group-hover:opacity-100 opacity-0 transition-all duration-300'><p>Chatbot</p></div>
    <MetaBalls
  color="#ffffff"
  cursorBallColor="#ffffff"
  cursorBallSize={2}
  ballCount={15}
  animationSize={30}
  enableMouseInteraction={true}
  enableTransparency={true}
  hoverSmoothness={0.05}
  clumpFactor={1}
  speed={0.3}
/></div>
<div className='relative aspect-square border-4 border-white rounded-4xl overflow-hidden hover:scale-90 group transition-all duration-300'>
  <div className='absolute w-full h-full bg-black/50 font-bold text-2xl z-10 rounded-4xl flex justify-center items-center group-hover:opacity-100 opacity-0 transition-all duration-300'><p>Flashcards</p></div>
<Waves
  lineColor="#fff"
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
/></div>
<div className='relative aspect-square border-4 border-white rounded-full overflow-hidden hover:scale-90 group transition-all duration-300'>
  <div className='absolute w-full h-full bg-black/50 font-bold text-2xl z-10 flex rounded-full justify-center items-center group-hover:opacity-100 opacity-0 transition-all duration-300'><p>Videos</p></div>
<Squares 
speed={0.1} 
squareSize={40}
direction='right' // up, down, left, right, diagonal
borderColor='#fff'
hoverFillColor='#222'
/></div> </div> </section>
}


export default Hero;