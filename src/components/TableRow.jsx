import React, { useState } from 'react';
import { calculateVariance, formatNumber, formatPercentage } from '../utils';

const TableRow = ({ row, level, onUpdateValue }) => {
  const [inputValue, setInputValue] = useState('');
  const indentation = level * 20; // 20px per level of indentation
  
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAllocationPercentage = () => {
    const percentage = parseFloat(inputValue);
    if (!isNaN(percentage)) {
      onUpdateValue(row.id, percentage, true);
      setInputValue('');
    }
  };

  const handleAllocationValue = () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value)) {
      onUpdateValue(row.id, value, false);
      setInputValue('');
    }
  };

  const variance = row.variance !== undefined 
    ? row.variance 
    : calculateVariance(row.value, row.originalValue || row.value);

  return (
    <>
      <tr className="border-b">
        <td className="py-2 px-4 text-left">
          <div style={{ paddingLeft: `${indentation}px` }} className="flex items-center">
            {level > 0 && <span className="mr-1">--</span>}
            {row.label}
          </div>
        </td>
        <td className="py-2 px-4 text-right">{formatNumber(row.value)}</td>
        <td className="py-2 px-4">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className="w-full p-1 border rounded"
            placeholder="Enter value"
          />
        </td>
        <td className="py-2 px-4">
          <button
            onClick={handleAllocationPercentage}
            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded mr-2"
          >
            Allocation %
          </button>
        </td>
        <td className="py-2 px-4">
          <button
            onClick={handleAllocationValue}
            className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded"
          >
            Allocation Val
          </button>
        </td>
        <td className="py-2 px-4 text-right">
          {formatPercentage(variance)}
        </td>
      </tr>
      
      {row.children && row.children.map(child => (
        <TableRow
          key={child.id}
          row={child}
          level={level + 1}
          onUpdateValue={onUpdateValue}
        />
      ))}
    </>
  );
};

export default TableRow;