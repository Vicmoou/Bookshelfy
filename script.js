// Note App - Main JavaScript File

class NoteApp {
    constructor() {
        this.notes = [];
        this.currentNote = null;
        this.currentTheme = 'light';
        this.autoSaveInterval = null;
        this.searchTimeout = null;
        
        // Initialize the app
        this.init();
    }

    init() {
        this.loadNotes();
        this.loadTheme();
        this.setupEventListeners();
        this.renderNotesList();
        this.updateStats();
        this.showWelcomeScreen();
    }

    // Local Storage Management
    loadNotes() {
        try {
            const savedNotes = localStorage.getItem('notepad_notes');
            this.notes = savedNotes ? JSON.parse(savedNotes) : [];
        } catch (error) {
            console.error('Error loading notes:', error);
            this.notes = [];
        }
    }

    saveNotes() {
        try {
            localStorage.setItem('notepad_notes', JSON.stringify(this.notes));
        } catch (error) {
            console.error('Error saving notes:', error);
        }
    }

    loadTheme() {
        try {
            const savedTheme = localStorage.getItem('notepad_theme');
            this.currentTheme = savedTheme || 'light';
            this.applyTheme(this.currentTheme);
        } catch (error) {
            console.error('Error loading theme:', error);
        }
    }

    saveTheme() {
        try {
            localStorage.setItem('notepad_theme', this.currentTheme);
        } catch (error) {
            console.error('Error saving theme:', error);
        }
    }

    // Theme Management
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        this.saveTheme();
    }

    // Note Management
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    createNote(title = 'Untitled Note', content = '', tags = []) {
        const note = {
            id: this.generateId(),
            title: title || 'Untitled Note',
            content: content,
            tags: Array.isArray(tags) ? tags : [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.notes.unshift(note);
        this.saveNotes();
        this.renderNotesList();
        this.updateStats();
        return note;
    }

    updateNote(noteId, updates) {
        const noteIndex = this.notes.findIndex(note => note.id === noteId);
        if (noteIndex !== -1) {
            this.notes[noteIndex] = {
                ...this.notes[noteIndex],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.saveNotes();
            this.renderNotesList();
            this.updateLastSaved();
        }
    }

    deleteNote(noteId) {
        this.notes = this.notes.filter(note => note.id !== noteId);
        this.saveNotes();
        this.renderNotesList();
        this.updateStats();

        if (this.currentNote && this.currentNote.id === noteId) {
            this.currentNote = null;
            this.showWelcomeScreen();
        }
    }

    selectNote(noteId) {
        const note = this.notes.find(note => note.id === noteId);
        if (note) {
            this.currentNote = note;
            this.showNoteEditor();
            this.populateEditor(note);
            this.updateActiveNote();
            this.startAutoSave();
        }
    }

    // UI Management
    showWelcomeScreen() {
        document.getElementById('welcomeScreen').style.display = 'flex';
        document.getElementById('noteEditor').style.display = 'none';
    }

    showNoteEditor() {
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('noteEditor').style.display = 'flex';
    }

    populateEditor(note) {
        document.getElementById('noteTitle').value = note.title;
        document.getElementById('noteContent').value = note.content;
        document.getElementById('noteTags').value = note.tags.join(', ');
        document.getElementById('deleteNoteBtn').style.display = 'block';
        this.updateWordCount();
    }

    clearEditor() {
        document.getElementById('noteTitle').value = '';
        document.getElementById('noteContent').value = '';
        document.getElementById('noteTags').value = '';
        document.getElementById('deleteNoteBtn').style.display = 'none';
        this.updateWordCount();
    }

    updateActiveNote() {
        document.querySelectorAll('.note-item').forEach(item => {
            item.classList.remove('active');
        });

        if (this.currentNote) {
            const activeItem = document.querySelector(`[data-note-id="${this.currentNote.id}"]`);
            if (activeItem) {
                activeItem.classList.add('active');
            }
        }
    }

    updateWordCount() {
        const content = document.getElementById('noteContent').value;
        const wordCount = content.trim() === '' ? 0 : content.trim().split(/\s+/).length;
        document.getElementById('wordCount').textContent = `${wordCount} words`;
    }

    updateLastSaved() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        document.getElementById('lastSaved').textContent = `Saved at ${timeString}`;
    }

    updateStats() {
        document.getElementById('totalNotes').textContent = this.notes.length;
    }

    // Auto-save functionality
    startAutoSave() {
        this.stopAutoSave();
        this.autoSaveInterval = setInterval(() => {
            this.saveCurrentNote();
        }, 2000); // Auto-save every 2 seconds
    }

    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
    }

    saveCurrentNote() {
        if (!this.currentNote) return;

        const title = document.getElementById('noteTitle').value.trim() || 'Untitled Note';
        const content = document.getElementById('noteContent').value;
        const tagsInput = document.getElementById('noteTags').value;
        const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

        // Only save if there are changes
        if (title !== this.currentNote.title || 
            content !== this.currentNote.content || 
            JSON.stringify(tags) !== JSON.stringify(this.currentNote.tags)) {
            
            this.updateNote(this.currentNote.id, {
                title,
                content,
                tags
            });
        }
    }

    // Search functionality
    searchNotes(query) {
        const searchResults = this.notes.filter(note => {
            const searchIn = (note.title + ' ' + note.content + ' ' + note.tags.join(' ')).toLowerCase();
            return searchIn.includes(query.toLowerCase());
        });
        this.renderNotesList(searchResults);
    }

    // Render functions
    renderNotesList(notesToRender = this.notes) {
        const notesList = document.getElementById('notesList');
        
        if (notesToRender.length === 0) {
            notesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-sticky-note"></i>
                    <h3>No notes found</h3>
                    <p>${this.notes.length === 0 ? 'Create your first note to get started' : 'Try a different search term'}</p>
                </div>
            `;
            return;
        }

        notesList.innerHTML = notesToRender.map(note => {
            const preview = this.truncateText(note.content, 100);
            const tagsHtml = note.tags.length > 0 ? 
                `<div class="note-tags">
                    ${note.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    ${note.tags.length > 3 ? `<span class="tag">+${note.tags.length - 3}</span>` : ''}
                </div>` : '';

            return `
                <div class="note-item fade-in" data-note-id="${note.id}">
                    <div class="note-item-title">${this.escapeHtml(note.title)}</div>
                    <div class="note-preview">${this.escapeHtml(preview)}</div>
                    <div class="note-meta">
                        <span>${this.formatDate(note.updatedAt)}</span>
                        ${tagsHtml}
                    </div>
                </div>
            `;
        }).join('');

        this.updateActiveNote();
        this.attachNoteListeners();
    }

    attachNoteListeners() {
        document.querySelectorAll('.note-item').forEach(item => {
            item.addEventListener('click', () => {
                const noteId = item.dataset.noteId;
                this.selectNote(noteId);
            });
        });
    }

    // Export functionality
    exportNotes() {
        const exportData = {
            notes: this.notes,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `notepad-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        this.showToast('Notes exported successfully!');
    }

    // Delete confirmation modal
    showDeleteModal() {
        if (!this.currentNote) return;
        document.getElementById('deleteModal').classList.add('active');
    }

    hideDeleteModal() {
        document.getElementById('deleteModal').classList.remove('active');
    }

    confirmDelete() {
        if (!this.currentNote) return;
        this.deleteNote(this.currentNote.id);
        this.hideDeleteModal();
        this.showToast('Note deleted successfully!');
    }

    // Toast notifications
    showToast(message) {
        // Create toast if it doesn't exist
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.style.cssText = `
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                background-color: var(--text-primary);
                color: var(--background-color);
                padding: 1rem 1.5rem;
                border-radius: var(--radius-md);
                box-shadow: var(--shadow-lg);
                z-index: 1001;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.3s ease;
                font-size: 0.875rem;
                font-weight: 500;
            `;
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
        }, 3000);
    }

    // Event Listeners
    setupEventListeners() {
        // New note buttons
        document.getElementById('newNoteBtn').addEventListener('click', () => this.handleNewNote());
        document.getElementById('welcomeNewNoteBtn').addEventListener('click', () => this.handleNewNote());

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // Export button
        document.getElementById('exportBtn').addEventListener('click', () => this.exportNotes());

        // Search input
        document.getElementById('searchInput').addEventListener('input', (e) => {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.searchNotes(e.target.value);
            }, 300);
        });

        // Editor inputs
        document.getElementById('noteTitle').addEventListener('input', () => this.updateWordCount());
        document.getElementById('noteContent').addEventListener('input', () => this.updateWordCount());

        // Delete note button
        document.getElementById('deleteNoteBtn').addEventListener('click', () => this.showDeleteModal());

        // Modal buttons
        document.getElementById('cancelDeleteBtn').addEventListener('click', () => this.hideDeleteModal());
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => this.confirmDelete());

        // Close modal on backdrop click
        document.getElementById('deleteModal').addEventListener('click', (e) => {
            if (e.target.id === 'deleteModal') {
                this.hideDeleteModal();
            }
        });

        // Handle window beforeunload to save current note
        window.addEventListener('beforeunload', () => {
            this.saveCurrentNote();
            this.stopAutoSave();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + N: New note
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                this.handleNewNote();
            }
            
            // Ctrl/Cmd + S: Save note (manual save)
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.saveCurrentNote();
                this.updateLastSaved();
            }

            // Ctrl/Cmd + /: Focus search
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                document.getElementById('searchInput').focus();
            }

            // Escape: Close modal
            if (e.key === 'Escape') {
                this.hideDeleteModal();
            }
        });
    }

    handleNewNote() {
        // Save current note if editing
        if (this.currentNote) {
            this.saveCurrentNote();
        }

        // Create new note
        const newNote = this.createNote();
        this.currentNote = newNote;
        this.showNoteEditor();
        this.clearEditor();
        this.updateActiveNote();
        this.startAutoSave();

        // Focus on title input
        document.getElementById('noteTitle').focus();
    }

    // Utility functions
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)}h ago`;
        } else if (diffInHours < 24 * 7) {
            return `${Math.floor(diffInHours / 24)}d ago`;
        } else {
            return date.toLocaleDateString();
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.noteApp = new NoteApp();
});

// Handle mobile responsiveness
function handleMobileMenu() {
    // This can be expanded for mobile sidebar toggle if needed
    const sidebar = document.querySelector('.sidebar');
    const isActive = sidebar.classList.contains('active');
    sidebar.classList.toggle('active', !isActive);
}