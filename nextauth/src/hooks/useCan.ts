import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

type UseCanParams = {
  permissions?: string[];
  roles?: string[];
};

export function useCan({ permissions, roles }: UseCanParams) {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (!isAuthenticated) {
    return false;
  }

  if (permissions?.length > 0) {
    //@Every returna true ou false de acordo a condição
    const hasAllPermissions = permissions.every((permissions) => {
      return user.permissions.includes(permissions);
    });

    //Caso não tenha todas permissões return false
    if (!hasAllPermissions) {
      return false;
    }
  }

  if (roles?.length > 0) {
    //@Every returna true ou false de acordo a condição
    const hasAllRoles = permissions.some((role) => {
      return user.roles.includes(role);
    });

    //Caso não tenha todas permissões return false
    if (!hasAllRoles) {
      return false;
    }
  }

  return true;
}
