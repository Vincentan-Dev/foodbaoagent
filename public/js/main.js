document.addEventListener('DOMContentLoaded', () => {
    // Prevent infinite image loading loops
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            if (!this.hasAttribute('data-error-handled')) {
                this.setAttribute('data-error-handled', 'true');
                this.src = ''; // Clear the source to stop further attempts
                console.log('Image failed to load:', this.src);
            }
        });
    });
});