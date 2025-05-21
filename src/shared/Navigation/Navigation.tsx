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
<<<<<<< HEAD
        if(i.hide && !IsCreator){
=======
        if(!i.role?.includes(role)){
>>>>>>> befa2f9 (Update Request Logic)
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
