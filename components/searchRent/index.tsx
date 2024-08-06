import StatusMessageList from "@/components/errors/statusMessageList";
import { useState } from "react";
import { Rent, StatusMessage } from "@/types";
import { useRouter } from "next/router";

import rentService from "@/service/rentService";
import { useTranslation } from "next-i18next";

type Props = {
  onRentsFetched: (rents: Rent[]) => void;
};

export const SearchRentsForm: React.FC<Props> = ({ onRentsFetched }: Props) => {
  const [email, setEmail] = useState("");
  const [searchRentsMessages, setSearchRentsMessages] = useState<
    StatusMessage[]
  >([]);
  const { t } = useTranslation();

  const router = useRouter();

  const searchingRents = async () => {
    setSearchRentsMessages([]);

    try {
      const response = await rentService.getRentByEmail(email);
      const data = await response.json();
      if (response.status === 200) {
        onRentsFetched(data);
        return response;
      } else {
        setSearchRentsMessages([{ type: "error", message: data.rentEmail }]);
        onRentsFetched([]);
      }
    } catch (error) {
      console.error("Error searching rents:", error);
      setSearchRentsMessages([
        { type: "error", message: "Failed to search rentssss" },
      ]);
      return null;
    }
  };

  return (
    <>
      <div className="bg-gray-200 w-fit p-8 border-r border-black">
        <h2 className="text-3xl">{t("rents.search")}</h2>
        <StatusMessageList
          nameError={""}
          statusMessages={searchRentsMessages}
        />
        <form className="flex flex-col mt-3 p-2">
          <label htmlFor="email" className="block text-l m-1">
            {t("rents.email")}
          </label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="border w-[15rem] border-gray-300 text-l rounded-lg focus:ring-blue-500 focus:border-blue:500 p-1 m-1"
          />

          <button
            className="w-[10em] mt-1 bg-blue-800 hover:bg-blue-900 border rounded-xl p-1 m-1"
            type="button"
            onClick={searchingRents}
          >
            {t("rents.searchButton")}
          </button>
        </form>
      </div>
    </>
  );
};

export default SearchRentsForm;
