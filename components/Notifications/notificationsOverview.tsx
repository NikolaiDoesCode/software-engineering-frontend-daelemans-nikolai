import NotificationService from "@/service/notificationService";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";
import { Notification, NotificationStatus, NotificationType, MailRequest } from "@/types";
import { useEffect, useState } from "react";
import NotificationDetail from "./notificationDetails";
import RentService from "@/service/rentService";
import userService from "@/service/userService";
import { useTranslation } from "next-i18next";
import MailService from "@/service/mailService";

type Props = {
  isHistory: boolean;
};

const NotificationOverview: React.FC<Props> = ({ isHistory }) => {
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const { t } = useTranslation();
  useEffect(() => {
    if (typeof window !== "undefined" && window.sessionStorage) {
      const user = sessionStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        setUserEmail(userData.email);
      }
    }
  }, []);

  const handleCloseNotificationDetail = async (notification: Notification) => {
    if (notification.notificationType != NotificationType.RENT) {
      if (notification.id !== undefined) {
        const response = await NotificationService.updateStatusNotification(
          notification.id
        );
      }
    }
    setSelectedNotification(null); // Set selectedNotification to null to close the notification detail
  };

  const fetchNotifications = async () => {
    try {
      let response;
      if (isHistory == true) {
        response = await userService.getNotificationsUser(userEmail);
      } else {
        response = await userService.getNewNotificationsUser(userEmail);
      }

      const notifications = await response.json();
      return notifications;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return null;
    }
  };

  const {
    data: notifications,
    isLoading,
    error,
  } = useSWR("notifications", fetchNotifications);

  useInterval(() => {
    mutate("notifications", fetchNotifications());
  }, 5000);

  const handleRowClick = (notification: Notification) => {
    setSelectedNotification(notification);
  };

  const sendChoiceNotification = async (
    notification: Notification,
    notificationType: NotificationType
  ) => {
    let status = NotificationStatus.UNREAD;
    try {
      const response = await NotificationService.addNotification(
        {
          rentId: notification.rentId,
          brand: notification.brand,
          type: notification.type,
          licensePlate: notification.licensePlate,
          startDate: notification.startDate,
          endDate: notification.endDate,
          emailOwner: notification.emailOwner,
          emailRenter: notification.emailRenter,
          notificationType: notificationType,
          notificationStatus: status,
        },
        notification.emailRenter
      );
    } catch (error) {
      console.error("Error sending choice notification:", error);
    }

    let statusForEmail;

    if(notificationType == NotificationType.CANCEL) {
      statusForEmail = `cancelled`;
    }
    else if (notificationType == NotificationType.CONFIRM) {
      statusForEmail = `confirmed`;
    }
    else{
      statusForEmail = ``;
    }


    let text = `Your rent for the ${notification.brand} ${notification.licensePlate} from ${notification.startDate} until ${notification.endDate} was ${statusForEmail}`;

    let subject = `Your rent was ${statusForEmail}`;

    let ownerEmail = notification.emailRenter;

    let mailToSend : MailRequest = {to : ownerEmail, text, subject, }

    const response = await MailService.sendMail(mailToSend);

    try {
      if (
        notificationType === NotificationType.CANCEL &&
        notification.rentId !== undefined
      ) {
        const response = await RentService.deleteRent(notification.rentId);
      }
    } catch (error) {
      return;
    }

    try {
      if (notification.id !== undefined) {
        const response = await NotificationService.updateStatusNotification(
          notification.id
        );
      }
    } catch (error) {
      return;
    }

    setSelectedNotification(null);
  };

  return (
    <div className="scrollable-window max-h-80 overflow-auto">
      <div className="window-content">
        {notifications && notifications.length > 0 ? (
          <>
            <table className="w-full table-fixed border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 w-1/4 text-center">
                    {t("notifications.overview")}
                  </th>
                  <th className="p-3 w-1/4 text-center">
                    {t("notifications.car")}
                  </th>
                  <th className="p-3 w-1/4 text-center">{t("rents.start")}</th>
                  <th className="p-3 w-1/4 text-center">{t("rents.end")}</th>
                  <th className="p-3 w-1/4 text-center">{t("rents.owner")}</th>
                  <th className="p-3 w-1/4 text-center">{t("rents.renter")}</th>
                  <th className="p-3 w-1/4 text-center">
                    {t("notifications.status")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {notifications.map((notification: Notification) => (
                  <tr
                    key={notification.id}
                    className="bg-white border-b border-gray-300 cursor-pointer"
                    onClick={() => handleRowClick(notification)} // Add onClick event handler
                  >
                    <td className="p-3 text-center">
                      {notification.notificationType}
                    </td>
                    <td className="p-3 text-center">{notification.brand}</td>
                    <td className="p-3 text-center">
                      {notification.startDate}
                    </td>
                    <td className="p-3 text-center">{notification.endDate}</td>
                    <td className="p-3 text-center">
                      {notification.emailOwner}
                    </td>
                    <td className="p-3 text-center">
                      {notification.emailRenter}
                    </td>
                    <td className="p-3 text-center">
                      {notification.notificationStatus}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Render the selected notification component */}
            {selectedNotification && (
              <NotificationDetail
                notification={selectedNotification}
                onChoice={sendChoiceNotification}
                onClose={handleCloseNotificationDetail}
              />
            )}
          </>
        ) : null}{" "}
        {/* Close the ternary condition here */}
      </div>
    </div>
  );
};

export default NotificationOverview;
