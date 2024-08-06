
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import userService from "@/service/userService";
import { useTranslation } from "next-i18next";

interface StatusMessage {
    message: string;
    type: string;
}

const ComplaintForm: React.FC = () => {
    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
    const [emailError, setEmailError] = useState<string>('');
    const [characters, setCharacters] = useState<number>(0);
    const { t } = useTranslation();

    useEffect(() => { }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        const complaintType = form.type.value;
        const complaintText = form.complaint.value;

        const newComplaint = {
            type: complaintType,
            text: complaintText,
            date: new Date().toISOString(),
        };

        if(complaintText.length > 250){
            setStatusMessages([{ message: "Complaint too long!", type: "failed" }])
        }else{
            const existingComplaints = JSON.parse(localStorage.getItem("complaints") || '[]');
            const updatedComplaints = [...existingComplaints, newComplaint];
            localStorage.setItem("complaints", JSON.stringify(updatedComplaints));
            setStatusMessages([{ message: "Complaint submitted successfully!", type: "success" }]);
            console.log(localStorage)
            form.reset();
                    }
    };

    const handleCharacters = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const complaintText = event.target.value;
        setCharacters(complaintText.length);
      };

    return (
        <>
            <h1 className="text-center text-2xl font-semibold mt-12">Complaint Form</h1>
            <div className="container mx-auto mt-4 mb-12">
                {statusMessages.length > 0 && (
                    <div className="text-center text-green-600">
                        <ul>
                            {statusMessages.map(({ message, type }, index) => (
                                <li key={index}>{message}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
                    {emailError && (
                        <p className="text-red-600 font-semibold">{emailError}</p>
                    )}
                    <div className="mb-4 relative">
                        <label htmlFor="type">Choose type:</label>
                        <select id="type" name="type">
                            <option value="Technical">Technical</option>
                            <option value="Customer">Customer Service</option>
                            <option value="Payment">Payment</option>
                            <option value="Policy">Policy</option>
                            <option value="Privacy">Privacy/Security</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="mb-4 relative">
                        <textarea
                            className="border border-black rounded w-full pt-5 pb-1 px-3 focus:outline-none"
                            id="complaint"
                            name="complaint"
                            placeholder="What's on your mind?"
                            onChange={handleCharacters}
                            style={{
                                width: '100%',
                                height: '150px',
                                padding: '12px 20px',
                                boxSizing: 'border-box',
                                border: '2px solid #ccc',
                                borderRadius: '4px',
                                backgroundColor: '#f8f8f8',
                                fontSize: '16px',
                                resize: 'none',
                            }}
                        />
                        <div style={{ textAlign: 'right', color: 'grey' }}>
                        {characters < 250 ? (<p>max length: {250 - characters!}</p>)
                        :
                        <p>max length: too long!</p>}
                        </div>
                        
                    </div>
                    <div className="flex items-center justify-center">
                        <button
                            className="bg-gray-800 text-white font-bold py-2 px-4 rounded hover:scale-105"
                            type="submit"
                        >
                            {t("complaints.send")}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ComplaintForm;
