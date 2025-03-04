export const IgnValidator = (value: string) => {
  if (value.length === 0) {
    return 'In Game Name is required';
  }
  return '';
}
export const FriendCodeValidator = (value: string) => {
  if (value.length === 0) {
    return 'Friend Code is required';
  }
  else if (!/^[0-9]{16}$/.test(value)) {
    return 'Friend Code needs to be a 16 digit number';
  }
  return '';
}