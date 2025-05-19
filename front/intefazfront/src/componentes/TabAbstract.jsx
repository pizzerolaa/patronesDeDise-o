import { useState } from 'react';

export default class TabAbstract {
  constructor(tabs) {
    this.tabs = tabs;
  }
  
  renderContent(activeTab) {
    throw new Error('Método renderContent debe ser implementado por las clases derivadas');
  }
  
  TabComponent() {
    const [activeTab, setActiveTab] = useState(0);
    
    return (
      <div className="tab-container">
        <div className="tab-header">
          {this.tabs.map((tab, index) => (
            <button
              key={index}
              className={`tab-button ${activeTab === index ? 'active' : ''}`}
              onClick={() => setActiveTab(index)}
            >
              {tab.title}
            </button>
          ))}
        </div>
        <div className="tab-content">
          {this.renderContent(activeTab)}
        </div>
      </div>
    );
  }
}