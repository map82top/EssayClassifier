import React, {useState} from 'react';
import processString from 'react-process-string';
import cn from "classnames";
import "./_style.scss";

const TextContainer = (props) => {
    const [config, setConfig] = useState([{
        regex: /(http|https):\/\/(\S+)\.([a-z]{2,}?)(.*?)( |\,|$|\.)/gim,
        fn: (key, result) => <span key={key}>
                                 <a target="_blank" href={`${result[1]}://${result[2]}.${result[3]}${result[4]}`}>{result[2]}.{result[3]}{result[4]}</a>{result[5]}
                             </span>
    }]);

    return (
        <p
            className={cn('text-container', props.className)}
            style={props.style}
        >
             {processString(config)(props.text)}
        </p>
    )
}

export default TextContainer;