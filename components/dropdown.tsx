import React from "react";
import Link from "next/link";

type Props = {
  title: string;
  items: { displayName: string; path: string }[];
};

const DropdownMenu: React.FC<Props> = ({ title, items }: Props) => {
  return (
    <div className="relative group">
      <button className="nav-link text-base text-white hover:underline focus:outline-none">
        {title}
      </button>
      <ul className="absolute hidden bg-white text-gray-800 py-2 rounded-lg shadow-md group-hover:block z-10">
        {items.map((item, index) => (
          <li key={index} className="px-4 py-2 hover:bg-gray-100">
            <Link
              href={`${item.path.replace(" ", "")}`}
              className="text-base font-medium"
            >
              {item.displayName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropdownMenu;
