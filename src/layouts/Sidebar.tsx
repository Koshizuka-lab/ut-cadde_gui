/* eslint-disable @typescript-eslint/no-misused-promises */
import { useRouter } from "next/router";

const SideBox = (props: {
  icon: string;
  text: string;
  onClick: () => void;
}) => {
  return (
    <div
      className="border-b border-gray w-full h-16 flex justify-start items-center pl-8 hover:bg-primary hover:bg-opacity-10 hover:border-r-4 hover:border-r-primary cursor-pointer"
      onClick={props.onClick}
    >
      <span className="material-symbols-outlined text-primary text-2xl pr-1">
        {props.icon}
      </span>
      <div className="text-xl font-bold text-primary">{props.text}</div>
    </div>
  );
};

export const Sidebar = () => {
  const router = useRouter();

  return (
    <div className="fixed top-0 left-0 bg-white h-full w-56 pt-16 z-0 flex flex-col justify-start items-center border-r border-gray">
      <SideBox
        icon="settings"
        text="Settings"
        onClick={() => router.push("/settings")}
      />
      <SideBox
        icon="search"
        text="Search"
        onClick={() => router.push("/search")}
      />
      <SideBox
        icon="cloud_download"
        text="Download"
        onClick={() => router.push("/download")}
      />
    </div>
  );
};
