// Helper function to format numbers with thousand separators
export function formatWithThousandSeparator(num: number): string {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
