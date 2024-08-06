import { Notification } from "@/types";

const getAllNotifications = () => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/api/notification", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const addNotification = (notification: Notification, userEmail: string) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/api/notification/" + userEmail, {
      method: "POST",
      body: JSON.stringify(notification),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  
  const deleteNotification = (id: number) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/api/notification/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const updateStatusNotification = (id: number) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/api/notification/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };


const NotificationService = {
    getAllNotifications,
    addNotification,
    deleteNotification,
    updateStatusNotification
  };
  
  export default NotificationService;