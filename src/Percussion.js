import React, { useState } from 'react'
import './Stylesheets/Percussion.css'

function Percussion() {
    const [percON, setPercON] = useState(false)

    const togglePercussion = () => {
        setPercON(prev => !prev)
    }

    return (
        <div className='PercussionContainer'>
            <button onClick={togglePercussion} className={percON ? 'PercussionButtonDown' : 'PercussionButtonUp'}>
                <div className={percON ? 'innerContainerDown' : 'innerContainerUp'}>
                    <h4>ON</h4>
                    <h4 className='text'>Percussion</h4>
                    <h4>OFF</h4>
                </div>
            </button>
        </div>
    )
}

export default Percussion