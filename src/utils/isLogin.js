export default function isLogin() {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}