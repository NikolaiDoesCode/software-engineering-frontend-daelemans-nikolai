import { useState } from "react";
import { Notification, NotificationType } from "@/types";
import { useTranslation } from "next-i18next";

type Props = {
  notification: Notification;
  onClose: (notification: Notification) => void;
  onChoice: (
    notification: Notification,
    notificationType: NotificationType
  ) => void;
};

const NotificationDetail: React.FC<Props> = ({
  notification,
  onChoice,
  onClose,
}) => {
  const { t } = useTranslation();
  const handleClose = () => {
    onClose(notification); // Call the onClose function provided by the parent component
  };

  const handleConfirm = () => {
    onChoice(notification, NotificationType.CONFIRM); // Call the onClose function provided by the parent component
  };

  const handleCancel = () => {
    onChoice(notification, NotificationType.CANCEL); // Call the onClose function provided by the parent component
  };

  return (
    <div className="w-3/12 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-semibold mb-4">
        {t("notifications.detail")}
      </h2>
      <p className="w-full text-center">
        {notification.notificationType} {t("for")} {notification.brand}{" "}
        {notification.licensePlate}
      </p>
      <p className="w-full text-center">
        {t("from")} {notification.startDate} {t("until")} {notification.endDate}{" "}
      </p>

      <div className="flex justify-center space-x-4">
        {" "}
        {/* Center the buttons and add space between them */}
        {notification.notificationType === "RENT" &&
          notification.notificationStatus === "UNREAD" && (
            <>
              <button
                className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleConfirm}
              >
                {t("confirm")}
              </button>
              <button
                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleCancel}
              >
                {t("cancel")}
              </button>
            </>
          )}
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleClose}
        >
          {t("close")}
        </button>
      </div>
    </div>
  );
};

export default NotificationDetail;
