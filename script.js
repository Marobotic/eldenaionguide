// Collapsible sidebar categories functionality and highlighting
document.addEventListener('DOMContentLoaded', function() {
    const categories = document.querySelectorAll('.category');
    const sidebarLinks = document.querySelectorAll('.subcategory-link');
    
    // Collapsible categories functionality
    categories.forEach(category => {
        const header = category.querySelector('.category-header');
        const arrow = category.querySelector('.category-arrow');
        const subcategories = category.querySelector('.subcategories');
        
        header.addEventListener('click', function() {
            // Toggle active class on category
            category.classList.toggle('active');
            
            // Toggle arrow direction
            if (category.classList.contains('active')) {
                arrow.classList.remove('fa-chevron-down');
                arrow.classList.add('fa-chevron-up');
                subcategories.style.maxHeight = subcategories.scrollHeight + 'px';
            } else {
                arrow.classList.remove('fa-chevron-up');
                arrow.classList.add('fa-chevron-down');
                subcategories.style.maxHeight = '0';
            }
        });
        
        // Initialize all categories as collapsed
        subcategories.style.maxHeight = '0';
    });
    
    // Function to highlight current page in sidebar
    function highlightCurrentPage() {
        // Get current URL hash (for anchor links)
        const currentHash = window.location.hash;
        
        // Remove any existing active classes
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // If we have a hash, find and highlight the corresponding link
        if (currentHash) {
            const targetLink = document.querySelector(`.subcategory-link[href="${currentHash}"]`);
            if (targetLink) {
                targetLink.classList.add('active');
                
                // Expand the parent category
                const parentCategory = targetLink.closest('.category');
                if (parentCategory && !parentCategory.classList.contains('active')) {
                    const header = parentCategory.querySelector('.category-header');
                    header.click(); // Simulate click to expand
                }
            }
        }
        
        // Fallback: Check if we're on the home page
        if (!currentHash || currentHash === '#getting-started') {
            // Highlight the home section if we're on the main page
            const homeLink = document.querySelector('.subcategory-link[href="#getting-started-guide"]');
            if (homeLink) {
                homeLink.classList.add('active');
                
                // Expand the Basic Information category
                const basicInfoCategory = homeLink.closest('.category');
                if (basicInfoCategory && !basicInfoCategory.classList.contains('active')) {
                    const header = basicInfoCategory.querySelector('.category-header');
                    header.click();
                }
            }
        }
    }
    
    // Highlight current page on load
    highlightCurrentPage();
    
    // Also highlight when hash changes (if user navigates via anchor links)
    window.addEventListener('hashchange', highlightCurrentPage);
    
    // Add click handlers to sidebar links to update highlighting
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
        });
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const sidebarNav = document.getElementById('sidebarNav');
    const titleList = document.getElementById('titleList');
    const sidebar = document.getElementById('sidebar');
    const guideContent = document.getElementById('guideContent');
    const homeLogo = document.getElementById('homeLogo');
    const headerSearch = document.getElementById('headerSearch');
    const homeSearch = document.getElementById('homeSearch');
    
    let sections = [document.getElementById('getting-started')];
    let currentSectionIndex = 0;

    // Home logo click event
    homeLogo.addEventListener('click', function() {
        navigateToSection(0);
    });

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

            // Update sidebar active link
            updateSidebarActive();

            // Show/hide sidebar and update search position based on section
            if (currentSectionIndex === 0) {
                sidebar.classList.remove('visible');
                // Show home search, hide header search
                homeSearch.style.display = 'block';
                headerSearch.style.display = 'none';
            } else {
                sidebar.classList.add('visible');
                // Show header search, hide home search
                homeSearch.style.display = 'none';
                headerSearch.style.display = 'block';
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

        // Search functionality for home page search
        const homeSearchInput = document.getElementById('homeSearchInput');
        const homeSearchResults = document.getElementById('homeSearchResults');

        homeSearchInput.addEventListener('input', () => {
            const query = homeSearchInput.value.toLowerCase();
            if (query.length > 0) {
                const results = sections.filter(section => {
                    const title = section.getAttribute('title').toLowerCase();
                    return title.includes(query);
                });

                displaySearchResults(results, homeSearchResults);
            } else {
                homeSearchResults.style.display = 'none';
            }
        });

        // Search functionality for header search
        const headerSearchInput = document.getElementById('headerSearchInput');
        const headerSearchResults = document.getElementById('headerSearchResults');

        headerSearchInput.addEventListener('input', () => {
            const query = headerSearchInput.value.toLowerCase();
            if (query.length > 0) {
                const results = sections.filter(section => {
                    const title = section.getAttribute('title').toLowerCase();
                    return title.includes(query);
                });

                displaySearchResults(results, headerSearchResults);
            } else {
                headerSearchResults.style.display = 'none';
            }
        });

        function displaySearchResults(results, resultsContainer) {
            resultsContainer.innerHTML = '';

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
                        homeSearchInput.value = '';
                        headerSearchInput.value = '';
                        homeSearchResults.style.display = 'none';
                        headerSearchResults.style.display = 'none';
                    });
                    resultsContainer.appendChild(resultItem);
                });
                resultsContainer.style.display = 'block';
            } else {
                const noResults = document.createElement('div');
                noResults.textContent = 'No results found';
                noResults.style.padding = '0.5rem 1rem';
                resultsContainer.appendChild(noResults);
                resultsContainer.style.display = 'block';
            }
        }

        // Hide search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!homeSearchInput.contains(e.target) && !headerSearchInput.contains(e.target)) {
                homeSearchResults.style.display = 'none';
                headerSearchResults.style.display = 'none';
            }
        });

        // Initialize
        updateSidebarActive();
        
        // Set initial search position
        if (currentSectionIndex === 0) {
            homeSearch.style.display = 'block';
            headerSearch.style.display = 'none';
        } else {
            homeSearch.style.display = 'none';
            headerSearch.style.display = 'block';
        }
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



