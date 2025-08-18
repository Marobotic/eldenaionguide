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

function selectClass(element, className) {
    // Remove "selected" from all
    document.querySelectorAll('.class_image').forEach(el => el.classList.remove('selected'));

    // Add "selected" to clicked
    element.classList.add('selected');

    // Call corresponding function
    switch (className) {
        case "Gladiator":
            openGladiator();
            break;
        case "Templar":
            openTemplar();
            break;
        case "Assassin":
            openAssassin();
            break;
        case "Ranger":
            openRanger();
            break;
        case "Spiritmaster":
            openSpiritmaster();
            break;
        case "Sorcerer":
            openSorcerer();
            break;
        case "Cleric":
            openCleric();
            break;
        case "Chanter":
            openChanter();
            break;
    }
}

// Define your functions (you can replace console.log with your logic)
function openGladiator() { console.log("Gladiator selected"); }

function openTemplar() { console.log("Templar selected"); }

function openAssassin() { console.log("Assassin selected"); }

function openRanger() { console.log("Ranger selected"); }

function openSpiritmaster() { console.log("Spiritmaster selected"); }

function openSorcerer() { console.log("Sorcerer selected"); }

function openCleric() { console.log("Cleric selected"); }

function openChanter() { console.log("Chanter selected"); }


// Your data: add descriptions + image paths
const classData = {
    Gladiator: {
        name: "Gladiator",
        description: "Strong melee fighter, specializing in AoE damage and powerful weapon mastery.",
        image: "media/characters/gladiator.webp"
    },
    Templar: {
        name: "Templar",
        description: "Tanky warrior who protects allies with heavy armor and defensive skills.",
        image: "media/characters/templar.webp"
    },
    Assassin: {
        name: "Assassin",
        description: "Stealthy DPS with high burst damage and lethal precision.",
        image: "media/characters/Assassin.webp"
    },
    Ranger: {
        name: "Ranger",
        description: "Expert at ranged combat, traps, and deadly bow skills.",
        image: "media/characters/Ranger.webp"
    },
    Spiritmaster: {
        name: "Spiritmaster",
        description: "Summoner class commanding powerful elemental spirits.",
        image: "media/characters/Spiritmaster.webp"
    },
    Sorcerer: {
        name: "Sorcerer",
        description: "Master of destructive magic with high damage spells.",
        image: "media/characters/Sorcerer.webp"
    },
    Cleric: {
        name: "Cleric",
        description: "Support and healer, keeping allies alive while dealing holy damage.",
        image: "media/characters/cleric.webp"
    },
    Chanter: {
        name: "Chanter",
        description: "Buffer and support fighter, boosting allies with mantras and healing.",
        image: "media/characters/Chanter.webp"
    }
};

// Select and update elements
function selectClass(element, className) {
    // Remove highlight from all
    document.querySelectorAll('.class_image').forEach(el => el.classList.remove('selected'));

    // Highlight clicked one
    element.classList.add('selected');

    // Update display elements
    document.querySelector('.className').textContent = classData[className].name;
    document.querySelector('.classDescription').textContent = classData[className].description;
    document.querySelector('.classImage').style.backgroundImage = `url(${classData[className].image})`;
    document.querySelector('.classImage').style.backgroundSize = "contain";
    document.querySelector('.classImage').style.backgroundPosition = "center";
    document.querySelector('.classImage').style.backgroundRepeat = "no-repeat";
}

// ✅ Set default (Gladiator) on page load
window.onload = () => {
    selectClass(document.querySelector('.Gladiator'), 'Gladiator');
};