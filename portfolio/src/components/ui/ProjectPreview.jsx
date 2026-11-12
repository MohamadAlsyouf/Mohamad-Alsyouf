import Icon, { BrandMark } from './Icon'

function Dashboard() {
  return (
    <div className="dashboard-mock">
      <aside className="mock-sidebar">
        <BrandMark />
        <span className="mock-wordmark">
          focus<span>360</span>
        </span>
        <div className="mock-nav-item selected">
          <span>▦</span>Overview
        </div>
        <div className="mock-nav-item">
          <span>□</span>Projects
        </div>
        <div className="mock-nav-item">
          <span>◷</span>Schedule
        </div>
        <div className="mock-nav-item">
          <span>⌑</span>Assets
        </div>
        <div className="mock-sidebar-bottom">
          <span className="mock-avatar">MA</span>
          <span>
            Mohamad Alsyouf<small>Workspace admin</small>
          </span>
        </div>
      </aside>
      <div className="mock-main">
        <div className="mock-topbar">
          <span>
            Workspace <span>/</span> Overview
          </span>
          <span className="mock-user">MA</span>
        </div>
        <div className="mock-heading">
          <div>
            <small>PROJECT MANAGEMENT</small>
            <h4>Project overview</h4>
          </div>
          <span className="mock-new">+ New project</span>
        </div>
        <div className="mock-stats">
          {[
            ['Active projects', '24', '+4 this month'],
            ['On track', '92%', 'On schedule'],
            ['Team members', '130+', 'Across departments'],
          ].map(([label, value, note]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
              <small>{note}</small>
            </div>
          ))}
        </div>
        <div className="mock-chart">
          <div className="mock-chart-title">
            <span>Project activity</span>
            <span>THIS WEEK ↗</span>
          </div>
          <div className="chart-grid">
            <div className="chart-bars">
              {[
                32, 48, 43, 68, 57, 82, 94, 76, 89, 100, 87, 112, 123, 106, 138,
              ].map((height, i) => (
                <i key={i} style={{ height: height + 'px' }} />
              ))}
            </div>
          </div>
          <div className="mock-chart-days">
            <span>MON</span>
            <span>TUE</span>
            <span>WED</span>
            <span>THU</span>
            <span>FRI</span>
          </div>
        </div>
        <div className="mock-project-row">
          <span className="mock-project-icon">N</span>
          <span>
            NEXT experience<small>Product & engineering</small>
          </span>
          <span className="mock-progress" />
          <span className="mock-ontrack">On track</span>
        </div>
      </div>
    </div>
  )
}
function HomeExperience() {
  return (
    <div className="home-mock">
      <div className="home-mock-nav">
        <strong>
          NEXT<span>™</span>
        </strong>
        <span>HOME DISCOVERY</span>
        <Icon name="menu" size={14} />
      </div>
      <div className="architecture">
        <div className="architecture-sun" />
        <div className="house-volume house-back" />
        <div className="house-volume house-front">
          <div className="house-windows" />
          <div className="house-door" />
        </div>
        <div className="house-roof" />
        <div className="house-tree tree-one" />
        <div className="house-tree tree-two" />
        <div className="house-ground" />
      </div>
      <div className="home-mock-caption">
        <div>
          <small>AVAILABLE HOMES</small>
          <h4>Find a home.</h4>
        </div>
        <span className="home-mock-arrow">
          <Icon name="right" size={19} />
        </span>
      </div>
      <div className="home-mock-tabs">
        <span className="selected">Explore homes</span>
        <span>Floor plans</span>
        <span>Your favorites</span>
      </div>
    </div>
  )
}
function MobileExperience() {
  return (
    <div className="mobile-mock">
      <div className="phone-halo halo-one" />
      <div className="phone-halo halo-two" />
      <span className="arkan-art-label">
        FAITH-BASED
        <br />
        LEARNING APP
      </span>
      <div className="phone">
        <div className="phone-camera" />
        <div className="phone-status">
          9:41 <span>••• ▰</span>
        </div>
        <div className="phone-content">
          <div className="arkan-brand">
            أركان <span>arkan</span>
          </div>
          <small>FAITH-BASED LEARNING</small>
          <h4>
            Continue
            <br />
            learning.
          </h4>
          <div className="phone-orbit">
            <span>✦</span>
          </div>
          <div className="phone-learning">
            <span>LEARNING PROGRESS</span>
            <strong>Current lesson</strong>
            <span className="phone-progress">
              <i />
            </span>
          </div>
          <div className="phone-tabbar">
            <span>⌂</span>
            <span>▤</span>
            <span>◉</span>
          </div>
        </div>
      </div>
      <div className="mobile-float-label">
        <Icon name="code" size={15} /> React Native & TypeScript
      </div>
    </div>
  )
}
export default function ProjectPreview({ kind }) {
  return (
    <div className={`project-preview preview-${kind}`} aria-hidden="true">
      {kind === 'erp' ? (
        <Dashboard />
      ) : kind === 'next' ? (
        <HomeExperience />
      ) : (
        <MobileExperience />
      )}
      <span className="preview-caption">CONCEPT VISUALIZATION</span>
    </div>
  )
}
