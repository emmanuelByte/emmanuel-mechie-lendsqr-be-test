// Generate NUBAN-style 10-digit account number with checksum
export function generateAccountNumber(base?: number): string {
  // 9-digit base (can be random or from user ID padded)
  const baseNum = base
    ? base.toString().padStart(9, "0")
    : Math.floor(100000000 + Math.random() * 900000000).toString();

  const weights = [3, 7, 3, 3, 7, 3, 3, 7, 3]; // standard weights
  let sum = 0;

  for (let i = 0; i < 9; i++) {
    sum += parseInt(baseNum[i]) * weights[i];
  }

  const checkDigit = (10 - (sum % 10)) % 10;

  return `${baseNum}${checkDigit}`;
}
// Example usage
// const accountNumber = generateAccountNumber();
// console.log(accountNumber); // e.g., "1234567890"
