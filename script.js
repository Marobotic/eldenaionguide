document.addEventListener('DOMContentLoaded', function() {
    const sidebarNav = document.getElementById('sidebarNav');
    const titleList = document.getElementById('titleList');
    const searchInput = document.getElementById('search');
    const searchResults = document.getElementById('searchResults');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const sidebar = document.getElementById('sidebar');
    const guideContent = document.getElementById('guideContent');
    let sections = [document.getElementById('getting-started')];
    let currentSectionIndex = 0;

    // Load guide content
    fetch('guide.html')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const guideSections = Array.from(doc.querySelectorAll('section'));

            guideSections.forEach(section => {
                guideContent.appendChild(section);
            });

            sections = Array.from(document.querySelectorAll('section'));
            initializeNavigation();
        })
        .catch(error => {
            console.error('Error loading guide content:', error);
        });

    function initializeNavigation() {
        // Build sidebar navigation and title list
        sections.forEach((section, index) => {
            const title = section.getAttribute('title');
            const id = section.id;

            // Add to sidebar
            const sidebarItem = document.createElement('li');
            const sidebarLink = document.createElement('a');
            sidebarLink.href = `#${id}`;
            sidebarLink.textContent = title;
            sidebarLink.addEventListener('click', (e) => {
                e.preventDefault();
                navigateToSection(index);
            });
            sidebarItem.appendChild(sidebarLink);
            sidebarNav.appendChild(sidebarItem);

            // Add to title list (only in getting started)
            if (index > 0) {
                const titleListItem = document.createElement('li');
                const titleListLink = document.createElement('a');
                titleListLink.href = `#${id}`;
                titleListLink.textContent = title;
                titleListLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    navigateToSection(index);
                });
                titleListItem.appendChild(titleListLink);
                titleList.appendChild(titleListItem);
            }
        });

        // Navigation functions
        function navigateToSection(index) {
            // Hide current section
            sections[currentSectionIndex].classList.remove('active');

            // Update current index
            currentSectionIndex = index;

            // Show new section
            sections[currentSectionIndex].classList.add('active');

            // Update URL hash
            window.location.hash = sections[currentSectionIndex].id;

            // Update nav buttons
            updateNavButtons();

            // Update sidebar active link
            updateSidebarActive();

            // Show/hide sidebar based on section
            if (currentSectionIndex === 0) {
                sidebar.classList.remove('visible');
            } else {
                sidebar.classList.add('visible');
            }

            // Scroll to top
            window.scrollTo(0, 0);
        }

        function handleHashChange() {
            const hash = window.location.hash.substring(1);
            if (hash) {
                const sectionIndex = sections.findIndex(section => section.id === hash);
                if (sectionIndex !== -1) {
                    navigateToSection(sectionIndex);
                }
            } else {
                navigateToSection(0); // Default to first section
            }
        }

        // Add event listener for hash changes
        window.addEventListener('hashchange', handleHashChange);

        // Initialize based on current hash
        handleHashChange();

        function updateNavButtons() {
            prevBtn.disabled = currentSectionIndex === 0;
            nextBtn.disabled = currentSectionIndex === sections.length - 1;
        }

        function updateSidebarActive() {
            const links = sidebarNav.querySelectorAll('a');
            links.forEach((link, index) => {
                if (index === currentSectionIndex) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }

        // Button event listeners
        prevBtn.addEventListener('click', () => {
            if (currentSectionIndex > 0) {
                navigateToSection(currentSectionIndex - 1);
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentSectionIndex < sections.length - 1) {
                navigateToSection(currentSectionIndex + 1);
            }
        });

        // Search functionality
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase();
            if (query.length > 0) {
                const results = sections.filter(section => {
                    const title = section.getAttribute('title').toLowerCase();
                    return title.includes(query);
                });

                displaySearchResults(results);
            } else {
                searchResults.style.display = 'none';
            }
        });

        function displaySearchResults(results) {
            searchResults.innerHTML = '';

            if (results.length > 0) {
                results.forEach(section => {
                    const resultItem = document.createElement('a');
                    const title = section.getAttribute('title');
                    resultItem.href = `#${section.id}`;
                    resultItem.textContent = title;
                    resultItem.addEventListener('click', (e) => {
                        e.preventDefault();
                        const index = sections.findIndex(s => s.id === section.id);
                        navigateToSection(index);
                        searchInput.value = '';
                        searchResults.style.display = 'none';
                    });
                    searchResults.appendChild(resultItem);
                });
                searchResults.style.display = 'block';
            } else {
                const noResults = document.createElement('div');
                noResults.textContent = 'No results found';
                noResults.style.padding = '0.5rem 1rem';
                searchResults.appendChild(noResults);
                searchResults.style.display = 'block';
            }
        }

        // Hide search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });

        // Initialize
        updateNavButtons();
        updateSidebarActive();
    }
});

// Mobile menu toggle
const mobileMenuToggle = document.createElement('div');
mobileMenuToggle.className = 'mobile-menu-toggle';
mobileMenuToggle.innerHTML = '☰';
document.querySelector('header').prepend(mobileMenuToggle);

mobileMenuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('visible');
});

// Close sidebar when clicking a link (mobile)
document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth < 768) {
            sidebar.classList.remove('visible');
        }
    });
});