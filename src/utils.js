// Calculate the sum of all values in the table
export const calculateGrandTotal = (rows) => {
  return rows.reduce((total, row) => total + row.value, 0);
};

// Calculate variance percentage
export const calculateVariance = (currentValue, originalValue) => {
  if (originalValue === 0) return 0;
  return ((currentValue - originalValue) / originalValue) * 100;
};

// Format number to 2 decimal places
export const formatNumber = (num) => {
  return num.toFixed(2);
};

// Format percentage
export const formatPercentage = (percentage) => {
  return `${percentage.toFixed(2)}%`;
};

// Deep clone an object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Update parent values based on children values
export const updateParentValues = (rows) => {
  return rows.map(row => {
    if (row.children && row.children.length > 0) {
      const childrenSum = row.children.reduce((sum, child) => sum + child.value, 0);
      const updatedRow = { 
        ...row, 
        value: childrenSum,
        variance: calculateVariance(childrenSum, row.originalValue || childrenSum)
      };
      return updatedRow;
    }
    return row;
  });
};

// Distribute parent value to children based on their contribution ratio
export const distributeValueToChildren = (row, newValue) => {
  if (!row.children || row.children.length === 0) {
    return {
      ...row,
      value: newValue,
      variance: calculateVariance(newValue, row.originalValue || newValue)
    };
  }

  const currentTotal = row.children.reduce((sum, child) => sum + child.value, 0);
  
  // If current total is 0, distribute equally
  if (currentTotal === 0) {
    const equalShare = newValue / row.children.length;
    return {
      ...row,
      value: newValue,
      variance: calculateVariance(newValue, row.originalValue || newValue),
      children: row.children.map(child => ({
        ...child,
        value: equalShare,
        variance: calculateVariance(equalShare, child.originalValue || equalShare)
      }))
    };
  }

  // Distribute based on contribution ratio
  return {
    ...row,
    value: newValue,
    variance: calculateVariance(newValue, row.originalValue || newValue),
    children: row.children.map(child => {
      const contributionRatio = child.value / currentTotal;
      const newChildValue = newValue * contributionRatio;
      return {
        ...child,
        value: newChildValue,
        variance: calculateVariance(newChildValue, child.originalValue || newChildValue)
      };
    })
  };
};