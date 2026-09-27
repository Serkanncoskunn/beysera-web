// src/studio/components/StudioSceneSelector.jsx
import React from 'react';
import { ARCHITECTURAL_TEMPLATES } from '../data/templates';
import { Building2, Home, Sofa, Utensils, Layers, Trees, Check } from 'lucide-react';

export default function StudioSceneSelector({
  selectedTemplate,
  onSelectTemplate,
  isEn
}) {
  const getIcon = (type) => {
    switch (type) {
      case 'building': return <Building2 size={16} />;
      case 'sofa': return <Sofa size={16} />;
      case 'utensils': return <Utensils size={16} />;
      case 'home': return <Home size={16} />;
      case 'layers': return <Layers size={16} />;
      case 'trees': return <Trees size={16} />;
      default: return <Building2 size={16} />;
    }
  };

  return (
    <div className="studio-vertical-scene-strip">
      <div className="scene-strip-header">
        <span className="strip-title">{isEn ? 'Scenes' : 'Ortamlar'}</span>
      </div>

      <div className="scene-thumbnails-stack">
        {ARCHITECTURAL_TEMPLATES.map((tmpl) => {
          const isSelected = selectedTemplate && selectedTemplate.id === tmpl.id;
          const previewSrc = tmpl.asset ? tmpl.asset.previewImage : null;

          return (
            <div
              key={tmpl.id}
              className={`scene-thumb-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectTemplate(tmpl)}
              title={isEn ? tmpl.nameEn : tmpl.nameTr}
            >
              <div className="scene-thumb-preview" style={{ background: tmpl.previewGradient }}>
                {previewSrc ? (
                  <img
                    src={previewSrc}
                    alt={tmpl.nameTr}
                    className="scene-thumb-img"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="scene-thumb-icon-overlay">
                    {getIcon(tmpl.thumbnailIcon)}
                  </div>
                )}

                {isSelected && (
                  <div className="scene-selected-badge">
                    <Check size={12} />
                  </div>
                )}
              </div>
              <span className="scene-thumb-name">
                {isEn ? tmpl.nameEn.split('—')[0] : tmpl.nameTr.split('—')[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
