export function saveAuth(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  // Keep individual items for backward compatibility if needed
  localStorage.setItem("role", user.role);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getRole() {
  const user = getUser();
  return user ? user.role : localStorage.getItem("role");
}

export function getUser() {
  const userStr = localStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);

  // Fallback for existing sessions
  const role = localStorage.getItem("role");
  if (role) {
    return { id: 1, role: role, name: localStorage.getItem("user_name") || "User" };
  }
  return null;
}

export function getAuth() {
  return {
    token: localStorage.getItem("token"),
    user: getUser(),
    role: getRole()
  };
}

export function logout() {
  localStorage.clear();
}
