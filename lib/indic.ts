const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen",
  "Eighteen", "Nineteen"];
const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function twoDigits(n: number): string {
  if (n < 20) return ones[n];
  return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
}

function threeDigits(n: number): string {
  if (n >= 100) {
    return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + twoDigits(n % 100) : "");
  }
  return twoDigits(n);
}

export function amountInWords(amount: number): string {
  const intPart = Math.floor(amount);
  const decPart = Math.round((amount - intPart) * 100);

  if (intPart === 0 && decPart === 0) return "Zero Rupees Only";

  let result = "";
  let n = intPart;

  if (n >= 10000000) {
    result += threeDigits(Math.floor(n / 10000000)) + " Crore ";
    n %= 10000000;
  }
  if (n >= 100000) {
    result += threeDigits(Math.floor(n / 100000)) + " Lakh ";
    n %= 100000;
  }
  if (n >= 1000) {
    result += threeDigits(Math.floor(n / 1000)) + " Thousand ";
    n %= 1000;
  }
  if (n > 0) {
    result += threeDigits(n) + " ";
  }

  result = result.trim() + " Rupees";

  if (decPart > 0) {
    result += " and " + twoDigits(decPart) + " Paise";
  }

  return result + " Only";
}

export function formatIndianCurrency(amount: number): string {
  const [intStr, decStr] = amount.toFixed(2).split(".");
  const n = intStr.replace(/^-/, "");
  let result = "";

  if (n.length > 3) {
    result = n.slice(-3);
    let remaining = n.slice(0, -3);
    while (remaining.length > 2) {
      result = remaining.slice(-2) + "," + result;
      remaining = remaining.slice(0, -2);
    }
    result = remaining + "," + result;
  } else {
    result = n;
  }

  if (intStr.startsWith("-")) result = "-" + result;
  return result + "." + decStr;
}

export function generateReceiptNumber(serial: number, date?: Date): string {
  const d = date ?? new Date();
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const seq = String(serial).padStart(3, "0");
  return `${yy}${mm}${seq}`;
}
