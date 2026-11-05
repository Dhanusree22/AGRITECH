import React, { useState, useMemo } from 'react';
import { runLocalizationAudit, AuditReport } from '../../i18n';
import { useLanguage } from '../../context/LanguageContext';
import { SupportedLanguageCode } from '../../i18n/languageConfig';

interface LocalizationAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocalizationAuditModal: React.FC<LocalizationAuditModalProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage, t } = useLanguage();
  const [selectedAuditLang, setSelectedAuditLang] = useState<SupportedLanguageCode | 'all'>('all');
  const [showMissingOnly, setShowMissingOnly] = useState(false);

  const auditData = useMemo(() => {
    return runLocalizationAudit();
  }, []);

  if (!isOpen) return null;

  const filteredReports = auditData.reports.filter((r) => {
    if (selectedAuditLang !== 'all' && r.languageCode !== selectedAuditLang) return false;
    if (showMissingOnly && r.missingKeys.length === 0) return false;
    return true;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="audit-modal-title"
    >
      <div className="bg-white dark:bg-emerald-950/95 border border-emerald-500/30 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden text-slate-800 dark:text-slate-100">
        {/* Header */}
        <div className="px-6 py-5 border-b border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 bg-emerald-500/10 rounded-xl">🌐</span>
            <div>
              <h2 id="audit-modal-title" className="text-xl font-bold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                {t('common.appName', 'AGRITECH')} Localization Completeness Audit
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  {auditData.overallCompleteness}% Complete
                </span>
              </h2>
              <p className="text-xs text-slate-600 dark:text-emerald-300/80 mt-0.5">
                Automated multi-namespace verification across all 8 supported Indian languages & English.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Global Stats Overview */}
        <div className="px-6 py-4 bg-slate-50/50 dark:bg-emerald-950/50 border-b border-emerald-500/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-white dark:bg-emerald-900/30 rounded-xl border border-emerald-500/20">
            <div className="text-xs text-slate-500 dark:text-emerald-400 font-medium">Total Reference Keys</div>
            <div className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mt-0.5">
              {auditData.totalBaseKeys}
            </div>
          </div>
          <div className="p-3 bg-white dark:bg-emerald-900/30 rounded-xl border border-emerald-500/20">
            <div className="text-xs text-slate-500 dark:text-emerald-400 font-medium">Supported Languages</div>
            <div className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mt-0.5">
              8 Languages
            </div>
          </div>
          <div className="p-3 bg-white dark:bg-emerald-900/30 rounded-xl border border-emerald-500/20">
            <div className="text-xs text-slate-500 dark:text-emerald-400 font-medium">Total Resource Namespaces</div>
            <div className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mt-0.5">
              10 Modules
            </div>
          </div>
          <div className="p-3 bg-white dark:bg-emerald-900/30 rounded-xl border border-emerald-500/20">
            <div className="text-xs text-slate-500 dark:text-emerald-400 font-medium">Active Language</div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 uppercase">
              {language}
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="px-6 py-3 border-b border-emerald-500/10 flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-emerald-950">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-emerald-400">Filter Language:</span>
            <select
              value={selectedAuditLang}
              onChange={(e) => setSelectedAuditLang(e.target.value as SupportedLanguageCode | 'all')}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-emerald-500/30 bg-slate-50 dark:bg-emerald-900/50 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All 8 Languages</option>
              {auditData.reports.map((r) => (
                <option key={r.languageCode} value={r.languageCode}>
                  {r.nativeName} ({r.languageName})
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs flex items-center gap-1.5 cursor-pointer text-slate-600 dark:text-emerald-300">
              <input
                type="checkbox"
                checked={showMissingOnly}
                onChange={(e) => setShowMissingOnly(e.target.checked)}
                className="rounded border-emerald-500/30 text-emerald-600 focus:ring-emerald-500"
              />
              Show Missing Keys Only
            </label>
          </div>
        </div>

        {/* Language Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filteredReports.map((report: AuditReport) => {
            const is100Percent = report.completenessPercentage === 100;
            const isCurrent = language === report.languageCode;

            return (
              <div
                key={report.languageCode}
                className={`p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-900/20'
                    : 'border-emerald-500/20 bg-white dark:bg-emerald-900/10 hover:border-emerald-500/40'
                }`}
              >
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
                      {report.nativeName}
                    </span>
                    <span className="text-xs font-medium text-slate-500 dark:text-emerald-400">
                      ({report.languageName})
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-emerald-950 text-slate-600 dark:text-emerald-400 uppercase">
                      {report.languageCode}
                    </span>
                    {isCurrent && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-emerald-500 text-white">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-bold ${
                        is100Percent
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {report.completenessPercentage}% Complete
                    </span>
                    <button
                      onClick={() => setLanguage(report.languageCode)}
                      className={`text-xs px-3 py-1 rounded-lg font-medium transition ${
                        isCurrent
                          ? 'bg-emerald-600 text-white cursor-default'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      {isCurrent ? 'Current Selection' : 'Switch & Test Live'}
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 dark:bg-emerald-950/80 rounded-full h-2 overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      is100Percent ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${report.completenessPercentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-emerald-400/80">
                  <span>
                    Translated: <strong className="text-slate-700 dark:text-slate-200">{report.translatedKeys}</strong> / {report.totalBaseKeys} keys
                  </span>
                  <span>
                    Missing: <strong className={report.missingKeys.length > 0 ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'}>{report.missingKeys.length}</strong>
                  </span>
                </div>

                {/* Missing Keys Collapsible (if any) */}
                {report.missingKeys.length > 0 && (
                  <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/30 border border-red-500/20 rounded-lg text-xs">
                    <div className="font-semibold text-red-700 dark:text-red-300 mb-1">
                      Unmapped keys in {report.languageName}:
                    </div>
                    <div className="font-mono text-red-600 dark:text-red-400 max-h-24 overflow-y-auto space-y-0.5">
                      {report.missingKeys.map((mk) => (
                        <div key={mk}>• {mk}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-emerald-500/20 bg-slate-50 dark:bg-emerald-950 flex items-center justify-between">
          <div className="text-xs text-slate-600 dark:text-emerald-300/80">
            All 10 namespaces (<code className="text-emerald-600 dark:text-emerald-400">common, home, auth, farmer, buyer, admin, chatbot, voice, reports, validation</code>) loaded from static bundle. Zero cloud API cost.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl shadow-md transition"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
