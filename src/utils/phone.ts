export const normalizePhone = (value: string): string => value.replace(/\D/g, "");

export const isValidPhone = (phone: string): boolean => /^(7\d{10})$/.test(phone);

export const formatPhoneDigits = (digits: string): string =>
  [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 8), digits.slice(8, 10)].filter(Boolean).join(" ");

export const formatPhone = (phone: string): string => {
  const match = /^7(\d{3})(\d{3})(\d{2})(\d{2})$/.exec(phone);
  if (!match) return phone;
  return `+7 ${match[1]} ${match[2]}-${match[3]}-${match[4]}`;
};
