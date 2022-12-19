import React, { useState, useEffect, useRef, useCallback } from 'react'
import './Stylesheets/App.css'

import Drawbar from './Drawbar'
import VibChoSelector from './VibChoSelector'
import About from './About'

const brown = {light: '#440e0e', dark: '#300b0b'}
const white = {light: '#c6c6c6', dark: '#b5b5b5'}
const black = {light: '#252525', dark: '#151515'}

let context, masterGain
let gain16, gain513, gain8, gain4, gain223, gain2, gain135, gain113, gain1
let gainArr = [] 

// todo:
/*
    for vibrato and Chorus
    vibrato: vibrato Osc's so laut wie andere Osc's, je nach Abweichung langsam, oder schnell
    chorus: vibrato Osc's halb so laut wie andere Osc's, je nach Abweichung langsam, oder schnell
    V1: speed: 5.78Hz, mix: 100% Vol
    C1: speed: 5.78Hz, mix: 50% Vol
    V2: speed: 6.84Hz, mix: 100% Vol
    C2: speed: 6.84Hz, mix: 50% Vol
    V3: speed: 7.90Hz, mix: 100% Vol
    C3: speed: 7.90Hz, mix: 50% Vol
*/

export default function App() {
    const [turnedOn, setTurnedOn] = useState(false)
    const turnedOnRef = useRef(turnedOn)

    const [toggleVibCho, setToggleVibCho] = useState(false)
    const toggleVibChoRef = useRef(toggleVibCho)
    const [vibSetting, setVibSetting] = useState(1)
    const vibSettingRef = useRef(vibSetting)

    const [gain, setGain] = useState(0.1)
    const gainRef = useRef(gain)

    const [gain16Vol, setGain16Vol] = useState(1)
    const gain16Ref = useRef(gain16Vol)
    const [gain513Vol, setGain513Vol] = useState(1)
    const gain513Ref = useRef(gain513Vol)
    const [gain8Vol, setGain8Vol] = useState(1)
    const gain8Ref = useRef(gain8Vol)
    const [gain4Vol, setGain4Vol] = useState(1)
    const gain4Ref = useRef(gain4Vol)
    const [gain223Vol, setGain223Vol] = useState(1)
    const gain223Ref = useRef(gain223Vol)
    const [gain2Vol, setGain2Vol] = useState(1)
    const gain2Ref = useRef(gain2Vol)
    const [gain135Vol, setGain135Vol] = useState(1)
    const gain135Ref = useRef(gain135Vol)
    const [gain113Vol, setGain113Vol] = useState(1)
    const gain113Ref = useRef(gain113Vol)
    const [gain1Vol, setGain1Vol] = useState(1)
    const gain1Ref = useRef(gain1Vol)

    const [devices, setDevices] = useState([])
    let oscillators = []

    function start() {
        if (!turnedOn) {
            setTurnedOn(true)
            turnedOnRef.current = true
        }
        context = new AudioContext()
        masterGain = context.createGain()

        // create gain Nodes for the overtones: 
        gain16 = context.createGain()
        gain513 = context.createGain()
        gain8 = context.createGain()
        gain4 = context.createGain()
        gain223 = context.createGain()
        gain2 = context.createGain()
        gain135 = context.createGain()
        gain113 = context.createGain()
        gain1 = context.createGain()

        //connect gain Nodes for overtones:
        gain16.connect(masterGain)
        gain513.connect(masterGain)
        gain8.connect(masterGain)
        gain4.connect(masterGain)
        gain223.connect(masterGain)
        gain2.connect(masterGain)
        gain135.connect(masterGain)
        gain113.connect(masterGain)
        gain1.connect(masterGain)

        masterGain.connect(context.destination)
        masterGain.gain.value = 0.1
        
        gainArr = [gain16, gain513, gain8, gain4, gain223, gain2, gain135, gain113, gain1]

        /*
        const initalGains = [0.875, 1, 0.75, 0.75, 0, 0, 0, 0, 0]
        for (let i = 0; i < initalGains.length; i++) {
            gainArr[i].gain.value = initalGains[i]
        }
        */
        // console.log("audio Context and gainNodes created")
    }

    useEffect(() => {
        requestMidi()
    }, [])

    function requestMidi() {
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess().then(success, failure)
        }
    }
    
    function success(midiAccess) {
        midiAccess.addEventListener('statechange', updateDevices)
    
        const inputs = midiAccess.inputs
    
        inputs.forEach((input) => {
            input.addEventListener('midimessage', handleInput)
        })
    }
    
    function handleInput(input) {
        const command = input.data[0]
        const note = input.data[1]
        const velocity = input.data[2]
    
        switch (command) {
            case 144:
                if (velocity > 0) {
                    noteOn(note, velocity)
                } else {
                    noteOff(note)
                }
                break
            case 128:
                noteOff(note)
                break
        }
    }
    
    function noteOn(note, velocity) {
        // if Organ not started, return out tell user to turn on the organ
        if (!turnedOnRef.current) return 

        function callPlayNote(note, midiNote, velocity, gainNode, freq) {
            playNote(note, midiNote, velocity, gainNode, freq, 0.1)
            if (toggleVibChoRef.current) {
                let newFreq = 5.78
                let gainNodeVol = 0.1
                let lowGainNodeVol = 0.03
                switch (vibSettingRef.current) {
                    // case 1: V1
                    // case 2: C1
                    // case 3: V2
                    // case 4: C2
                    // case 5: V3
                    // case 6: C3
                    case 2:
                        gainNodeVol = lowGainNodeVol
                        break
                    case 3: 
                        newFreq = 6.84
                        break
                    case 4:
                        newFreq = 6.84
                        gainNodeVol = lowGainNodeVol
                        break
                    case 5:
                        newFreq = 7.90
                        break
                    case 6:
                        gainNodeVol = lowGainNodeVol
                        newFreq = 7.90
                        break
                }
                playNote(note, midiNote, velocity, gainNode, freq + newFreq, gainNodeVol)
            }
        }

        oscillators[note] = []
        const midiNotes = baseNoteToPoly(note)

        const midiNotesLength = midiNotes.length
        for (let i = 0; i < midiNotesLength; i++) {
            let midiNote = midiNotes[i]
            // harmonic Foldback
            // check if hammond B3 tone generator was able to create this frequency (midi: 24 - 114):
            if (midiNote < 24) {
                // out of range of tones from the B3 tone generator"
            } else {
                if (24 <= midiNote && midiNote <= 114) {
                    callPlayNote(note, midiNote, velocity, gainArr[i], midiToFrequency(midiNote))
                } else {
                    // Problem: Frequencies tauchen mehrfach im Object auf, daher jede Freq nur ein Mal
                    // => weniger Osc's im Object, trotzdem 9 Osc playing, bei noteOff klingen Osc's weiter
                    if (24 <= midiNote - 12 && midiNote - 12 <= 114) {
                        midiNote -= 12
                    } else if (24 <= midiNote - 24 && midiNote - 24 <= 114) {
                        midiNote -= 24
                    }
                    callPlayNote(note, midiNote, velocity, gainArr[i], midiToFrequency(midiNote))
                }
            }
        }
        // console.log(oscillators)
    }

    function baseNoteToPoly(baseNote) {
        return [baseNote - 12, baseNote + 7, baseNote, baseNote + 12, baseNote + 19, baseNote + 24, baseNote + 28, baseNote + 31, baseNote + 36]
    }

    function midiToFrequency(midiNumber) {
        // reference note A4 with 440Hz
        const a = 440
        return Math.round(((a / 32) * (2 ** ((midiNumber - 9) / 12)) + Number.EPSILON) * 100) / 100
    }

    function playNote(baseNote, midiNote, velocity, gainNode, freq, gainValue) {
        const osc = context.createOscillator()
        
        osc.frequency.value = freq
        
        const oscGain = context.createGain()
        oscGain.gain.value = gainValue
        
        osc.gain = oscGain
        
        osc.connect(oscGain)
        oscGain.connect(gainNode)
        osc.type = "sine"
        osc.start()
        oscillators[baseNote].push(osc)
    }
    
    function noteOff(note) {
        const activeOscillators = oscillators[note.toString()]
        
        const oscLength = activeOscillators.length
        for (let i = 0; i < oscLength; i++) {
            const osc = activeOscillators[i]
            osc.gain.gain.setTargetAtTime(0, context.currentTime, 0.015)

            setTimeout(() => {
                osc.stop()
            }, 50)
        }

        delete oscillators[note.toString()]
        // console.log(oscillators)
    }
    
    function updateDevices(event) {
        const device = `Name: ${event.port.name}, Brand: ${event.port.manufacturer}, State: ${event.port.state}, Type: ${event.port.type}`
        let devicesCopy = [...devices]
        devicesCopy.push(device)
        setDevices(devicesCopy)
    }
    
    function failure() {
        // console.log("could not connect MIDI")
    }

    function changeGain(gain) {
        setGain(gain)
        gainRef.current = gain
        masterGain.gain.value = gainRef.current
    }

    function changeGain16(gain) {
        setGain16Vol(gain)
        gain16Ref.current = gain
        gain16.gain.value = gain16Ref.current
    }
    
    function changeGain513(gain) {
        setGain513Vol(gain)
        gain513Ref.current = gain
        gain513.gain.value = gain513Ref.current
    }

    function changeGain8(gain) {
        setGain8Vol(gain)
        gain8Ref.current = gain
        gain8.gain.value = gain8Ref.current
    }

    function changeGain4(gain) {
        setGain4Vol(gain)
        gain4Ref.current = gain
        gain4.gain.value = gain4Ref.current
    }

    function changeGain223(gain) {
        setGain223Vol(gain)
        gain223Ref.current = gain
        gain223.gain.value = gain223Ref.current
    }

    function changeGain2(gain) {
        setGain2Vol(gain)
        gain2Ref.current = gain
        gain2.gain.value = gain2Ref.current
    }

    function changeGain135(gain) {
        setGain135Vol(gain)
        gain135Ref.current = gain
        gain135.gain.value = gain135Ref.current
    }

    function changeGain113(gain) {
        setGain113Vol(gain)
        gain113Ref.current = gain
        gain113.gain.value = gain113Ref.current
    }

    function changeGain1(gain) {
        setGain1Vol(gain)
        gain1Ref.current = gain
        gain1.gain.value = gain1Ref.current
    }

    function changeVibChoState() {
        if (toggleVibChoRef.current) {
            setToggleVibCho(false)
            toggleVibChoRef.current = false
            return 
        }
        setToggleVibCho(true)
        toggleVibChoRef.current = true
    }

    return (
        <div>
            <header className='Panel'>
                <div className='General'>
                    <p className='Title'>WebOrgan 2.0</p>
                    <button style={{
                        boxShadow: turnedOn ? '-1px 1px 2px 4px #fff' : null,
                        backgroundColor: turnedOn ? '#e9e9e9' : '#a5a5a5'
                    }} onClick={start}>Start</button>
                    <button style={{
                        boxShadow: toggleVibCho ? '-1px 1px 2px 4px #fff' : null,
                        backgroundColor: toggleVibCho ? '#e9e9e9' : '#a5a5a5'
                    }} onClick={changeVibChoState}>VibCho</button>
                </div>
                <div className='VibChoSetting'>
                    <VibChoSelector onChange={(value) => {setVibSetting(value); vibSettingRef.current = value}} value={vibSetting} />
                </div>
                <div className='Drawbars'>
                    <Drawbar name="16'" value01={gain16Vol} changeFunction={changeGain16} light={brown.light} dark={brown.dark} />
                    <Drawbar name="5 1/3'" value01={gain513Vol} changeFunction={changeGain513} light={brown.light} dark={brown.dark} />
                    <Drawbar name="8'" value01={gain8Vol} changeFunction={changeGain8} light={white.light} dark={white.dark} />
                    <Drawbar name="4'" value01={gain4Vol} changeFunction={changeGain4} light={white.light} dark={white.dark} />
                    <Drawbar name="2 2/3'" value01={gain223Vol} changeFunction={changeGain223} light={black.light} dark={black.dark} />
                    <Drawbar name="2'" value01={gain2Vol} changeFunction={changeGain2} light={white.light} dark={white.dark} />
                    <Drawbar name="1 3/5'" value01={gain135Vol} changeFunction={changeGain135} light={black.light} dark={black.dark} />
                    <Drawbar name="1 1/1'" value01={gain113Vol} changeFunction={changeGain113} light={black.light} dark={black.dark} />
                    <Drawbar name="1'" value01={gain1Vol} changeFunction={changeGain1} light={white.light} dark={white.dark} />
                </div>
                <div className='MasterGain'>
                    <p>Master Gain</p>
                    <p>{gain}</p>
                    <input className='slider' type="range" min="0" max="1" step="0.05" onChange={(e) => changeGain(e.target.value)} value={gain} />
                </div>
            </header>
            
            <main>
                <p>Devices: </p>
                {devices.length === 0 && <p>connect a midi device and reload the application</p>}
                <div>{devices.map((device, index) => {
                    return <p key={index}>{device}</p>
                })}</div>
                
                <p style={{fontWeight: '700', marginTop: '2.5%'}}>Keep in mind:</p>
                <p>if mono is selected on your midi device, then the organ will be mono as well</p>
                
                <About />
            </main>
        </div>
    )
}