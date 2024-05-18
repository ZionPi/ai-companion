import React from 'react';

function Bionic({ children, color, fontSize }) {
    const bionic = (text) => {
        return text
            .split(' ')
            .map((word) => {
                const halfway = Math.ceil(word.length / 2);
                const firstHalf = `<span class="font-bold ${color} ${fontSize}">${word.slice(0, halfway)}</span>`;
                const secondHalf = `<span class="${color} ${fontSize}">${word.slice(halfway)}</span>`;
                return `${firstHalf}${secondHalf}`;
            })
            .join(' ');
    };

    return <span dangerouslySetInnerHTML={{ __html: bionic(children) }}></span>;
}


export default Bionic