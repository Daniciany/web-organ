import React, { useState } from 'react'
import './Stylesheets/About.css'

import jsLogo from './assets/js-logo.png'
import htmlLogo from './assets/html-logo.png'
import cssLogo from './assets/css-logo.png'
import reactLogo from './assets/react-logo.png'

export default function About() {
  const [animationValue, setAnimationValue] = useState(-1)

  const setNewAniValue = () => {
    if (animationValue === 1) {
      setAnimationValue(0)
      return
    } 
    setAnimationValue(1)
  }

  return (
    <div animationValue={animationValue} className='About'>
      <button onClick={setNewAniValue} className='ShowAbout'>
        <div animationValue={animationValue} className='Arrow' />
      </button>

      <div className='Content'>
        <h2 className='Headline'>About WebOrgan</h2>

        <p>
          Though WebOrgan doesn't exactly replicate a hammond, it is strongly oriented towards a B-3.
        </p>

        <br></br>
        <p>It features the iconic drawbars just as every real electric organ does.</p>

        <br></br>
        <p>In addition to that the organ also provides the iconic 6-Setting Vibrato Chorus dial. Toggle it just below the power button!</p>

        <br></br>
        <p>Not visible, but a very important feature is <p className='Underline'>Harmonic Foldback</p> working in the background.</p>

        <br></br>
        <p>Therefore it is obvious, that the tone generators of webOrgan and a B3 both feature exactly 109 different frequencies.</p>

        <h2 style={{marginBottom: 0}}>Tech Stack: </h2>
        <div className='TechContainer'>
          <div>
            <img alt='js' className='TechImage' src={jsLogo} />  
            <p>ES6</p>
          </div>
          <div>
            <img alt='html' className='TechImage' src={htmlLogo} />
            <p>HTML5</p>
          </div>
          <div>
            <img alt='css' className='TechImage' src={cssLogo} />
            <p>CSS3</p>
          </div>
          <div>
            <img alt='react' className='TechImage' src={reactLogo} />
            <p>React.js</p>
          </div>
        </div>
      </div>
    </div>
  )
}