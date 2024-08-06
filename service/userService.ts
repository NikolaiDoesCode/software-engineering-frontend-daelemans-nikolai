import { User, loginUser } from "@/types";

const getUserByEmail = async (email: string) => {
  return await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/user/" + email, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const getAllUsers = async () => {
  return await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// bestaat nog niet in de backend
const login = async (user: loginUser) => {
  return await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
};

const createUser = async (user: User) => {
  return await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
};

const setRole = async (email: string, role: string) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Log in first please");
  }
  return await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/api/user/setRole/${email}/${role}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: role }),
    }
  );
};

const setAdmin = async (email: string, isAdmin: boolean) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Log in first please");
  }
  return await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/api/user/setAdmin/${email}/${isAdmin}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isAdmin: isAdmin }),
    }
  );
};

const setAccountant = async (email: string, isAccountant: boolean) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Log in first please");
  }
  return await fetch(
    process.env.NEXT_PUBLIC_API_URL +
      `/api/user/setAccountant/${email}/${isAccountant}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isAccountant: isAccountant }),
    }
  );
};

const deleteUser = async (email: string) => {
  return await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/user/" + email, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
const getCarsUser = async (email: string) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("Log in first please");
  }
  return await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/user/cars/" + email,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const getRentalsUser = async (email: string) => {
  return await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/user/rentals/" + email,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

const getRentsUser = async (email: string) => {
  return await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/user/rents/" + email,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

const getNotificationsUser = async (email: string) => {
  return await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/user/notifications/" + email,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

const getNewNotificationsUser = async (email: string) => {
  return await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/user/notifications/new/" + email,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

const getMessagesUser = async (email: string) => {
  return await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/user/messages/" + email,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

const getGroupchatsUser = async (email: string) => {
  return await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/user/groupchats/" + email,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

const userService = {
  getUserByEmail,
  getAllUsers,
  login,
  createUser,
  deleteUser,
  setRole,
  setAdmin,
  setAccountant,
  getCarsUser,
  getRentalsUser,
  getRentsUser,
  getNotificationsUser,
  getNewNotificationsUser,
  getMessagesUser,
  getGroupchatsUser,
};

export default userService;
