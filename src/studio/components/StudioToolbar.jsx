// src/studio/components/StudioToolbar.jsx
import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Download } from 'lucide-react';

export default function StudioToolbar({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetView,
  onDownloadSnapshot,
  template,
  product,
  isEn
}) {
  return (
    <div className="studio-canvas-toolbar">
      <div className="toolbar-group">
        <button
          className="toolbar-btn"
          onClick={onZoomOut}
          title={isEn ? 'Zoom Out' : 'Uzaklas'}
          aria-label="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>
        <span className="toolbar-zoom-label">{Math.round(zoom * 100)}%</span>
        <button
          className="toolbar-btn"
          onClick={onZoomIn}
          title={isEn ? 'Zoom In' : 'Yakinlas'}
          aria-label="Zoom In"
        >
          <ZoomIn size={16} />
        </button>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-group">
        <button
          className="toolbar-btn"
          onClick={onResetView}
          title={isEn ? 'Reset View & Scale' : 'Gorunumu ve Olcegi Sifirla'}
        >
          <RotateCcw size={16} />
          <span className="toolbar-btn-text">{isEn ? 'Reset' : 'Sıfırla'}</span>
        </button>

        {onDownloadSnapshot && (
          <button
            className="toolbar-btn"
            onClick={onDownloadSnapshot}
            title={isEn ? 'Download Architectural Snapshot (PNG)' : 'Gorseli Indir (PNG)'}
          >
            <Download size={16} />
            <span className="toolbar-btn-text">{isEn ? 'Download' : 'İndir'}</span>
          </button>
        )}
      </div>

      {template && (
        <div className="toolbar-template-badge" title={template.descriptionTr}>
          <span className="badge-tag">{template.tagTr}</span>
          <span className="badge-name">{isEn ? template.nameEn : template.nameTr}</span>
        </div>
      )}
    </div>
  );
}
