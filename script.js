// Collapsible sidebar categories functionality and highlighting
document.addEventListener('DOMContentLoaded', function() {
    const categories = document.querySelectorAll('.category');
    const sidebarLinks = document.querySelectorAll('.subcategory-link');
    
    // Collapsible categories functionality
    categories.forEach(category => {
        const header = category.querySelector('.category-header');
        const arrow = category.querySelector('.category-arrow');
        const subcategories = category.querySelector('.subcategories');
        
        if (!header || !arrow || !subcategories) return;

        header.addEventListener('click', function() {
            category.classList.toggle('active');
            
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
        
        subcategories.style.maxHeight = '0';
    });
    
    // Function to highlight current page in sidebar
    function highlightCurrentPage() {
        const currentHash = window.location.hash;
        sidebarLinks.forEach(link => link.classList.remove('active'));

        if (currentHash) {
            const targetLink = document.querySelector(`.subcategory-link[href="${currentHash}"]`);
            if (targetLink) {
                targetLink.classList.add('active');
                const parentCategory = targetLink.closest('.category');
                if (parentCategory && !parentCategory.classList.contains('active')) {
                    const header = parentCategory.querySelector('.category-header');
                    if (header) header.click();
                }
            }
        }

        if (!currentHash || currentHash === '#getting-started') {
            const homeLink = document.querySelector('.subcategory-link[href="#getting-started-guide"]');
            if (homeLink) {
                homeLink.classList.add('active');
                const basicInfoCategory = homeLink.closest('.category');
                if (basicInfoCategory && !basicInfoCategory.classList.contains('active')) {
                    const header = basicInfoCategory.querySelector('.category-header');
                    if (header) header.click();
                }
            }
        }
    }

    highlightCurrentPage();
    window.addEventListener('hashchange', highlightCurrentPage);
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            sidebarLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const sidebarNav = document.getElementById('sidebarNav');
    const sidebar = document.getElementById('sidebar');
    const guideContent = document.getElementById('guideContent');
    const homeLogo = document.getElementById('homeLogo');
    const headerSearch = document.getElementById('headerSearch');
    const homeSearch = document.getElementById('homeSearch');
    
    if (!sidebarNav || !guideContent) return;
    
    let sections = [document.getElementById('getting-started')].filter(Boolean);
    let currentSectionIndex = 0;

    if (homeLogo) {
        homeLogo.addEventListener('click', function() {
            navigateToSection(0);
        });
    }

    fetch('guide.html')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const guideSections = Array.from(doc.querySelectorAll('section'));
            guideSections.forEach(section => guideContent.appendChild(section));
            sections = Array.from(document.querySelectorAll('section'));
            initializeNavigation();
        })
        .catch(error => {
            console.error('Error loading guide content:', error);
        });

    function initializeNavigation() {
        sections.forEach((section, index) => {
            const title = section.getAttribute('title') || `Section ${index + 1}`;
            const id = section.id || `section-${index}`;
            section.id = id;

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
function navigateToSection(index) {
    // Stop all videos from previous section
    document.querySelectorAll('iframe[src*="youtube"]').forEach(iframe => {
        if (iframe.src) {
            // Store the current src for later restoration
            iframe.dataset.lastSrc = iframe.src;
            // Remove src to stop video
            iframe.src = '';
        }
    });

    if (sections[currentSectionIndex]) {
        sections[currentSectionIndex].classList.remove('active');
    }

    currentSectionIndex = index;
    const section = sections[currentSectionIndex];
    if (section) section.classList.add('active');
    if (section && section.id) window.location.hash = section.id;

    updateSidebarActive();

    if (sidebar) {
        if (currentSectionIndex === 0) {
            sidebar.classList.remove('visible');
            if (homeSearch) homeSearch.style.display = 'block';
            if (headerSearch) headerSearch.style.display = 'none';
        } else {
            sidebar.classList.add('visible');
            if (homeSearch) homeSearch.style.display = 'none';
            if (headerSearch) headerSearch.style.display = 'block';
        }
    }

    // Restore videos for current section
    if (section) {
        section.querySelectorAll('iframe[data-last-src]').forEach(iframe => {
            iframe.src = iframe.dataset.lastSrc;
        });
    }

    window.scrollTo(0, 0);
}

        function handleHashChange() {
            const hash = window.location.hash.substring(1);
            if (hash) {
                const sectionIndex = sections.findIndex(section => section.id === hash);
                if (sectionIndex !== -1) navigateToSection(sectionIndex);
            } else {
                navigateToSection(0);
            }
        }

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange();

        function updateSidebarActive() {
            const links = sidebarNav.querySelectorAll('a');
            links.forEach((link, index) => {
                if (index === currentSectionIndex) link.classList.add('active');
                else link.classList.remove('active');
            });
        }

        const homeSearchInput = document.getElementById('homeSearchInput');
        const homeSearchResults = document.getElementById('homeSearchResults');
        const headerSearchInput = document.getElementById('headerSearchInput');
        const headerSearchResults = document.getElementById('headerSearchResults');

        function safeQuery(inputElement, resultsContainer) {
            const query = (inputElement.value || '').trim().toLowerCase();
            if (query.length === 0) {
                resultsContainer.style.display = 'none';
                return;
            }

            const results = sections.filter(section => {
                const title = (section.getAttribute('title') || '').toLowerCase();
                return title.includes(query);
            });

            displaySearchResults(results, resultsContainer, inputElement);
        }

        function displaySearchResults(results, container, inputElement) {
            container.innerHTML = '';
            if (results.length > 0) {
                results.forEach(section => {
                    const resultItem = document.createElement('a');
                    const title = section.getAttribute('title') || 'Untitled';
                    resultItem.href = `#${section.id}`;
                    resultItem.textContent = title;
                    resultItem.addEventListener('click', (e) => {
                        e.preventDefault();
                        const index = sections.findIndex(s => s.id === section.id);
                        navigateToSection(index);
                        inputElement.value = '';
                        container.style.display = 'none';
                    });
                    container.appendChild(resultItem);
                });
            } else {
                const noResults = document.createElement('div');
                noResults.textContent = 'No results found';
                noResults.style.padding = '0.5rem 1rem';
                container.appendChild(noResults);
            }
            container.style.display = 'block';
        }

        if (homeSearchInput && homeSearchResults) {
            homeSearchInput.addEventListener('input', () => safeQuery(homeSearchInput, homeSearchResults));
        }
        if (headerSearchInput && headerSearchResults) {
            headerSearchInput.addEventListener('input', () => safeQuery(headerSearchInput, headerSearchResults));
        }

        document.addEventListener('click', (e) => {
            if (!homeSearchInput?.contains(e.target) && !headerSearchInput?.contains(e.target)) {
                if (homeSearchResults) homeSearchResults.style.display = 'none';
                if (headerSearchResults) headerSearchResults.style.display = 'none';
            }
        });

        updateSidebarActive();

        if (sidebar) {
            if (currentSectionIndex === 0) {
                if (homeSearch) homeSearch.style.display = 'block';
                if (headerSearch) headerSearch.style.display = 'none';
            } else {
                if (homeSearch) homeSearch.style.display = 'none';
                if (headerSearch) headerSearch.style.display = 'block';
            }
        }
    }
});

// Mobile menu toggle
const mobileMenuToggle = document.createElement('div');
mobileMenuToggle.className = 'mobile-menu-toggle';
mobileMenuToggle.innerHTML = '☰';
const header = document.querySelector('header');
if (header) header.prepend(mobileMenuToggle);

const sidebar = document.getElementById('sidebar');

mobileMenuToggle.addEventListener('click', () => {
    if (sidebar) sidebar.classList.toggle('visible');
});

document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth < 768 && sidebar) {
            sidebar.classList.remove('visible');
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const videos = document.querySelectorAll('.lazy-video');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target;
                if (!iframe.src) {
                    iframe.src = iframe.dataset.src + '?autoplay=1&mute=1';
                }
                observer.unobserve(iframe);
            }
        });
    }, { threshold: 0.4 });

    videos.forEach(video => observer.observe(video));
});


