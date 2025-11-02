export const getBaseClientUrl = () => {
  const parsedUrl = new URL(window.location.href);
  const baseUrl = parsedUrl.origin;
  return baseUrl;
};

export const TOKEN_KEY = {
  REDIRECT_AFTER_LOGIN_URL: 'redirect_after_login_url'
};

export const isNullOrEmpty = (item: any) => {
  return item === null || item === undefined || item === '';
};

export const generateCorrelationId = () => {
  const timestamp = new Date().getTime();
  const randomNum = Math.floor(Math.random() * 1000000);
  return `${timestamp}-${randomNum}`;
};
