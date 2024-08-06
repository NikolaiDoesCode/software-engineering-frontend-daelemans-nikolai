const getBills = async () => {
  return await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/billing", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const getBillsByOwnerEmail = async (email: string) => {
  return await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/billing/owner/" + email,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

const getBillsByRenterEmail = async (email: string) => {
  return await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/billing/renter/" + email,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

const billingService = {
  getBills,
  getBillsByOwnerEmail,
  getBillsByRenterEmail,
};

export default billingService;
