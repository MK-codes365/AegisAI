import { Shield, Cloud, Bell, Bot, Database, Key, Globe, Sliders } from 'lucide-react';
import './SettingsPage.css';

export default function SettingsPage() {
  return (
    <div className="settings-page">
      <div className="settings-grid">
        {/* AI Configuration */}
        <div className="glass-card-static settings-card animate-fade-in-up">
          <div className="settings-card-header">
            <div className="settings-card-icon ai-icon">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="settings-card-title">AI Engine Configuration</h3>
              <p className="settings-card-desc">Configure AI analysis behavior</p>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Auto-Analysis</span>
                <span className="setting-desc">Automatically analyze new tickets with AI</span>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Sentiment Detection</span>
                <span className="setting-desc">Use Amazon Comprehend for sentiment analysis</span>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Auto-Categorization</span>
                <span className="setting-desc">AI assigns categories automatically</span>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Response Suggestions</span>
                <span className="setting-desc">Generate AI-powered reply suggestions</span>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="form-group">
              <label className="form-label">AI Model</label>
              <select className="form-select">
                <option>Amazon Bedrock - Claude 3 Haiku</option>
                <option>Amazon Bedrock - Claude 3 Sonnet</option>
                <option>Amazon Bedrock - Titan Text</option>
              </select>
            </div>
          </div>
        </div>

        {/* AWS Configuration */}
        <div className="glass-card-static settings-card animate-fade-in-up">
          <div className="settings-card-header">
            <div className="settings-card-icon aws-icon">
              <Cloud size={20} />
            </div>
            <div>
              <h3 className="settings-card-title">AWS Configuration</h3>
              <p className="settings-card-desc">Cloud service settings</p>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="form-group">
              <label className="form-label">AWS Region</label>
              <select className="form-select">
                <option>us-east-1 (N. Virginia)</option>
                <option>us-west-2 (Oregon)</option>
                <option>eu-west-1 (Ireland)</option>
                <option>ap-southeast-1 (Singapore)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">DynamoDB Table</label>
              <input className="form-input" value="ticket-system-tickets" readOnly />
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">SNS Escalation Alerts</span>
                <span className="setting-desc">Notify via Amazon SNS on escalation</span>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="aws-status">
              <div className="aws-status-item">
                <Database size={14} />
                <span>DynamoDB</span>
                <span className="aws-badge connected">Connected</span>
              </div>
              <div className="aws-status-item">
                <Bot size={14} />
                <span>Bedrock</span>
                <span className="aws-badge connected">Active</span>
              </div>
              <div className="aws-status-item">
                <Bell size={14} />
                <span>SNS</span>
                <span className="aws-badge connected">Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Escalation Rules */}
        <div className="glass-card-static settings-card animate-fade-in-up">
          <div className="settings-card-header">
            <div className="settings-card-icon escalation-icon">
              <Sliders size={20} />
            </div>
            <div>
              <h3 className="settings-card-title">Escalation Rules</h3>
              <p className="settings-card-desc">Configure auto-escalation behavior</p>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Auto-Escalate Critical</span>
                <span className="setting-desc">Automatically escalate critical tickets</span>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="form-group">
              <label className="form-label">SLA Threshold (hours)</label>
              <input className="form-input" type="number" defaultValue={4} />
            </div>
            <div className="form-group">
              <label className="form-label">Escalation Email</label>
              <input className="form-input" type="email" placeholder="team-lead@company.com" />
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Duplicate Detection</span>
                <span className="setting-desc">Alert when similar tickets detected</span>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="glass-card-static settings-card animate-fade-in-up">
          <div className="settings-card-header">
            <div className="settings-card-icon security-icon">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="settings-card-title">Security & Access</h3>
              <p className="settings-card-desc">Authentication and permissions</p>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Amazon Cognito Auth</span>
                <span className="setting-desc">User authentication via Cognito</span>
              </div>
              <label className="toggle">
                <input type="checkbox" />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">API Key Authentication</span>
                <span className="setting-desc">Require API key for external access</span>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="form-group">
              <label className="form-label">API Endpoint</label>
              <div className="api-key-field">
                <input className="form-input" value="https://api.ticketai.example.com/v1" readOnly />
                <button className="btn btn-secondary btn-sm">
                  <Key size={13} /> Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
