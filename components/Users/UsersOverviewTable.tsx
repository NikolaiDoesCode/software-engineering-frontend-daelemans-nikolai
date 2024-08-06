import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import UserService from "@/service/userService";
import DeleteUserWindow from "./DeleteUserWindow";
import { User, Role } from "@/types";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";
import RedButton from "../buttons/RedButton";
import { useTranslation } from "next-i18next";

const UserOverviewTable: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteUserWindow, setShowDeleteUserWindow] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();

  const handleChangeRole = (user: User, role: Role) => {
    user.role = role;
    UserService.setRole(user.email, role);
  };

  const handleSetAdmin = (user: User, isAdmin: boolean) => {
    user.isAdmin = isAdmin;
    UserService.setAdmin(user.email, isAdmin);
  };

  const handleSetAccountant = (user: User, isAccountant: boolean) => {
    user.isAccountant = isAccountant;
    UserService.setAccountant(user.email, isAccountant);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setShowDeleteUserWindow(true);
  };

  const handleCloseDeleteWindow = () => {
    setSelectedUser(null);
    setShowDeleteUserWindow(false);
  };

  const fetchUsers = async () => {
    try {
      const response = await UserService.getAllUsers();
      const users = await response.json();
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      return null;
    }
  };

  const { data: users, isLoading, error } = useSWR("users", fetchUsers);

  useInterval(() => {
    mutate("users", fetchUsers());
  }, 10000);

  return (
    <div className="max-w-screen-lg mx-auto">
      {isLoading && <p className="text-center mt-4">Loading...</p>}
      {error && <p className="text-center mt-4">Error: {error}</p>}
      {users && users.length > 0 ? (
        <table className="w-full table-fixed border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 w-1/4 text-center">{t("users.email")}</th>
              <th className="p-3 w-1/4 text-center">{t("users.name")}</th>
              <th className="p-3 w-1/4 text-center">{t("users.number")}</th>
              <th className="p-3 w-1/4 text-center">{t("users.role")}</th>
              <th className="p-3 w-1/4 text-center">{t("users.rights")}</th>
              <th className="p-3 w-1/4 text-center">{t("users.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: User) => (
              <tr
                key={user.email}
                className="bg-white border-b border-gray-300"
              >
                <td className="p-3 text-center">{user.email}</td>
                <td className="p-3 text-center">
                  {user.firstName + " " + user.lastName}
                </td>
                <td className="p-3 text-center">{user.phoneNumber}</td>
                <td className="p-3 text-center">
                  <select
                    value={user.role}
                    onChange={(e) => {
                      handleChangeRole(
                        user,
                        Role[e.target.value as keyof typeof Role]
                      );
                    }}
                  >
                    <option value="OWNER">{t("users.owner")}</option>
                    <option value="RENTER">{t("users.renter")}</option>
                  </select>
                </td>
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    id={`admin-${user.email}`}
                    name={`role-${user.email}`}
                    value="ADMIN"
                    checked={user.isAdmin}
                    onChange={(e) => {
                      handleSetAdmin(user, e.target.checked);
                    }}
                  />
                  <label htmlFor={`admin-${user.email}`}>
                    {t("users.admin")}
                  </label>
                  <br />
                  <input
                    type="checkbox"
                    id={`accountant-${user.email}`}
                    name={`role-${user.email}`}
                    value="ACCOUNTANT"
                    checked={user.isAccountant}
                    onChange={(e) => {
                      handleSetAccountant(user, e.target.checked);
                    }}
                  />
                  <label htmlFor={`accountant-${user.email}`}>
                    {t("users.accountant")}
                  </label>
                </td>
                <td className="p-3 text-center">
                  <RedButton
                    text={t("delete")}
                    handleClick={() => handleDeleteUser(user)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center mt-4">{t("users.no")}</p>
      )}
      {showDeleteUserWindow && (
        <DeleteUserWindow
          user={selectedUser!}
          onClose={handleCloseDeleteWindow}
        />
      )}
    </div>
  );
};

export default UserOverviewTable;
