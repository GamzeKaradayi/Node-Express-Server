// Expected name has character less than 20 and more than 3 characters
// Should contain valid characters
export function validUsername(str) {
  const regexp = RegExp('^[a-zA-Z]+([_ -]?[a-zA-Z0-9])*$');
  return !!str && str.length >= 3 && str.length <= 20 && regexp.test(str);
}

// Expected pass has character less than 20 and more than 6 characters
export function validPassword(pass) {
  const regexp = RegExp('^[a-zA-Z0-9_ -]*');
  return !!pass && pass.length >= 6 && pass.length <= 20 && regexp.test(pass);
}