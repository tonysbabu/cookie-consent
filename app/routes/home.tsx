import type { Route } from "./+types/home";
import { CookieConsent } from "@/components/CookieConsent";
import { useEffect, useState } from "react";
import { Button } from "@ui/Button";
import { useCookies } from "@/utils/hooks";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const { getCookie } = useCookies();

  useEffect(() => {
    const  fetchCookie  = async () => {
     const essentialCookie = await getCookie('essential');
     if(essentialCookie && essentialCookie.value === "true") {
       return
     } else {
       setIsOpen(true);
     }
    }
    fetchCookie();
  }, []);

  return (
    <>
      <Button onClick={() => {
        setIsOpen(true)
      }}>Open Cookie Consent</Button>
      <CookieConsent
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />
    </>
  );
}
