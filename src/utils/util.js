// Expected name has character less than 20 and more than 3 characters
// Should contain valid characters
export function validFirstname(str) {
  const regexp = RegExp('^[a-zA-Z]+([_ -]?[a-zA-Z0-9])*$');
  return !!str && str.length >= 3 && str.length <= 20 && regexp.test(str);
}

// Expected lastname has character less than 20 and more than 6 characters
export function validLastname(lastname) {
  const regexp = RegExp('^[a-zA-Z0-9_ -]*');
  return !!lastname && lastname.length >= 3 && lastname.length <= 20 && regexp.test(lastname);
}


// Expected name has character less than 20 and more than 3 characters
// Should contain valid characters
export function validHousename(str) {
  const regexp = RegExp('^[a-zA-Z]+([_ -]?[a-zA-Z0-9])*$');
  return !!str && str.length >= 3 && str.length <= 20 && regexp.test(str);
}

// Expected task description has character less than 50 and more than 3 characters
// Should contain valid characters
export function validTaskdescription(str) {
  const regexp = RegExp('^[a-zA-Z]+([_ -:]?[a-zA-Z0-9 ])*$');
  console.log(regexp.test(str));
  console.log(str.length);
  return !!str && str.length >= 3 && str.length <= 50 && regexp.test(str);
}
