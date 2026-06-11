.tl-container { position: relative; padding: 8px 0; }
.tl-container::before {
  content: '';
  position: absolute;
  left: 50%; top: 0; bottom: 0;
  width: 1px;
  background: var(--border-mid);
  transform: translateX(-50%);
}

.tl-item {
  display: flex; justify-content: flex-end;
  margin-bottom: 24px; position: relative;
  padding-right: calc(50% + 26px);
}
.tl-item--right { justify-content: flex-start; padding-right: 0; padding-left: calc(50% + 26px); }

.tl-dot {
  position: absolute; left: 50%; top: 14px;
  transform: translateX(-50%);
  width: 26px; height: 26px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  z-index: 1;
  border: 1px solid var(--border);
  background: var(--bg-card);
  box-shadow: var(--shadow-sm);
}
.tl-dot-icon { font-size: 0.72rem; opacity: 0.85; }
.tl-dot--warm   .tl-dot-icon { color: var(--accent-warm); }
.tl-dot--cool   .tl-dot-icon { color: var(--accent-cool); }
.tl-dot--green  .tl-dot-icon { color: var(--accent-green); }
.tl-dot--purple .tl-dot-icon { color: var(--accent-purple); }

.tl-content { max-width: 260px; padding: 14px 18px; }
.tl-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 7px; flex-wrap: wrap; }
.tl-date { font-family: var(--font-num); font-size: 0.80rem; color: var(--text-muted); font-style: italic; }
.tl-text { font-family: var(--font-serif); font-size: 0.87rem; line-height: 1.85; color: var(--text-secondary); }

@media (max-width: 768px) {
  .tl-container::before { left: 16px; }
  .tl-item, .tl-item--right { justify-content: flex-start; padding-left: 44px; padding-right: 0; }
  .tl-dot { left: 16px; }
  .tl-content { max-width: 100%; }
}
