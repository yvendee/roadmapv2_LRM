// frontend\src\components\11.coaching-checklist\2.CollapsiblePanels\CollapsiblePanels.jsx
import React from 'react';
import './CollapsiblePanels.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronUp,
  faCheckSquare,
  faSquare,
  faHandshake,
  faUserTie,
  faBullseye,
  faCheckSquare as faCheckSquareIcon,
  faMoneyBillWave,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';

import useAccordionChecklistStore from '../../../store/left-lower-content/11.coaching-checklist/2.collapsiblePanelsStore';

const CollapsiblePanels = () => {
  const { panels, togglePanel, updateItemStatus } = useAccordionChecklistStore();

  // Map icon string names from API to real FontAwesome icon objects
  const iconMap = {
    faHandshake: faHandshake,
    faUserTie: faUserTie,
    faBullseye: faBullseye,
    faCheckSquare: faCheckSquareIcon,
    faMoneyBillWave: faMoneyBillWave,
    faChartLine: faChartLine,
  };

  return (
    <div className="accordion-container">
      {panels.map((panel) => {
        const mappedIcon = iconMap[panel.icon] || faCheckSquare;

        return (
          <div key={panel.id} className="accordion-panel">
            <div className="accordion-header" onClick={() => togglePanel(panel.id)}>
              <div className="accordion-left always-black">
                <FontAwesomeIcon icon={mappedIcon} className="accordion-icon" />
                <span>{panel.title}</span>
              </div>
              <FontAwesomeIcon
                icon={panel.expanded ? faChevronUp : faChevronDown}
                className="accordion-chevron"
              />
            </div>

            {panel.expanded && (
              <div className="accordion-content always-black">
                <ul>
                  {panel.items.map((item) => (
                    <li key={item.id} className="accordion-item">
                      <FontAwesomeIcon
                        icon={item.completed ? faCheckSquare : faSquare}
                        className="item-checkbox"
                        onClick={() =>
                          updateItemStatus(panel.id, item.id, !item.completed)
                        }
                      />
                      <span className={item.completed ? 'completed' : ''}>
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CollapsiblePanels;
