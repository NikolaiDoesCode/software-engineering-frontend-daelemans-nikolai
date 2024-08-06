
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import userService from "@/service/userService";
import { useTranslation } from "next-i18next";


interface Complaint {
    type: string;
    text: string;
    date: string;
  }
  
  const AdminNotificationsTable: React.FC = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
  
    useEffect(() => {
      const savedComplaints = JSON.parse(localStorage.getItem('complaints') || '[]') as Complaint[];
      setComplaints(savedComplaints);
    }, []);
  
    return (
      <>
        <div className="container mx-auto mt-12">
          <h1 className="text-center text-2xl font-semibold">Submitted Complaints</h1>
          <div className="mt-4">
            {complaints.length === 0 ? (
              <p>No complaints submitted yet.</p>
            ) : (
              <ul>
                {complaints.map((complaint, index) => (
                  <li key={index} className="border-b py-2">
                    <strong>{complaint.type}:</strong> {complaint.text} <em>({new Date(complaint.date).toLocaleString()})</em>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </>
    );
  };
  
  export default AdminNotificationsTable;