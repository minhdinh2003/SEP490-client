import React from "react";
import NavigationItem from "./NavigationItem";
import { NAVIGATION_DEMO_2 } from "@/data/navigation";
import useAuthStore from "@/store/useAuthStore";

function Navigation() {
  const auth:any  = useAuthStore();

  const role = auth?.user?.role;
  return (
    <ul className="nc-Navigation flex items-cente">
      {NAVIGATION_DEMO_2.filter((i:any) => {
        if (role == "EMPLOYEE"){
           if(!i.role?.includes(role)) {
            return false;
           }
           return true;
        }
        if(!i.role?.includes(role) && !i.role?.includes("GUEST") ) {
          return false;
        }
     return true;
      }).map((item) => (
        <NavigationItem key={item.id} menuItem={item} />
      ))}
    </ul>
  );
}

export default Navigation;
