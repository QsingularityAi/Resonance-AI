document.addEventListener('DOMContentLoaded', function() {
    // Image preview functionality
    function handleImagePreview(inputId, previewClass) {
        const input = document.querySelector(`#${inputId}`);
        if (!input) return;

        input.addEventListener('change', function() {
            const previewContainer = document.querySelector(`.field-${previewClass}`);
            if (!previewContainer) return;

            let preview = previewContainer.querySelector('img');

            // Create img element if it doesn't exist
            if (!preview) {
                preview = document.createElement('img');
                preview.style.maxHeight = '200px';
                preview.style.marginTop = '10px';
                previewContainer.appendChild(preview);
            }

            if (this.files && this.files[0]) {
                const reader = new FileReader();

                reader.onload = function(e) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                };

                reader.readAsDataURL(this.files[0]);
            } else {
                preview.style.display = 'none';
            }
        });
    }

    // Initialize preview handlers
    handleImagePreview('id_logo', 'display_logo_preview');
    handleImagePreview('id_avatar', 'display_avatar_preview');
});