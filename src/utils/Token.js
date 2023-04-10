const isTokenExpired = (token, expires) => {
    if (!token) return true;
    if (expires < Date.now()) {
        return true;
    }
    return false;
}

export { isTokenExpired };