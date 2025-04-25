/**
 * Blacklist Pattern Widget JavaScript
 * 
 * Funktionalität für das benutzerdefinierte Blacklist-Pattern-Widget:
 * - Hinzufügen neuer Pattern-Eingabefelder
 * - Entfernen von Pattern-Eingabefeldern
 * - Serialisieren der Daten beim Formular-Submit
 * - Validierung der Eingaben
 */
document.addEventListener('DOMContentLoaded', function() {
    // Alle Blacklist-Pattern-Widget-Container finden
    const patternWidgetContainers = document.querySelectorAll('.blacklist-pattern-widget-container');
    
    patternWidgetContainers.forEach(function(container) {
        const hiddenInput = container.querySelector('input[type="hidden"]');
        const itemsContainer = container.querySelector('.blacklist-pattern-items');
        const addButton = container.querySelector('.blacklist-pattern-add-btn');
        
        if (!hiddenInput || !itemsContainer || !addButton) return;
        
        // Event-Listener für den "Hinzufügen"-Button
        addButton.addEventListener('click', function() {
            addPatternItem(itemsContainer, hiddenInput);
        });
        
        // Event-Delegation für "Entfernen"-Buttons
        itemsContainer.addEventListener('click', function(event) {
            if (event.target.classList.contains('blacklist-pattern-remove-btn')) {
                const item = event.target.closest('.blacklist-pattern-item');
                if (item) {
                    removePatternItem(item, itemsContainer, hiddenInput);
                }
            }
        });
        
        // Event-Listener für Änderungen an Eingabefeldern
        itemsContainer.addEventListener('input', function(event) {
            if (event.target.classList.contains('blacklist-pattern-input')) {
                updateHiddenInput(itemsContainer, hiddenInput);
            }
        });
        
        // Event-Listener für das Formular-Submit
        const form = container.closest('form');
        if (form) {
            form.addEventListener('submit', function(event) {
                // Validierung vor dem Submit
                if (!validateAllPatterns(itemsContainer)) {
                    event.preventDefault();
                    return false;
                }
                updateHiddenInput(itemsContainer, hiddenInput);
            });
        }
    });
    
    /**
     * Fügt ein neues Pattern-Eingabefeld hinzu
     */
    function addPatternItem(itemsContainer, hiddenInput) {
        const itemCount = itemsContainer.querySelectorAll('.blacklist-pattern-item').length;
        const newItem = document.createElement('div');
        newItem.className = 'blacklist-pattern-item';
        newItem.dataset.index = itemCount;
        
        newItem.innerHTML = `
            <input type="text" class="blacklist-pattern-input" 
                   placeholder="z.B. *.example.com/* oder https://example.com/private/*" required>
            <button type="button" class="blacklist-pattern-remove-btn">Entfernen</button>
        `;
        
        itemsContainer.appendChild(newItem);
        updateHiddenInput(itemsContainer, hiddenInput);
        
        // Fokus auf das neue Eingabefeld setzen
        const input = newItem.querySelector('input');
        if (input) {
            input.focus();
        }
    }
    
    /**
     * Entfernt ein Pattern-Eingabefeld
     */
    function removePatternItem(item, itemsContainer, hiddenInput) {
        // Animation für das Entfernen
        item.style.transition = 'opacity 0.3s, transform 0.3s';
        item.style.opacity = '0';
        item.style.transform = 'translateX(10px)';
        
        setTimeout(function() {
            item.remove();
            updateHiddenInput(itemsContainer, hiddenInput);
        }, 300);
    }
    
    /**
     * Aktualisiert das versteckte Eingabefeld mit den serialisierten Pattern-Daten
     */
    function updateHiddenInput(itemsContainer, hiddenInput) {
        const items = itemsContainer.querySelectorAll('.blacklist-pattern-item');
        const patterns = [];
        
        items.forEach(function(item) {
            const input = item.querySelector('.blacklist-pattern-input');
            
            if (input && input.value.trim()) {
                patterns.push(input.value.trim());
            }
        });
        
        hiddenInput.value = JSON.stringify(patterns);
    }
    
    /**
     * Validiert alle Pattern-Eingabefelder
     */
    function validateAllPatterns(itemsContainer) {
        const items = itemsContainer.querySelectorAll('.blacklist-pattern-item');
        let isValid = true;
        
        items.forEach(function(item) {
            const input = item.querySelector('.blacklist-pattern-input');
            
            if (input) {
                if (input.required && !input.value.trim()) {
                    markAsInvalid(input, 'Dieses Feld ist erforderlich');
                    isValid = false;
                } else if (!isValidPattern(input.value.trim())) {
                    markAsInvalid(input, 'Ungültiges URL-Muster');
                    isValid = false;
                } else {
                    markAsValid(input);
                }
            }
        });
        
        return isValid;
    }
    
    /**
     * Markiert ein Eingabefeld als ungültig
     */
    function markAsInvalid(input, message) {
        input.classList.add('error');
        input.title = message;
        
        // Kurze Animation, um auf den Fehler aufmerksam zu machen
        input.style.transition = 'background-color 0.2s';
        input.style.backgroundColor = 'rgba(244, 67, 54, 0.1)';
        
        setTimeout(function() {
            input.style.backgroundColor = '';
        }, 300);
    }
    
    /**
     * Markiert ein Eingabefeld als gültig
     */
    function markAsValid(input) {
        input.classList.remove('error');
        input.title = '';
    }
    
    /**
     * Überprüft, ob ein Pattern gültig ist
     * Akzeptiert Wildcards und URL-Muster
     */
    function isValidPattern(pattern) {
        if (!pattern) return false;
        
        // Einfache Validierung für URL-Muster
        // Erlaubt Wildcards wie *.example.com/*, */gfgh* oder https://example.com/private/*
        
        // Prüfen auf ungültige Zeichen
        const invalidChars = /[^a-zA-Z0-9-_./:*?&=]/g;
        if (invalidChars.test(pattern)) {
            return false;
        }
        
        // Wir entfernen die Bedingung, dass ein Punkt oder :// enthalten sein muss,
        // um Muster wie */gfgh* zu erlauben
        
        return true;
    }
    
    // Event-Listener für Eingabefelder hinzufügen
    function setupInputValidation(itemsContainer) {
        itemsContainer.addEventListener('blur', function(event) {
            if (event.target.classList.contains('blacklist-pattern-input')) {
                const input = event.target;
                
                if (input.required && !input.value.trim()) {
                    markAsInvalid(input, 'Dieses Feld ist erforderlich');
                } else if (!isValidPattern(input.value.trim())) {
                    markAsInvalid(input, 'Ungültiges URL-Muster');
                } else {
                    markAsValid(input);
                }
            }
        }, true);
        
        // Fehlerklasse entfernen, wenn der Benutzer beginnt zu tippen
        itemsContainer.addEventListener('input', function(event) {
            if (event.target.classList.contains('blacklist-pattern-input')) {
                event.target.classList.remove('error');
            }
        });
    }
    
    // Validierung für alle Container einrichten
    patternWidgetContainers.forEach(function(container) {
        const itemsContainer = container.querySelector('.blacklist-pattern-items');
        if (itemsContainer) {
            setupInputValidation(itemsContainer);
        }
    });
});