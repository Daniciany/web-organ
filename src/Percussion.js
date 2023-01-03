import React, { useState } from 'react'
import './Stylesheets/Percussion.css'

function Percussion() {
    const [percON, setPercON] = useState(false)

    // if percussion setting second==true, then percussion on second, otherwiese third
    const [second, setSecond] = useState(true)

    const togglePercussion = () => {
        setPercON(prev => !prev)
    }

    const toggleSetting = () => {
        setSecond(prev => !prev)
    }

    return (
        <div className='PercussionContainer'>
            <button onClick={togglePercussion} className={percON ? 'PercussionButtonUp' : 'PercussionButtonDown' }>
                <div className={percON ? 'innerContainerDown' : 'innerContainerUp'}>
                    <h4>ON</h4>
                    <h4 className='text'>Percussion</h4>
                    <h4>OFF</h4>
                </div>
            </button>

            <div className='Gap' />

            <button onClick={toggleSetting} className={second ? 'PercussionButtonDown' : 'PercussionButtonUp'}>
                <div className={second ? 'innerContainerDown' : 'innerContainerUp'}>
                    <h4>Third</h4>
                    <h4 className='text'>Percussion</h4>
                    <h4>Second</h4>
                </div>
            </button>
        </div>
    )
}

export default Percussion