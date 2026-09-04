import React from 'react';
import { MapPin, ArrowRight, Calendar } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function ProjectCard({ project, lang, onSelectProject }) {
  const t = TRANSLATIONS[lang].projects;
  const isEn = lang === 'EN';

  const title = isEn ? (project.titleEn || project.title) : project.title;
  const category = isEn ? (project.categoryEn || project.category) : project.category;
  const location = isEn ? (project.locationEn || project.location) : project.location;

  return (
    <div className="project-card" onClick={() => onSelectProject(project)}>
      <div className="project-img-box">
        <img 
          src={project.mainImage} 
          alt={title} 
          className="project-img" 
        />
        <div className="project-cat-badge">{category}</div>
      </div>

      <div className="project-info-box">
        <div className="project-meta-row">
          <span className="meta-item">
            <MapPin size={13} /> {location}
          </span>
          <span className="meta-item">
            <Calendar size={13} /> {project.year}
          </span>
        </div>

        <h3 className="project-card-title">{title}</h3>
        <p className="project-card-architect">{isEn ? 'Architect:' : 'Mimar:'} {project.architect}</p>

        <div className="project-card-footer">
          <span className="view-link">{t.viewProject}</span>
          <ArrowRight size={14} />
        </div>
      </div>

      <style>{`
        .project-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: var(--transition-smooth);
        }
        .project-card:hover {
          border-color: var(--accent-terracotta);
          box-shadow: 0 16px 36px rgba(0,0,0,0.08);
          transform: translateY(-4px);
        }
        .project-img-box {
          position: relative;
          width: 100%;
          height: 280px;
          overflow: hidden;
          background-color: #EAE8E4;
        }
        .project-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          background-color: #FAF8F5;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .project-card:hover .project-img {
          transform: scale(1.06);
        }
        .project-cat-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          background-color: var(--bg-dark);
          color: #FFFFFF;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 6px 12px;
        }
        .project-info-box {
          padding: 24px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .project-meta-row {
          display: flex;
          gap: 16px;
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-bottom: 10px;
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .project-card-title {
          font-size: 1.6rem;
          line-height: 1.2;
          color: var(--text-main);
          margin-bottom: 6px;
        }
        .project-card-architect {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 20px;
        }
        .project-card-footer {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px solid var(--border-light);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--accent-terracotta);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  );
}
