export const savePendingReturnTo = (locationObject) => {
  if (!locationObject) return;
  const path = locationObject.pathname || "";
  const search = locationObject.search || "";
  const hash = locationObject.hash || "";

  if (path.startsWith("http") || path.startsWith("//") || path.toLowerCase().includes("javascript:")) {
    return;
  }
  if (!path.startsWith("/")) {
    return;
  }

  const isAuthRoute = path.includes("/user/signin") || path.includes("/user/signup") || path.includes("/admin/signin") || path === "/admin" || path === "/admin/";
  if (isAuthRoute) {
    return;
  }

  if (sessionStorage.getItem("pendingReturnTo")) {
    return;
  }

  const fullPath = `${path}${search}${hash}`;
  sessionStorage.setItem("pendingReturnTo", fullPath);
};

export const getPendingReturnTo = () => {
  return sessionStorage.getItem("pendingReturnTo");
};

export const clearPendingReturnTo = () => {
  sessionStorage.removeItem("pendingReturnTo");
};
