import React, { useState } from 'react'
import './Stylesheets/VibChoSelector.css'
import MyKnobSkin from './MyKnobSkin'

export default function VibChoSelector({onChange, value}) {
  const settingArr = ["V-1", "C-1", "V-2", "C-2", "V-3", "C-3"]

  return (
    <div className='Container'>
      <div className='Backplate'>
        {
          settingArr.map((setting, index) => {
            return (
              <button className='Button' onClick={() => onChange(index + 1)} key={index}>
                {setting}
              </button>
            )
          })
        }
        <MyKnobSkin
            diameter={100}
            min={1}
            max={6}
            step={1}
            value={value}
            onValueChange={onChange}
            theme={{
                activeColor: 'red',
                defaultColor: 'black'
            }}
        >
        </MyKnobSkin>
        {/* <div style={{rotate: `${(value * 60) - 120}deg`}} className='Circle'>
          <div className='Pointer' />
          <div className='Name'>
            <p>VIBRATO</p>
            <p>AND</p>
            <p>CHORUS</p>
          </div>
        </div> */}
      </div>
    </div>
  )
}