export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10,15}$/;
  return phoneRegex.test(phone);
};

export const isValidSalary = (salary: unknown): boolean => {
  const value = Number(salary);

  return (
    salary !== "" &&
    Number.isFinite(value) &&
    value >= 0
  );
};

export const isValidDate = (date: string): boolean => {
  return !Number.isNaN(new Date(date).getTime());
};