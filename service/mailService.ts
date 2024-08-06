import { MailRequest } from "@/types";


const sendMail = (mail: MailRequest) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/mail/send", {
    method: "POST",
    body: JSON.stringify(mail),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const MailService = {
    sendMail,
  };
  
  export default MailService;