import React, {useState} from 'react';
import cn from "classnames";
import "./_style.scss";

const TextContainer = (props) => {
    const processText = () => {
        let text = props.text;
        if (props.coincidence) {
            const words = text.split(' ');
            let bias = 0;
            for (let item of props.coincidence) {
                words.splice(item[0] + bias, 0, "<span class=\"highlight\">")
                words.splice(item[1] + bias + 1, 0, "</span>")
                bias += 2;
            }
            text = words.join(' ');

        }
        const links_split = text.split(/(https?:\/\/[^\s]+)/g);
        for (let i = 0; i < links_split.length; i++) {
            if (links_split[i].match(/(https?:\/\/[^\s]+)/g)) {
                links_split[i] = ` <a href="${links_split[i]}" `;
            }
        }
        return links_split.join();
    }

    return (
        <p
            className={cn('text-container', props.className)}
            style={props.style}
            dangerouslySetInnerHTML={{__html: processText()}}
        />
    )
}

export default TextContainer;