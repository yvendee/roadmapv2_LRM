import React, { useEffect, useState } from 'react';
import useLoginStore from '../../store/loginStore';
import API_URL from '../../configs/config';
import crmBarChart from '../../assets/images/webp/crm-bar-chart.webp';
import './Home.css';

const Home = () => {
  const [data, setData] = useState(null);
  const user = useLoginStore((state) => state.user);

  useEffect(() => {
    fetch(`${API_URL}/mock-response1`)
      .then(res => res.json())
      .then(json => setData(json.data));
  }, []);

  return (

    
    <div className="main-content-view">

      {/* <h1 className="text-2xl dark:text-yellow-300">
        This should change color in dark mode
      </h1> */}

      {/* <h2 className="text-xl font-bold mb-4">Home</h2>
      {data ? (
        <table className="table-auto border-collapse border border-gray-400">
          <tbody>
            <tr><td className="border p-2">Name</td><td className="border p-2">{data.name}</td></tr>
            <tr><td className="border p-2">Email</td><td className="border p-2">{data.email}</td></tr>
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )} */}


      <div className="row mb-1">
        <div className="col">
          <div className="card bg-100 shadow-none border">
            <div className="row gx-0 flex-between-center">
              <div className="col-sm-auto inline-center">
                <img src={crmBarChart} alt="" width="90" />
                <h4 className="fw-bold mb-0">Good Afternoon, {user?.fullname ?? 'Guest'}!</h4>
              </div>
            </div>
          </div>
        </div>
      </div>


        
        <div class="row mb-3">
            <div class="col-md-12">
                <div class="card bg-100 shadow-none border">
                    <div class="welcome-content">
                        <h2 class="welcome-title">Welcome to Your Momentum Hub</h2>
                        <h3 class="system-title">The Scaling Up Performance System</h3>
                        <p class="description">
                            The Scaling Up Performance System is designed to help growth-minded businesses gain clarity,
                            alignment, and momentum across the four essential decisions: People, Strategy, Execution, and
                            Cash. Built on the work of Verne Harnish and refined through real-world application, this system
                            provides a practical, disciplined framework to scale your company with confidence. From
                            identifying your long-term vision to executing weekly priorities, the system aligns your team
                            and resources to drive measurable results—faster and with less drama.
                        </p>

                        <h4 class="outcomes-title">Three Constraint Categories:</h4>
                        <ul class="outcomes-list">
                            <li>Internal: Mindset, procrastination, fear, self-doubt, lack of clarity</li>
                            <li>Team-Based: Dysfunction, unclear roles, weak accountability, lack of focus</li>
                            <li>Systemic: Broken processes, unclear priorities, poor follow-through</li>
                        </ul>

                        <h4 class="outcomes-title">Ideal Outcomes for You and Your Business:</h4>
                        <ul class="outcomes-list">
                            <li>Clear long-term vision that energizes the team and sets direction</li>
                            <li>Focused strategy that defines where to play and how to win</li>
                            <li>Alignment across departments around top priorities and key thrusts</li>
                            <li>Strong leadership and a high-performing, accountable team</li>
                            <li>Improved execution through disciplined meeting rhythms and dashboards</li>
                            <li>Predictable growth driven by scalable systems and data-driven decisions</li>
                            <li>Healthy cash flow and stronger margins to fund growth and reduce stress</li>
                            <li>A company culture that supports innovation, ownership, and results</li>
                        </ul>

                        <h4 class="methodology-title">Our Coaching Methodology</h4>
                        <p class="description">
                            Unlike traditional consultants who often prescribe solutions, our coaching methodology is rooted
                            in guided discovery, accountability, and empowerment. We work alongside you and your leadership
                            team to unlock your potential, strengthen decision-making, and build internal capability. Our
                            role isn't to give you all the answers—it's to ask the right questions, provide the right tools,
                            and hold you to the commitments that will elevate your people, accelerate your strategy, and
                            systematize execution. This is about building a company that performs—and a team that thrives.
                        </p>
                    </div>
                </div>
            </div>
        </div>






    </div>
  );
};

export default Home;
