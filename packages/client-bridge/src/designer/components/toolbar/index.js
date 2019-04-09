import React from 'react';
import './toolbar.css';


const Toolbar = ({ onChange }) => (
    <div className="toolbar">
        <ol>
            <li>
                <a onClick={() => onChange('css')}>CSS</a>
            </li>
        </ol>
    </div>
)

export default Toolbar;