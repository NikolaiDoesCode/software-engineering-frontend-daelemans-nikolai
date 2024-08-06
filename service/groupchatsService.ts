import { Groupchat } from "@/types";

// kroepoek

const getAllGroupchats = () => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/api/groupchat", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const createGroupchat = () => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/api/groupchat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const getUsersOfGroupchat = (groupchatId: number) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/api/groupchat/users/" + groupchatId, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const addUserToGroupchat = (userEmail : string, groupchatId : number) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + `/api/groupchat/add?email=${userEmail}&id=${groupchatId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// http://localhost:8080/api/groupchat/add?email=renter1@renter.com&id=1

const GroupchatService = {
    getAllGroupchats,
    createGroupchat,
    getUsersOfGroupchat,
    addUserToGroupchat
};

export default GroupchatService;
