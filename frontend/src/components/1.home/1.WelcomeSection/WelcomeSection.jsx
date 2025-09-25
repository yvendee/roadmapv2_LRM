// frontend\src\components\1.home\1.WelcomeSection\WelcomeSection.jsx
import React from 'react';
import './WelcomeSection.css'; 

const WelcomeSection = () => {
  return (
    <div className="row mb-3">
      <div className="col-md-12">
        <div className="card bg-100 shadow-none border">
          <div className="welcome-content">
            <h2 className="welcome-title">Welcome to Your Momentum Hub</h2>
            <h3 className="system-title">The Operating System for Scaling with Discipline</h3>
            <p className="description">
            <strong>Momentum OS</strong> turns ambition into disciplined execution. It’s not another plan or tool — it’s a system to run your business with clarity, rhythm, and accountability.
            </p>

            <h4 className="outcomes-title">Why Momentum OS?</h4>
            <p className="description">
            Most companies stall not from lack of ideas, but from:
            </p>
            
            <ul className="outcomes-list">
              <li>Too many priorities, not enough results</li>
              <li>Great people stuck in broken systems</li>
              <li>Firefighting instead of focused execution
              Momentum OS solves this by aligning your team around what matters most.</li>
            </ul>

            <h4 className="outcomes-title">The Four Levers</h4>
            <p className="description">
            Momentum comes from focusing on the right levers:
            </p>
            <ul className="outcomes-list">
              <li><strong>People</strong> – The right talent in the right roles</li>
              <li><strong>Strategy</strong> – Clear choices on where to play and how to win</li>
              <li><strong>Execution</strong> – Discipline and visibility that drive traction</li>
              <li><strong>Cash</strong> – Predictable flow that fuels sustainable growth</li>
            </ul>

            <h4 className="methodology-title">Core Tools</h4>
            <ul className="outcomes-list">
              <li><strong>Momentum Hubstrong</strong> – Your live command center for strategy, execution, and accountability</li>
              <li><strong>Growth Command Center</strong> – Focus on 3–5 growth drivers that power results
              Together, they give you one system to keep strategy alive and execution on track.</li>
            </ul>
            

          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
