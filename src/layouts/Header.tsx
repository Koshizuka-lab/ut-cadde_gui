import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export const Header = () => {
  const router = useRouter();
  const userID = Cookies.get("user_id");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  const closeMenu = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node) && !iconRef.current?.contains(event.target as Node)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeMenu);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
    };
  }, []);

  return (
    <header className="bg-white h-16 w-full flex justify-between items-center px-10 border-b border-gray">
      <div className="text-3xl font-bold text-primary">DATA-EX</div>
      {userID && (
        <div
          className="flex flex-row gap-2 items-center cursor-pointer"
          ref={iconRef}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="material-symbols-outlined text-xl pt-1">account_circle</div>
          <div className="text-xl font-bold">{userID}</div>
        </div>
      )}
      {menuOpen && (
        <div
          className="absolute right-6 top-16 bg-white border-b border-x border-gray"
          ref={menuRef}
        >
          <div className="flex flex-row gap-2 items-center cursor-pointer p-3 px-5">
            <div className="material-symbols-outlined text-alert">logout</div>
            <div 
              className="text-alert text-md font-bold font-inter cursor-pointer"
              onClick={() => {
                router.push("/signin");
                Cookies.remove("access_token");
                Cookies.remove("refresh_token");
                Cookies.remove("user_id");
              }}
            >
              logout
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
