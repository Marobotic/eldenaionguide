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

    // Update the stats display
    updateStats(className);

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

// Add this class stats data (place it near your classData object)
const classStats = {
    Gladiator: { Power: 110, Health: 110, Accuracy: 100, Agility: 90, Knowledge: 70, Will: 80 },
    Templar: { Power: 90, Health: 120, Accuracy: 90, Agility: 80, Knowledge: 85, Will: 100 },
    Assassin: { Power: 100, Health: 90, Accuracy: 110, Agility: 110, Knowledge: 80, Will: 70 },
    Ranger: { Power: 90, Health: 90, Accuracy: 120, Agility: 110, Knowledge: 85, Will: 75 },
    Spiritmaster: { Power: 70, Health: 85, Accuracy: 95, Agility: 85, Knowledge: 120, Will: 110 },
    Sorcerer: { Power: 80, Health: 80, Accuracy: 90, Agility: 80, Knowledge: 120, Will: 100 },
    Cleric: { Power: 85, Health: 100, Accuracy: 85, Agility: 80, Knowledge: 110, Will: 110 },
    Chanter: { Power: 90, Health: 100, Accuracy: 85, Agility: 85, Knowledge: 100, Will: 120 }
};

// Add this function to update the stats
function updateStats(className) {
    const stats = classStats[className];
    const statElements = document.querySelectorAll('.stat');
    
    // Update each stat bar and value
    statElements.forEach((statElement) => {
        const statName = statElement.querySelector('.fill').textContent;
        const value = stats[statName];
        
        // Update the width and value
        statElement.querySelector('.fill').style.width = `${value}%`;
        statElement.querySelector('.value').textContent = value;
    });
}

// Your existing functions
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
        description: "The Gladiator is the weapons master of the Aion world and boasts excellent tanking and damage dealing capabilities. As such, Gladiators can fill either the tanking or dps role in a group. This class also has the widest variety of weapons available to them, being able to wield any physical weapon with the exception of the staff.",
        image: "media/characters/gladiator.webp"
    },
    Templar: {
        name: "Templar",
        description: "The Templar is the main tanking class of Aion with many defense increasing skills that allow for the Templar to achieve a nearly invincible state for a period of time.",
        image: "media/characters/templar.webp"
    },
    Assassin: {
        name: "Assassin",
        description: "The Assassin is the master of the shadows of Aion and has the best stealth and one of the highest damage bursts of all the classes. Assassins are also excellent in disabling and locking down their targets. These abilities go hand in hand, as an expert Assassin can sneak up on his target and burst it down before his target can even react.",
        image: "media/characters/Assassin.webp"
    },
    Ranger: {
        name: "Ranger",
        description: "The Ranger class is the ranged weapon expert of Aion and deals extensive damage from afar by using their bow to launch deadly arrows to destroy their victim. The Ranger is a ranged dps class with one or two skills of CC ability.",
        image: "media/characters/Ranger.webp"
    },
    Spiritmaster: {
        name: "Spiritmaster",
        description: "The Spiritmaster is the debuff specialist and the only class that utilizes summons in Aion. Spiritmasters use their powerful summons to damage and keep enemies at bay while they themselves inflict massive damage through the use of their damage over time skills. The Spiritmaster is considered to be a secondary dps and secondary CC class.",
        image: "media/characters/Spiritmaster.webp"
    },
    Sorcerer: {
        name: "Sorcerer",
        description: "The Sorcerer is the Crowd Control (CC) specialist of Aion and also a fearsome dps class with the hardest hitting spells in the game. Sorcerers use their powerful CC abilities to control the flow of a fight while also casting devastatingly powerful spells to dispatch their targets quickly. This class is primarily a DPS class with excellent CC capability.",
        image: "media/characters/Sorcerer.webp"
    },
    Cleric: {
        name: "Cleric",
        description: "Clerics are the primary healing class in Aion and they utilize powerful healing spells and dispelling magic to keep their allies standing through even in the worst of conditions.",
        image: "media/characters/cleric.webp"
    },
    Chanter: {
        name: "Chanter",
        description: "Having a profound mastery in enchantment magic, a Chanter benefits a group greatly by boosting various attributes of every group member.",
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


// app.js

const slots = [
  { id: 'slot1',  img: 'class_stigmas/gladiator/PVP/AbsorbingFury.png',       text: 'Absorbing Fury'   },
  { id: 'slot2',  img: 'class_stigmas/gladiator/PVP/AdvancedDualWielding.png', text: 'Adv. Dual Wielding'  },
  { id: 'slot3',  img: 'class_stigmas/gladiator/PVP/secondwind.png',           text: 'Second Wind' },
  { id: 'slot4',  img: 'class_stigmas/gladiator/PVP/SharpStrike.png',          text: 'Sharp Strike'  },
  { id: 'slot5',  img: 'class_stigmas/gladiator/PVP/cripplingcut.png',         text: 'Crippling Cut'   },
  { id: 'slot6',  img: 'class_stigmas/gladiator/PVP/slaughter.png',            text: 'Slaughter'  },
  { id: 'slot7',  img: 'class_stigmas/gladiator/PVP/ExhaustingWave.png',       text: 'Exhausting Wave' },
  { id: 'slot8',  img: 'class_stigmas/gladiator/PVP/tendonslice.png',          text: 'Tendon Slice'},
  { id: 'slot9',  img: 'class_stigmas/gladiator/PVP/UnwaveringDevotion.png',   text: 'Unwavering Devotion'  },
  { id: 'slot10', img: 'class_stigmas/gladiator/PVP/lockdown.png',             text: 'Lockdown'   },
  { id: 'slot11', img: 'class_stigmas/gladiator/PVP/PiercingRupture.png',      text: 'Piercing Rupture'  },
  { id: 'slot12', img: 'class_stigmas/gladiator/PVP/berserking.png',           text: 'Berserking' },

    { id: 'LockDownVPVE', img: 'class_stigmas/gladiator/PVE/lockdown.png', text: 'Lockdown' }, //done
  { id: 'BerserkingIPVE', img: 'class_stigmas/gladiator/PVE/berserking.png', text: 'Berserking' }, //done
  { id: 'SevereWeakeningBlowVIPVE', img: 'class_stigmas/gladiator/PVE/SevereWeakeningBlow.png', text: 'Severe Weakening Blow' }, //done
  { id: 'VengefulStrikeVIPVE', img: 'class_stigmas/gladiator/PVE/VengefulStrike.png', text: 'Vengeful Strike' }, //done
  { id: 'DauntlessSpiritVPVE', img: 'class_stigmas/gladiator/PVE/DauntlessSpirit.png', text: 'Dauntless Spirit' }, //done
  { id: 'SpiteStrikeVIPVE', img: 'class_stigmas/gladiator/PVE/SpiteStrike.png', text: 'Spite Strike' }, //done
  { id: 'AdvancedDualWieldingIIPVE', img: 'class_stigmas/gladiator/PVE/AdvancedDualWielding.png', text: 'Adv. Dual Wielding II' }, //done
  { id: 'SharpStrikeVIPVE', img: 'class_stigmas/gladiator/PVE/SharpStrike.png', text: 'Sharp Strike' }, //done
  { id: 'ViciousBlowIV', img: 'class_stigmas/gladiator/PVE/ViciousBlow.png', text: 'Vicious Blow' }, // done
  { id: 'WhirlingStrikeIIIPVE', img: 'class_stigmas/gladiator/PVE/WhirlingStrike.png', text: 'Whirling Strike' }, //done
  { id: 'DrainingSwordIIPVE', img: 'class_stigmas/gladiator/PVE/DrainingSword.png', text: 'Draining Sword' }, //done
  { id: 'SecondWindPVE', img: 'class_stigmas/gladiator/PVE/secondwind.png', text: 'Second Wind' } //done
];

// Delay execution by 1 second
setTimeout(() => {
  const report = [];

  for (const { id, img, text } of slots) {
    const el = document.getElementById(id);
    if (!el) {
      report.push({ id, status: 'missing element' });
      continue;
    }

    const imgEl = el.querySelector('img');
    const labelEl = el.querySelector('.label');

    if (labelEl) labelEl.textContent = text || id;

    if (imgEl) {
      const src = (img || '').replace(/^\/+/, ''); // strip leading slash
      imgEl.alt = text || id;
      imgEl.src = src;
      report.push({ id, status: 'applied', src, text });
    } else {
      report.push({ id, status: 'missing <img>' });
    }
  }

  console.log('Slot population finished:', report);
}, 100);
