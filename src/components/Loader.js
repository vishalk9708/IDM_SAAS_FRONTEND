import React from 'react'
import { ProgressBar }  from 'react-materialize';

export default function Loader(props) {

    const element = <div id='p01' style = {{zIndex:'200'}}>
                       <ProgressBar id='progressbar'/>
                    </div>

    const sp = <div style={{height:'8px'}}></div>
    return(
        <div>
           
            {props.value ? element : sp}
           
        </div>
    );
}
