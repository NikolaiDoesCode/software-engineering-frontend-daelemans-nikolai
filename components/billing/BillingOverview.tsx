import { Billing } from "@/types";
import { useTranslation } from "react-i18next";

type Props = {
  bills: Billing[];
};

const BillingOverview: React.FC<Props> = ({ bills }) => {
  const { t } = useTranslation();
  const user = JSON.parse(sessionStorage.getItem("user")!);

  return (
    <div className="max-w-screen-lg mx-auto">
      <h2>Billing Overview</h2>
      {!bills || bills.length === 0 ? (
        <p>No billing information available</p>
      ) : (
        <table className="w-full table-fixed border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {user.isAccountant && (
                <>
                  <th className="p-3 w-1/5 text-center">Cost </th>
                  <th className="p-3 w-1/5 text-center">Start Date</th>
                  <th className="p-3 w-1/5 text-center">End Date</th>
                  <th className="p-3 w-1/5 text-center">Renter Email</th>
                  <th className="p-3 w-1/5 text-center">Owner Email</th>
                  <th className="p-3 w-1/5 text-center">Status</th>
                </>
              )}
              {!user.isAccountant && (
                <>
                  <th className="p-3 w-1/5 text-center">
                    {user.role === "OWNER" ? "Earnings" : "Payments"}
                  </th>
                  <th className="p-3 w-1/5 text-center">Start Date</th>
                  <th className="p-3 w-1/5 text-center">End Date</th>
                  <th className="p-3 w-1/5 text-center">
                    {user.role === "OWNER" ? "Renter" : "Owner"}
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id} className="bg-white border-b border-gray-300">
                {user.isAccountant && (
                  <>
                    <td className="p-3 text-center">{`€${bill.cost}`}</td>
                    <td className="p-3 text-center">
                      {new Date(bill.startDate).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-center">
                      {bill.endDate
                        ? new Date(bill.endDate).toLocaleDateString()
                        : "Didn't checked out yet"}
                    </td>
                    <td className="p-3 text-center">{bill.renter.email}</td>
                    <td className="p-3 text-center">{bill.owner.email}</td>
                    <td className="p-3 text-center">
                      {bill.endDate ? "Payed" : "Ongoing"}
                    </td>
                  </>
                )}
                {!user.isAccountant && (
                  <>
                    <td className="p-3 text-center">{`€${bill.cost}`}</td>
                    <td className="p-3 text-center">
                      {new Date(bill.startDate).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-center">
                      {bill.endDate
                        ? new Date(bill.endDate).toLocaleDateString()
                        : "Didn't checked out yet"}
                    </td>
                    <td className="p-3 text-center">
                      {user.role === "OWNER"
                        ? bill.renter.email
                        : bill.owner.email}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BillingOverview;
