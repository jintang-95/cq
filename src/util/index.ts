const userKey = "__NA_USER_INFO__";
export const setUserInfo = (data: Record<string, string> | null) => {
  if (data) {
    localStorage.setItem(userKey, JSON.stringify(data));
  } else {
    localStorage.removeItem(userKey);
  }
};
export const getUserInfo = () => {
  return JSON.parse(localStorage.getItem(userKey) || "{}");
};
