import type { Transaction } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Shared helper — triggers a file download from a Blob
function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Builds a filename like: transactions_2026-04-02_food_expense
function buildFilename(ext: string, filterDescription?: string): string {
  const today = new Date().toISOString().split('T')[0];
  const suffix = filterDescription ? `_${filterDescription}` : '_all';
  return `transactions_${today}${suffix}.${ext}`;
}

// ── CSV ──────────────────────────────────────────────────────────────────────

export function exportAsCSV(transactions: Transaction[], filterDescription?: string): void {
  if (transactions.length === 0) { alert('No transactions to export'); return; }

  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
  const rows = transactions.map((t) => [
    t.date,
    `"${t.description.replace(/"/g, '""')}"`,
    t.category,
    t.type,
    t.amount.toFixed(2),
  ]);

  const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, buildFilename('csv', filterDescription));
}

// ── PDF ──────────────────────────────────────────────────────────────────────

export function exportAsPDF(transactions: Transaction[], filterDescription?: string): void {
  if (transactions.length === 0) { alert('No transactions to export'); return; }

  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.setTextColor(37, 99, 235); // blue-600
  doc.text('Finance Dashboard', 14, 20);

  // Subtitle
  doc.setFontSize(11);
  doc.setTextColor(107, 114, 128); // gray-500
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.text(`Exported on ${today}  •  ${transactions.length} transaction${transactions.length !== 1 ? 's' : ''}`, 14, 28);

  // Table
  autoTable(doc, {
    startY: 35,
    head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
    body: transactions.map((t) => [
      t.date,
      t.description,
      t.category,
      t.type.charAt(0).toUpperCase() + t.type.slice(1),
      `${t.type === 'income' ? '+' : '-'}$${t.amount.toLocaleString()}`,
    ]),
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    styles: { fontSize: 10, cellPadding: 4 },
    columnStyles: { 4: { halign: 'right' } },
  });

  doc.save(buildFilename('pdf', filterDescription));
}

// ── JSON ─────────────────────────────────────────────────────────────────────

export function exportAsJSON(transactions: Transaction[], filterDescription?: string): void {
  if (transactions.length === 0) { alert('No transactions to export'); return; }

  const json = JSON.stringify(transactions, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  triggerDownload(blob, buildFilename('json', filterDescription));
}
