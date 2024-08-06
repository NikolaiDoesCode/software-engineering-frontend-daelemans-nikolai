import React from 'react';

type Props = {
    text: string;
    handleClick: () => void;
};

const RedButton = ({ text, handleClick } : Props) => {
    return (
        <button className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mr-2' onClick={handleClick}>
            {text}
        </button>
    );
};

export default RedButton;