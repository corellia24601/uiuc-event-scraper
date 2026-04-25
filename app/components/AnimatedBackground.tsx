'use client';

// Lightweight background: CSS-only radial gradients, no blur, no blend modes.
export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="animated-orb orb-blue" />
      <div className="animated-orb orb-cyan" />
      <div className="animated-orb orb-violet" />
      <style>{`
        .animated-orb {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          opacity: 0.18;
          will-change: transform;
        }
        .orb-blue {
          background: radial-gradient(circle, #3b82f6, transparent 70%);
          top: -150px;
          left: 10%;
          animation: orbFloat1 20s ease-in-out infinite;
        }
        .orb-cyan {
          background: radial-gradient(circle, #06b6d4, transparent 70%);
          top: 30%;
          right: 5%;
          animation: orbFloat2 25s ease-in-out infinite;
        }
        .orb-violet {
          background: radial-gradient(circle, #7c3aed, transparent 70%);
          bottom: -100px;
          left: 40%;
          opacity: 0.12;
          animation: orbFloat3 22s ease-in-out infinite;
        }
        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(80px, 60px); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-60px, -80px); }
        }
        @keyframes orbFloat3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(40px, -60px); }
        }
      `}</style>
    </div>
  );
}
