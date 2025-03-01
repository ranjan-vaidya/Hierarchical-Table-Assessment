import React from 'react';
import HierarchicalTable from './components/HierarchicalTable';
import { initialData } from './data';
import { BarChart3 } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Hierarchical Table Assessment</h1>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Budget Allocation Table</h2>
          <p className="text-gray-600 mb-6">
            Update values using percentage or direct allocation. Changes to child rows will update parent totals, 
            and changes to parent rows will distribute proportionally to children.
          </p>
          
          <HierarchicalTable initialData={initialData} />
        </div>
      </main>
    </div>
  );
}

export default App;