import { ConfigForm } from './components/ConfigForm';
import { AssetsDisplay } from './components/AssetsDisplay';
import { TestRunner } from './components/TestRunner';

export default function Home() {
  return (
    <main className="container mx-auto p-4 max-w-[1400px]">
      <h1 className="text-3xl font-bold mb-6 text-center">Eval-in-a-Box</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-100px)]">
        {/* Column 1: Config & Input (3 cols) */}
        <div className="md:col-span-3 flex flex-col gap-6 overflow-y-auto pr-2">
          <ConfigForm />
        </div>
        
        {/* Column 2: Assets (5 cols) */}
        <div className="md:col-span-5 flex flex-col gap-6 overflow-y-auto px-2 border-x border-gray-100">
          <AssetsDisplay />
        </div>
        
        {/* Column 3: Results (4 cols) */}
        <div className="md:col-span-4 flex flex-col gap-6 overflow-y-auto pl-2">
          <TestRunner />
        </div>
      </div>
    </main>
  );
}
