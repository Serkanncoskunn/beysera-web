import React, { useState } from 'react';
import { ArrowRight, Eye, FileText } from 'lucide-react';
import { PROJECTS, PROJECT_CATEGORIES_TR, PROJECT_CATEGORIES_EN } from '../data/projects';
import { TRANSLATIONS } from '../data/translations';
import ProjectCard from './ProjectCard';

export default function ProjectExplorer({ lang, onSelectProject, onNavigateToProjects, onOpenQuoteModal }) {
  const [selectedCat, setSelectedCat] = useState('Tümü');
  const t = TRANSLATIONS[lang ? lang : 'TR'].projects;
  const isEn = lang === 'EN';
  const categoriesList = isEn ? PROJECT_CATEGORIES_EN : PROJECT_CATEGORIES_TR;

  const filteredProjects = PROJECTS.filter((proj) => {
    const projCat = isEn ? (proj.categoryEn || proj.category) : proj.category;
    return selectedCat === 'Tümü' || selectedCat === 'All' ||
      projCat === selectedCat || proj.category === selectedCat;
  });

  return (
    <section id="projects" className="projects-section">
      <div className="container">
        {/* Section Header with Projeleri İncele & Teklif ve Numune Al Side-by-Side */}
        <div className="section-header-flex">
          <div>
            <span className="section-tag">{t.tag}</span>
            <h2 
              className="section-title clickable-title"
              onClick={onNavigateToProjects}
            >
              {t.title}
            </h2>
            <p className="section-subtitle">{t.subtitle}</p>
          </div>

          <div className="header-actions-group">
            <button onClick={onNavigateToProjects} className="btn-outline">
              <Eye size={16} />
              <span>{t.inspectBtn}</span>
              <ArrowRight size={14} />
            </button>

            {/* Teklif ve Numune Al button right next to Projeleri İncele */}
            <button onClick={onOpenQuoteModal} className="btn-primary">
              <FileText size={16} />
              <span>{TRANSLATIONS[lang ? lang : 'TR'].nav.quoteBtn}</span>
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.slice(0, 3).map((proj) => (
            <ProjectCard
              key={proj.id}
              project={proj}
              lang={lang}
              onSelectProject={onSelectProject}
            />
          ))}
        </div>
      </div>

      <style>{`
        .projects-section {
          padding: 90px 0;
          background-color: var(--bg-surface);
          border-top: 1px solid var(--border-light);
        }
        .section-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }
        .clickable-title {
          cursor: pointer;
          transition: color 0.2s;
        }
        .clickable-title:hover {
          color: var(--accent-terracotta);
        }
        .header-actions-group {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .cat-filter-bar {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 40px;
        }
        .cat-pill {
          background-color: var(--bg-primary);
          border: 1px solid var(--border-light);
          padding: 8px 18px;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-muted);
          cursor: pointer;
          transition: var(--transition-smooth);
        }
        .cat-pill:hover, .cat-pill.active {
          background-color: var(--accent-terracotta);
          color: #FFFFFF;
          border-color: var(--accent-terracotta);
        }
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 32px;
        }
      `}</style>
    </section>
  );
}
