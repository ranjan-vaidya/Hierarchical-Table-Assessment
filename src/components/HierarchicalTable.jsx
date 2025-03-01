import React, { useState, useEffect } from 'react';
import TableRowComponent from './TableRow';
import { calculateGrandTotal, updateParentValues, distributeValueToChildren, deepClone, formatNumber, formatPercentage, calculateVariance } from '../utils';

const HierarchicalTable = ({ initialData }) => {
  const [data, setData] = useState(deepClone(initialData));
  const [grandTotal, setGrandTotal] = useState(calculateGrandTotal(initialData.rows));
  const [originalGrandTotal, setOriginalGrandTotal] = useState(calculateGrandTotal(initialData.rows));

  // Initialize original values if not set
  useEffect(() => {
    const initializedData = deepClone(initialData);
    initializedData.rows = initializedData.rows.map(row => ({
      ...row,
      originalValue: row.originalValue || row.value,
      children: row.children?.map(child => ({
        ...child,
        originalValue: child.originalValue || child.value
      }))
    }));
    setData(initializedData);
    setGrandTotal(calculateGrandTotal(initializedData.rows));
    setOriginalGrandTotal(calculateGrandTotal(initializedData.rows));
  }, [initialData]);

  const findRowById = (rows, id) => {
    for (const row of rows) {
      if (row.id === id) {
        return { row, parent: null, path: [row.id] };
      }
      
      if (row.children) {
        for (const child of row.children) {
          if (child.id === id) {
            return { row: child, parent: row, path: [row.id, child.id] };
          }
        }
      }
    }
    
    return { row: null, parent: null, path: [] };
  };

  const updateRowValue = (rowId, newValue, isPercentage) => {
    const newData = deepClone(data);
    const { row, parent } = findRowById(newData.rows, rowId);
    
    if (!row) return;
    
    let updatedValue;
    
    if (isPercentage) {
      // Increase by percentage
      updatedValue = row.value + (row.value * newValue / 100);
    } else {
      // Set direct value
      updatedValue = newValue;
    }
    
    // Update the row value
    row.value = updatedValue;
    row.variance = calculateVariance(updatedValue, row.originalValue || updatedValue);
    
    // If it's a parent row, distribute to children
    if (row.children && row.children.length > 0) {
      const updatedRow = distributeValueToChildren(row, updatedValue);
      
      // Find and replace the row in the data
      for (let i = 0; i < newData.rows.length; i++) {
        if (newData.rows[i].id === rowId) {
          newData.rows[i] = updatedRow;
          break;
        }
      }
    } 
    // If it has a parent, update parent values
    else if (parent) {
      // Update parent values based on children
      newData.rows = updateParentValues(newData.rows);
    }
    
    setData(newData);
    setGrandTotal(calculateGrandTotal(newData.rows));
  };

  const grandTotalVariance = calculateVariance(grandTotal, originalGrandTotal);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 text-left">Label</th>
            <th className="py-2 px-4 text-right">Value</th>
            <th className="py-2 px-4">Input</th>
            <th className="py-2 px-4">Allocation %</th>
            <th className="py-2 px-4">Allocation Val</th>
            <th className="py-2 px-4 text-right">Variance %</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map(row => (
            <TableRowComponent
              key={row.id}
              row={row}
              level={0}
              onUpdateValue={updateRowValue}
            />
          ))}
          <tr className="bg-gray-100 font-bold border-t-2 border-gray-300">
            <td className="py-2 px-4 text-left">Grand Total</td>
            <td className="py-2 px-4 text-right">{formatNumber(grandTotal)}</td>
            <td className="py-2 px-4"></td>
            <td className="py-2 px-4"></td>
            <td className="py-2 px-4"></td>
            <td className="py-2 px-4 text-right">{formatPercentage(grandTotalVariance)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default HierarchicalTable;