import React, { useState } from 'react'
import './Stylesheets/Drawbar.css'
import Draggable from 'react-draggable'

export default function Drawbar(props) {
  const valueArr = [8, 7, 6, 5, 4, 3, 2, 1]
  let value = 8
  const [position, setPosition] = useState({x: 0, y: 0})

  const trackPos = (data) => {
    setPosition({ x: data.x, y: data.y })
    value = ((position.y + 200) / 25).toFixed(0)
    if (value != (props.value01 / 0.125)) {
      props.changeFunction(value * 0.125)
    }
  }

  return (
    <div className='DrawbarContainer'>
      <Draggable handle='#handle' bounds={{top: -200, bottom: 0}} axis="y"
      onDrag={(e, data) => trackPos(data)}>
        <div className='Container'>
          <div className='Range'>{
            valueArr.map((value, index) => {
              return (
                <p className='RangeValue' key={index}>{value}</p>
              )
            })
          }</div>
          <div id='handle' className='Knob'>
            <div style={{backgroundColor: props.light}} className='KnobTop' />
            <div style={{backgroundColor: props.dark}} className='KnobBottom' />
          </div>
        </div>
      </Draggable>
      <p className='Indicator'>{props.name}</p>
    </div>
  )
}