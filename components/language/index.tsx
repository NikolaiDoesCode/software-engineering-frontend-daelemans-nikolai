import { useRouter } from "next/router";
import styles from "@/styles/Home.module.css";

const Language: React.FC = () => {
    const router = useRouter();
    const { locale, pathname, asPath,query } = router;

    const handleLanguageChange = (newLocale: any) => {
        router.push({ pathname, query }, asPath, { locale: newLocale });
    };

    return (
        <div>
            <button  onClick={() => handleLanguageChange('en')} className="langButton" value="en">EN</button>
            <span> / </span>
            <button onClick={() => handleLanguageChange('nl')} className="langButton" value="nl">NL</button>
        </div>
    );
};

export default Language;