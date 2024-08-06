import React from 'react';
import LanguageDropDown from './LanguageDropDown';

const Footer: React.FC = () => {
    return (
        <footer className="fixed inset-x-0 bottom-0">
            <div className="container mx-auto py-8 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                    &copy; 2024 All rights reserved
                </p>
                <LanguageDropDown />
            </div>
        </footer>
    );
};

export default Footer;