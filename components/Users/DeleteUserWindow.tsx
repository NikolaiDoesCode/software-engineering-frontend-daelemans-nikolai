import { useState } from "react";
import UserService from "@/service/userService";
import { User } from "@/types";
import { mutate } from "swr";
import { useTranslation } from "next-i18next";

type Props = {
  user: User;
  onClose: () => void;
};

const DeleteUserWindow: React.FC<Props> = ({ user, onClose }: Props) => {
  const { t } = useTranslation();
  const deleteUser = async (email: string) => {
    try {
      const response = await UserService.deleteUser(email);
      onClose();
      mutate("users");
    } catch (error) {
      return;
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <p className="text-center text-lg font-semibold mb-4">{`${t(
        "users.delete"
      )} ${user.firstName} ${user.lastName}?`}</p>
      <div className="flex justify-center space-x-4">
        <button
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 focus:outline-none focus:bg-red-600 transition duration-300"
          onClick={() => deleteUser(user.email)}
        >
          {t("yes")}
        </button>
        <button
          className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded hover:bg-gray-400 focus:outline-none focus:bg-gray-400 transition duration-300"
          onClick={onClose}
        >
          {t("no")}
        </button>
      </div>
    </div>
  );
};

export default DeleteUserWindow;
