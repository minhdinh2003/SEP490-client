"use client";
import { useEffect, useState } from "react";

function WithHydration(WrappedComponent:any) {
  function HydratedComponent(props:any) {
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
      setHydrated(true);
    }, []);

    if (!hydrated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  }

  HydratedComponent.displayName = `WithHydration(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return HydratedComponent;
}

export default WithHydration;