/**
 * Cookie Widget JavaScript
 * 
 * Funktionalität für das benutzerdefinierte Cookie-Widget:
 * - Hinzufügen neuer Cookie-Zeilen
 * - Entfernen von Cookie-Zeilen
 * - Serialisieren der Daten beim Formular-Submit
 */
document.addEventListener('DOMContentLoaded', function() {
    // Alle Cookie-Widget-Container finden
    const cookieWidgetContainers = document.querySelectorAll('.cookie-widget-container');
    
    cookieWidgetContainers.forEach(function(container) {
        const hiddenInput = container.querySelector('input[type="hidden"]');
        const tbody = container.querySelector('tbody');
        const addButton = container.querySelector('.cookie-add-btn');
        
        if (!hiddenInput || !tbody || !addButton) return;
        
        // Event-Listener für den "Hinzufügen"-Button
        addButton.addEventListener('click', function() {
            addCookieRow(tbody, hiddenInput);
        });
        
        // Event-Delegation für "Entfernen"-Buttons
        tbody.addEventListener('click', function(event) {
            if (event.target.classList.contains('cookie-remove-btn')) {
                const row = event.target.closest('.cookie-row');
                if (row) {
                    removeCookieRow(row, tbody, hiddenInput);
                }
            }
        });
        
        // Event-Listener für Änderungen an Eingabefeldern
        tbody.addEventListener('input', function(event) {
            if (event.target.classList.contains('cookie-name') || 
                event.target.classList.contains('cookie-value') || 
                event.target.classList.contains('cookie-url')) {
                updateHiddenInput(tbody, hiddenInput);
            }
        });
        
        // Event-Listener für das Formular-Submit
        const form = container.closest('form');
        if (form) {
            form.addEventListener('submit', function() {
                updateHiddenInput(tbody, hiddenInput);
            });
        }
    });
    
    /**
     * Fügt eine neue Cookie-Zeile zur Tabelle hinzu
     */
    function addCookieRow(tbody, hiddenInput) {
        const rowCount = tbody.querySelectorAll('.cookie-row').length;
        const newRow = document.createElement('tr');
        newRow.className = 'cookie-row';
        newRow.dataset.index = rowCount;
        
        newRow.innerHTML = `
            <td>
                <input type="text" class="cookie-name" placeholder="Cookie-Name" required>
            </td>
            <td>
                <input type="text" class="cookie-value" placeholder="Cookie-Wert" required>
            </td>
            <td>
                <input type="url" class="cookie-url" placeholder="https://example.com" required>
            </td>
            <td>
                <button type="button" class="cookie-remove-btn">Entfernen</button>
            </td>
        `;
        
        tbody.appendChild(newRow);
        updateHiddenInput(tbody, hiddenInput);
        
        // Fokus auf das erste Eingabefeld der neuen Zeile setzen
        const firstInput = newRow.querySelector('input');
        if (firstInput) {
            firstInput.focus();
        }
    }
    
    /**
     * Entfernt eine Cookie-Zeile aus der Tabelle
     */
    function removeCookieRow(row, tbody, hiddenInput) {
        // Animation für das Entfernen
        row.style.transition = 'opacity 0.3s';
        row.style.opacity = '0';
        
        setTimeout(function() {
            row.remove();
            updateHiddenInput(tbody, hiddenInput);
        }, 300);
    }
    
    /**
     * Aktualisiert das versteckte Eingabefeld mit den serialisierten Cookie-Daten
     */
    function updateHiddenInput(tbody, hiddenInput) {
        const rows = tbody.querySelectorAll('.cookie-row');
        const cookies = [];
        
        rows.forEach(function(row) {
            const nameInput = row.querySelector('.cookie-name');
            const valueInput = row.querySelector('.cookie-value');
            const urlInput = row.querySelector('.cookie-url');
            
            if (nameInput && valueInput && urlInput) {
                cookies.push({
                    name: nameInput.value.trim(),
                    value: valueInput.value.trim(),
                    url: urlInput.value.trim()
                });
            }
        });
        
        hiddenInput.value = JSON.stringify(cookies);
        
        // Validierung der Eingabefelder
        validateInputs(tbody);
    }
    
    /**
     * Validiert die Eingabefelder und zeigt Fehler an
     */
    function validateInputs(tbody) {
        const rows = tbody.querySelectorAll('.cookie-row');
        
        rows.forEach(function(row) {
            const inputs = row.querySelectorAll('input');
            
            inputs.forEach(function(input) {
                // Validierung beim Verlassen des Feldes
                input.addEventListener('blur', function() {
                    if (input.required && !input.value.trim()) {
                        input.classList.add('error');
                        input.title = 'Dieses Feld ist erforderlich';
                    } else if (input.type === 'url' && input.value.trim() && !isValidUrl(input.value)) {
                        input.classList.add('error');
                        input.title = 'Bitte geben Sie eine gültige URL ein';
                    } else {
                        input.classList.remove('error');
                        input.title = '';
                    }
                });
                
                // Fehlerklasse entfernen, wenn der Benutzer beginnt zu tippen
                input.addEventListener('input', function() {
                    input.classList.remove('error');
                });
            });
        });
    }
    
    /**
     * Überprüft, ob eine URL gültig ist
     */
    function isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    }
});