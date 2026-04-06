import { useState, useEffect } from 'react';
import { Radio } from 'lucide-react';

interface Target {
  id: number;
  name: string;
  distance: number; // 0 to 100 (0 is hitting the center)
  angle: number;    // 0 to 360 degrees
}

function App() {
  const [targets, setTargets] = useState<Target[]>([
    { id: 1, name: "Database Migrations", distance: 80, angle: 45 },
    { id: 2, name: "Client Meeting", distance: 30, angle: 120 },
  ]);

  // Simulation: Move targets closer over time
  useEffect(() => {
    const interval = setInterval(() => {
      setTargets(prev => prev.map(t => ({
        ...t,
        distance: Math.max(0, t.distance - 0.5) // Targets drift inward
      })));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-emerald-500 flex flex-col items-center justify-center font-mono">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-widest uppercase">Aegis Interception OS</h1>
        <p className="text-xs text-emerald-700">Status: Radar Active - Scanning for Deadlines...</p>
      </div>

      {/* Radar Container */}
      <div className="relative w-[500px] h-[500px] border-2 border-emerald-900 rounded-full flex items-center justify-center bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-emerald-950/20 via-slate-950 to-slate-950">
        
        {/* Radar Rings */}
        <div className="absolute w-full h-full border border-emerald-900/30 rounded-full" />
        <div className="absolute w-2/3 h-2/3 border border-emerald-900/20 rounded-full" />
        <div className="absolute w-1/3 h-1/3 border border-emerald-900/10 rounded-full" />
        
        {/* The Impact Zone (Center) */}
        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.8)]" />

        {/* Rendering Targets */}
        {targets.map(target => {
          // Math: Convert Polar (distance, angle) to Cartesian (x, y)
          const radius = (target.distance / 100) * 250;
          const x = radius * Math.cos((target.angle * Math.PI) / 180);
          const y = radius * Math.sin((target.angle * Math.PI) / 180);

          return (
            <div
              key={target.id}
              className="absolute transition-all duration-1000 ease-linear"
              style={{
                transform: `translate(${x}px, ${y}px)`
              }}
            >
              <div className="group relative flex flex-col items-center">
                <Radio className="text-emerald-400 w-6 h-6 animate-pulse" />
                <span className="absolute top-6 scale-0 group-hover:scale-100 transition-all bg-emerald-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                  {target.name} ({Math.round(target.distance)}m)
                </span>
              </div>
            </div>
          );
        })}

        {/* Scanning Sweep Effect */}
        <div className="absolute w-1/2 h-1/2 bg-gradient-to-tr from-emerald-500/10 to-transparent origin-bottom-right rotate-45 animate-[spin_4s_linear_infinite]" 
             style={{ top: 0, left: 0 }} />
      </div>

      <div className="mt-10 flex gap-4">
        <button className="px-6 py-2 border border-emerald-500 hover:bg-emerald-500 hover:text-black transition-colors uppercase text-sm">
          Launch Interceptor
        </button>
      </div>
    </div>
  );
}

export default App;