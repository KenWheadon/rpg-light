import EventBus from '../EventBus.js';

export default class Exporter {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.saveBtn = document.getElementById('save-btn');
    this.exportArea = document.getElementById('export-area');
    this.textarea = document.getElementById('export-textarea');
    this.copyBtn = document.getElementById('copy-btn');
    this.closeBtn = document.getElementById('close-export-btn');

    this.saveBtn.addEventListener('click', () => this.showExport());
    this.copyBtn.addEventListener('click', () => this.copyToClipboard());
    this.closeBtn.addEventListener('click', () => this.exportArea.classList.add('hidden'));
  }

  showExport() {
    const data = this.stateManager.getData();
    this.textarea.value = JSON.stringify(data, null, 2);
    this.exportArea.classList.remove('hidden');
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.textarea.value).then(() => {
      const orig = this.copyBtn.textContent;
      this.copyBtn.textContent = '✅ Copied!';
      setTimeout(() => this.copyBtn.textContent = orig, 1500);
    });
  }
}