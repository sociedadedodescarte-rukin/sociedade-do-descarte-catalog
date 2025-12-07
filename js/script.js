// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll effect to navigation
window.addEventListener('scroll', function () {
    const nav = document.querySelector('.nav');
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(0,0,0,0.5)';
    } else {
        nav.style.background = 'rgba(0,0,0,0.3)';
    }
});

// Print functionality
function printCatalog() {
    window.print();
}

// Add print button functionality if needed
document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        printCatalog();
    }
});

// Lazy loading for images (optional enhancement)
document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('.artwork-image, .artist-photo');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // Add fade-in animation when image comes into view
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.5s ease-in-out';
                setTimeout(() => {
                    img.style.opacity = '1';
                }, 100);
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

// Add active state to navigation based on scroll position
window.addEventListener('scroll', function () {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Lightbox functionality moved to bottom with social sharing

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close lightbox when clicking outside the content
document.getElementById('lightbox').addEventListener('click', function(e) {
    if (e.target === this) {
        closeLightbox();
    }
});

// Close lightbox with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// Search and Filter functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('artwork-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchArtworks(this.value);
        });
    }
});

function searchArtworks(searchTerm) {
    const artworkItems = document.querySelectorAll('.artwork-item');
    const artistSections = document.querySelectorAll('.artist-section');
    const normalizedSearch = searchTerm.toLowerCase().trim();

    if (normalizedSearch === '') {
        // Show all artworks and artist sections
        artworkItems.forEach(item => {
            item.style.display = 'block';
            item.style.animation = 'fadeIn 0.3s ease';
        });
        artistSections.forEach(section => {
            section.style.display = 'block';
        });
        return;
    }

    artistSections.forEach(section => {
        const artistName = section.querySelector('.artist-section-title').textContent.toLowerCase();
        let hasVisibleArtworks = false;

        const artworksInSection = section.querySelectorAll('.artwork-item');
        artworksInSection.forEach(item => {
            const title = item.querySelector('.artwork-title').textContent.toLowerCase();

            if (title.includes(normalizedSearch) || artistName.includes(normalizedSearch)) {
                item.style.display = 'block';
                item.style.animation = 'fadeIn 0.3s ease';
                hasVisibleArtworks = true;
            } else {
                item.style.display = 'none';
            }
        });

        // Show/hide entire artist section based on whether it has visible artworks
        section.style.display = hasVisibleArtworks ? 'block' : 'none';
    });
}

function filterArtworks(artist) {
    const artistSections = document.querySelectorAll('.artist-section');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Update active filter button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Filter artist sections
    artistSections.forEach(section => {
        const sectionArtist = section.querySelector('.artist-section-title').textContent;

        if (artist === 'all' || sectionArtist === artist) {
            section.style.display = 'block';
            section.style.animation = 'fadeIn 0.3s ease';

            // Show all artworks in the visible section
            const artworksInSection = section.querySelectorAll('.artwork-item');
            artworksInSection.forEach(item => {
                item.style.display = 'block';
                item.style.animation = 'fadeIn 0.3s ease';
            });
        } else {
            section.style.display = 'none';
        }
    });

    // Clear search when filtering
    const searchInput = document.getElementById('artwork-search');
    if (searchInput) {
        searchInput.value = '';
    }
}

function clearSearch() {
    const searchInput = document.getElementById('artwork-search');
    const artistSections = document.querySelectorAll('.artist-section');

    if (searchInput) {
        searchInput.value = '';

        // Show all artist sections and artworks
        artistSections.forEach(section => {
            section.style.display = 'block';
            section.style.animation = 'fadeIn 0.3s ease';

            const artworksInSection = section.querySelectorAll('.artwork-item');
            artworksInSection.forEach(item => {
                item.style.display = 'block';
                item.style.animation = 'fadeIn 0.3s ease';
            });
        });

        // Reset filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => btn.classList.remove('active'));
        filterButtons[0].classList.add('active'); // Set "Todas" as active
    }
}

// Social Sharing Functions
let currentArtworkData = {};

function openLightbox(imageId, title, artist, technique, year) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxArtist = document.getElementById('lightbox-artist');
    const lightboxDetails = document.getElementById('lightbox-details');

    const sourceImage = document.getElementById(imageId);
    const sourceImg = sourceImage.querySelector('img');

    // Clear previous content
    lightboxImage.innerHTML = '';

    if (sourceImg) {
        // Create a new img element for the lightbox
        const lightboxImg = document.createElement('img');
        lightboxImg.src = sourceImg.src;
        lightboxImg.alt = sourceImg.alt;
        lightboxImage.appendChild(lightboxImg);
    }

    lightboxTitle.textContent = title;
    lightboxArtist.textContent = currentLanguage === 'pt' ? `por ${artist}` : `by ${artist}`;

    // Store current artwork data for sharing
    currentArtworkData = { title, artist, technique, year };

    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function shareOnFacebook() {
    const url = window.location.href;
    const text = `Confira "${currentArtworkData.title}" por ${currentArtworkData.artist} na exposição "Sociedade do Descarte"`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
}

function shareOnTwitter() {
    const url = window.location.href;
    const text = `Confira "${currentArtworkData.title}" por ${currentArtworkData.artist} na exposição "Sociedade do Descarte" #Arte #SociedadeDoDescarte`;
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
}

function shareOnWhatsApp() {
    const url = window.location.href;
    const text = `Confira "${currentArtworkData.title}" por ${currentArtworkData.artist} na exposição "Sociedade do Descarte" - ${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
}

function copyLink() {
    const url = window.location.href;

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url).then(() => {
            showCopyFeedback('Link copiado!');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showCopyFeedback('Link copiado!');
        } catch (err) {
            showCopyFeedback('Erro ao copiar link');
        }
        document.body.removeChild(textArea);
    }
}

function showCopyFeedback(message) {
    // Create temporary feedback element
    const feedback = document.createElement('div');
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #333;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 10001;
        font-size: 0.9rem;
    `;

    document.body.appendChild(feedback);

    setTimeout(() => {
        document.body.removeChild(feedback);
    }, 2000);
}

// Artwork Data Structure (Bilingual)
const artworksData = {
    'Langa': [
        {
            id: 'langa1',
            imageId: 'langa1',
            imageSrc: 'image/Art_Langa01.jpg',
            title: { pt: 'A flor', en: 'The Flower' },
            year: '2025',
            dimensions: '198 x 130 cm',
            technique: {
                pt: 'Bandeira de Patchwork',
                en: 'Patchwork Banner'
            },
            altText: { pt: 'A Flor por Langa', en: 'The Flower by Langa' }
        },
        {
            id: 'langa2',
            imageId: 'langa2',
            imageSrc: 'image/Art_Langa02.jpg',
            title: { pt: 'Sem Título', en: 'Untitled' },
            year: '2025',
            dimensions: '33 cm (diâmetro)',
            technique: {
                pt: 'Colagem sobre escultura de papietagem',
                en: 'Collage on papier-mâché sculpture'
            },
            altText: { pt: 'Sem Título por Langa', en: 'Untitled by Langa' }
        },
        {
            id: 'langa3',
            imageId: 'langa3',
            imageSrc: 'image/Art_Langa03.jpg',
            title: { pt: 'Sem Título', en: 'Untitled' },
            year: '2025',
            dimensions: '51 cm (diâmetro)',
            technique: {
                pt: 'Colagem sobre escultura de papietagem',
                en: 'Collage on papier-mâché sculpture'
            },
            altText: { pt: 'Sem Título por Langa', en: 'Untitled by Langa' }
        }
    ],
    'Iskor': [
        {
            id: 'iskor1',
            imageId: 'iskor1',
            imageSrc: 'image/Art_Iskor01.jpg',
            title: { pt: 'Fast Fashion', en: 'Fast Fashion' },
            year: '2025',
            dimensions: '160 x 300 cm',
            technique: {
                pt: 'Tinta acrílica, spray e retalhos de tecido sobre tela',
                en: 'Acrylic paint, spray paint and fabric scraps on canvas'
            },
            altText: { pt: 'Fast Fashion por Iskor', en: 'Fast Fashion by Iskor' }
        }
    ],
    'Milly Pannunzio': [
        {
            id: 'milly1',
            imageId: 'milly1',
            imageSrc: 'image/Art_Milly01.jpg',
            title: { pt: 'Cipós Urbanos', en: 'Urban Vines' },
            year: '2021',
            dimensions: '1,90 x 0,14 m (cada peça) total 8 peças',
            technique: {
                pt: 'Assemblagem de plásticos descartados',
                en: 'Assemblage with discarded plastics'
            },
            altText: { pt: 'Cipós Urbanos por Milly Pannunzio', en: 'Urban Vines by Milly Pannunzio' },
            note: { pt: '*Obra pode ser dividida em até 8 partes mediante interesse', en: '* The work can be divided into up to 8 parts depending on interest' }
        }
    ],
    'Rukin563': [
        {
            id: 'rukin1',
            imageId: 'rukin1',
            imageSrc: 'image/Art_Rukin01.jpg',
            title: { pt: 'Forever I', en: 'Forever I' },
            year: '2025',
            dimensions: '58 x 36,5 x 3,8 cm',
            technique: {
                pt: 'Assemblagem com materiais de descarte em caixa de madeira de reuso e tampa de acrílico',
                en: 'Assemblage with discarded materials in a reused wooden box with an acrylic lid'
            },
            altText: { pt: 'Forever I por Rukin563', en: 'Forever I by Rukin563' }
        },
        {
            id: 'rukin2',
            imageId: 'rukin2',
            imageSrc: 'image/Art_Rukin02.jpg',
            title: { pt: 'Forever II', en: 'Forever II' },
            year: '2025',
            dimensions: '58 x 36,5 x 3,8 cm',
            technique: {
                pt: 'Assemblagem com materiais de descarte em caixa de madeira de reuso e tampa de acrílico',
                en: 'Assemblage with discarded materials in a reused wooden box with an acrylic lid'
            },
            altText: { pt: 'Forever II por Rukin563', en: 'Forever II by Rukin563' }
        },
        {
            id: 'rukin3',
            imageId: 'rukin3',
            imageSrc: 'image/Art_Rukin03.jpg',
            title: { pt: 'Forever III', en: 'Forever - III' },
            year: '2025',
            dimensions: '58 x 36,5 x 3,8 cm',
            technique: {
                pt: 'Assemblagem com materiais de descarte em caixa de madeira de reuso e tampa de acrílico',
                en: 'Assemblage with discarded materials in a reused wooden box with an acrylic lid'
            },
            altText: { pt: 'Forever III por Rukin563', en: 'Forever III by Rukin563' }
        },
        {
            id: 'rukin4',
            imageId: 'rukin4',
            imageSrc: 'image/Art_Rukin04.jpg',
            title: { pt: 'Time Capsule', en: 'Time Capsule' },
            year: '2025',
            dimensions: '45 x 35 x 3,9 cm',
            technique: {
                pt: 'Assemblagem com materiais de descarte em caixa de acrílico cristal',
                en: 'Assemblage with discarded materials in an acrylic box'
            },
            altText: { pt: 'Time Capsule por Rukin563', en: 'Time Capsule by Rukin563' }
        },
        {
            id: 'rukin5',
            imageId: 'rukin5',
            imageSrc: 'image/Art_Rukin05.jpg',
            title: { pt: 'Landromat art toy', en: 'Landromat art toy' },
            year: '2025',
            dimensions: '',
            technique: {
                pt: 'plástico',
                en: 'Plastic'
            },
            altText: { pt: 'Landromat art toy por Rukin563', en: 'Landromat art toy by Rukin563' }
        },
        {
            id: 'rukin6',
            imageId: 'rukin6',
            imageSrc: 'image/Art_Rukin06.jpg',
            title: { pt: 'Tin robot', en: 'Tin robot' },
            year: '2025',
            dimensions: '',
            technique: {
                pt: 'Metal, plástico, imã, concreto',
                en: 'Metal, plastic, magnet and concrete'
            },
            altText: { pt: 'Tin robot por Rukin563', en: 'Tin robot by Rukin563' }
        }
    ],
    'Luis Guimarães': [
        {
            id: 'luis2',
            imageId: 'luis2',
            imageSrc: 'image/Art_luis02.jpg',
            title: { pt: 'Sem Título', en: 'Untitled' },
            year: '2025',
            dimensions: '80 x 25 x 14 cm',
            technique: {
                pt: 'Assemblagem',
                en: 'Assemblage'
            },
            altText: { pt: 'Sem Título por Luis Guimarães', en: 'Untitled by Luis Guimarães' }
        },
        {
            id: 'luis4',
            imageId: 'luis4',
            imageSrc: 'image/Art_luis04.jpg',
            title: { pt: 'Sem Título', en: 'Untitled' },
            year: '2025',
            dimensions: '160 x 72 x 26 cm',
            technique: {
                pt: 'Assemblagem',
                en: 'Assemblage'
            },
            altText: { pt: 'Sem Título por Luis Guimarães', en: 'Untitled by Luis Guimarães' }
        },
        {
            id: 'luis5',
            imageId: 'luis5',
            imageSrc: 'image/Art_luis05.jpg',
            title: { pt: 'Sem Título', en: 'Untitled' },
            year: '2025',
            dimensions: '74 x 28 x 19 cm',
            technique: {
                pt: 'Assemblagem',
                en: 'Assemblage'
            },
            altText: { pt: 'Sem Título por Luis Guimarães', en: 'Untitled by Luis Guimarães' }
        },
        {
            id: 'luis6',
            imageId: 'luis6',
            imageSrc: 'image/Art_luis06.jpg',
            title: { pt: 'Sem Título', en: 'Untitled' },
            year: '2025',
            dimensions: '51 x 48,5 x 19 cm',
            technique: {
                pt: 'Assemblagem',
                en: 'Assemblage'
            },
            altText: { pt: 'Sem Título por Luis Guimarães', en: 'Untitled by Luis Guimarães' }
        }
    ],
    'DDois': [
        {
            id: 'ddois1',
            imageId: 'ddois1',
            imageSrc: 'image/Art_Ddois01.jpg',
            title: { pt: 'Sem Título', en: 'Untitled' },
            year: '2025',
            dimensions: '75 x 148 x 27 cm',
            technique: {
                pt: 'Escultura de Isopor e tinta spray',
                en: 'Styrofoam and Spray Painting'
            },
            altText: { pt: 'Título da Obra 1 por DDois', en: 'Untitled by DDois' }
        },
        {
            id: 'ddois4',
            imageId: 'ddois4',
            imageSrc: 'image/Art_Ddois04.jpg',
            title: { pt: 'Nsaa', en: 'Nsaa' },
            year: '2025',
            dimensions: '21,5 x 30 x 20 cm',
            technique: {
                pt: 'Pintura sobre banco feito com Madeira de Reuso',
                en: 'Painting on a bench made from reclaimed wood'
            },
            altText: { pt: 'Título da Obra 4 por DDois', en: 'Nsaa by DDois' }
        },
        {
            id: 'ddois5',
            imageId: 'ddois5',
            imageSrc: 'image/Art_Ddois05.jpg',
            title: { pt: 'Aya', en: 'Aya' },
            year: '2025',
            dimensions: '32 x 56 x 20 cm',
            technique: {
                pt: 'Pintura sobre banco feito com Madeira de Reuso',
                en: 'Painting on a bench made from reclaimed wood'
            },
            altText: { pt: 'Título da Obra 5 por DDois', en: 'Aya by DDois' }
        },
        {
            id: 'ddois9',
            imageId: 'ddois9',
            imageSrc: 'image/Art_Ddois09.jpg',
            title: { pt: 'Ntesiemate Masie', en: 'Ntesiemate Masie' },
            year: '2025',
            dimensions: '22 x 30 x 19 cm',
            technique: {
                pt: 'Pintura sobre banco feito com Madeira de Reuso',
                en: 'Painting on a bench made from reclaimed wood'
            },
            altText: { pt: 'Título da Obra 9 por DDois', en: 'Ntesiemate Masie by DDois' }
        }
    ],
    'Otica Otica': [
        {
            id: 'otica1',
            imageId: 'otica1',
            imageSrc: 'image/Art_otica01.jpg',
            title: { pt: 'Sem título', en: 'Untitled' },
            year: '2025',
            dimensions: '60 x 60 x 28 cm',
            technique: {
                pt: 'Colagem e tinta acrílica sobre MDF',
                en: 'Collage and acrylic paint on MDF'
            },
            altText: { pt: 'Sem título por André Santiago (Otica Otica)', en: 'Untitled by André Santiago (Otica Otica)' }
        },
        {
            id: 'otica2',
            imageId: 'otica2',
            imageSrc: 'image/Art_otica02.jpg',
            title: { pt: 'Sem título', en: 'Untitled' },
            year: '2025',
            dimensions: '61 x 41 x 5 cm',
            technique: {
                pt: 'Colagem e tinta acrílica sobre MDF',
                en: 'Collage and acrylic paint on MDF'
            },
            altText: { pt: 'Sem título por André Santiago (Otica Otica)', en: 'Untitled by André Santiago (Otica Otica)' }
        },
        {
            id: 'otica3',
            imageId: 'otica3',
            imageSrc: 'image/Art_otica03.jpg',
            title: { pt: 'Sem título', en: 'Untitled' },
            year: '2025',
            dimensions: '34 x 61 cm',
            technique: {
                pt: 'Colagem e tinta acrílica sobre MDF',
                en: 'Collage and acrylic paint on MDF'
            },
            altText: { pt: 'Sem título por André Santiago (Otica Otica)', en: 'Untitled by André Santiago (Otica Otica)' }
        }
    ],
    'Tom Wray': [
        {
            id: 'tom1',
            imageId: 'tom1',
            imageSrc: 'image/Art_Tom01.jpg',
            title: { pt: 'As gavetas se abriram, dançaram e escreveram', en: 'The drawers opened, danced, and wrote' },
            year: '2025',
            dimensions: { pt: 'Tamanho variável', en: 'variable size' },
            technique: {
                pt: 'Spray e goma laca sobre madeira',
                en: 'Spray and gum lacquer on wood'
            },
            altText: { pt: 'As gavetas se abriram, dançaram e escreveram por Tom Wray', en: 'The drawers opened, danced, and wrote by Tom Wray' },
            note: { pt: '* A obra pode ser dividida em até 3 partes mediante interesse', en: '* The work can be divided into up to 3 parts depending on interest' }
        }
    ]
};

// Helper function to escape quotes in strings for JavaScript in onclick attributes
function escapeForJS(str) {
    if (!str) return '';
    return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
}

// Function to render artwork cards based on current language
function renderArtworks(lang) {
    const priceText = lang === 'pt' ? 'Preços sob consulta' : 'Price upon request';

    // Iterate through each artist
    Object.keys(artworksData).forEach(artistName => {
        const artworks = artworksData[artistName];

        // Find the artist section by matching the artist name
        const allArtistSections = document.querySelectorAll('.artist-section');
        let targetSection = null;

        allArtistSections.forEach(section => {
            const titleElement = section.querySelector('.artist-section-title');
            if (titleElement && titleElement.textContent.trim() === artistName) {
                targetSection = section;
            }
        });

        if (!targetSection) return;

        const gridContainer = targetSection.querySelector('.artist-artwork-grid');
        if (!gridContainer) return;

        // Clear existing artworks
        gridContainer.innerHTML = '';

        // Render each artwork
        artworks.forEach(artwork => {
            const title = artwork.title[lang];
            const technique = artwork.technique[lang];
            const altText = artwork.altText[lang];
            const dimensions = typeof artwork.dimensions === 'object' ? artwork.dimensions[lang] : artwork.dimensions;

            // For lightbox, combine technique and dimensions like the original HTML
            const techniqueWithDimensions = dimensions ? `${technique}, ${dimensions}` : technique;

            // Escape quotes for onclick attribute (JavaScript context)
            const escapedTitle = escapeForJS(title);
            const escapedTechniqueWithDims = escapeForJS(techniqueWithDimensions);
            const escapedArtistName = escapeForJS(artistName);

            // For alt attribute, escape HTML special chars
            const escapedAltText = altText.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

            const artworkHTML = `
                <div class="artwork-item" onclick="openLightbox('${artwork.imageId}', '${escapedTitle}', '${escapedArtistName}', '${escapedTechniqueWithDims}', '${artwork.year}')">
                    <div class="artwork-image" id="${artwork.imageId}">
                        <img src="${artwork.imageSrc}" alt="${escapedAltText}" loading="lazy">
                    </div>
                    <div class="artwork-details">
                        <h4 class="artwork-title"><em>${title}</em>, ${artwork.year}</h4>
                        <p class="artwork-info">${dimensions ? dimensions + '<br>' : ''}${technique}<br>• ${priceText}${artwork.note ? '<br><small><em>' + artwork.note[lang] + '</em></small>' : ''}</p>
                    </div>
                </div>
            `;

            gridContainer.insertAdjacentHTML('beforeend', artworkHTML);
        });
    });
}

// Language Translation System
const translations = {
    pt: {
        // Navigation
        'nav-home': 'Início',
        'nav-about': 'Sobre',
        'nav-artworks': 'Obras',
        'nav-collective': 'Coletivo',
        'nav-artists': 'Artistas',
        'nav-visit': 'Visitação',

        // Cover
        'cover-presents': 'Coletivo Planeta Hostil apresenta:',
        'cover-title': 'SOCIEDADE DO DESCARTE',
        'cover-subtitle': 'Venha descobrir como materiais descartados se transformam em multiversos artísticos',
        'cover-details1': '8 Artistas • Obras Contemporâneas • Técnicas Mistas',
        'cover-details2': 'Passagem Literária • São Paulo',
        'cover-details3': 'de Setembro até Dezembro • 2025',

        // Introduction
        'intro-title': 'Sobre a Exposição',
        'intro-p1': '<strong>SOCIEDADE do DESCARTE</strong>, é uma exposição que reúne oito artistas contemporâneos cujas vozes diversas convergem para criar um diálogo poderoso sobre consumo, desperdício e a relação complexa entre criação e destruição na sociedade moderna.',
        'intro-p2': 'A exposição apresenta uma reflexão crítica sobre os padrões de descarte da sociedade e como a arte pode ressignificar o que consideramos "lixo" ou "obsoleto".',
        'intro-p3': 'De expressões abstratas ousadas a obras figurativas íntimas e técnicas tradicionais reimaginadas, esta coleção representa o espectro vibrante do mundo artístico atual.',

        // Artworks
        'artworks-title': 'Obras em Destaque',
        'search-placeholder': 'Buscar por título ou artista...',
        'filter-all': 'Todas',

        // Collective
        'collective-title': 'Coletivo Planeta Hostil',
        'collective-p1': '<strong>Planeta Hostil</strong> é um coletivo artístico que emerge como uma resposta crítica às questões urgentes do nosso tempo que estão transformando o planeta num lugar inabitável.',
        'collective-p2': 'Desde intervenções urbanas até instalações conceituais e o upcycling criativo - exploramos as contradições e possibilidades do mundo contemporâneo.',
        'collective-p3': 'A arte é usada como ferramenta de reflexão crítica sobre nossa condição planetária, pois ela tem o poder de despertar consciências e promover mudanças significativas em um mundo cada vez mais conectado, mas paradoxalmente fragmentado.',

        // Artists
        'artists-title': 'Os Artistas',
        'artist-bio-generic': 'Biografia breve do artista, sua formação, educação e jornada artística. Esta seção fornece contexto para seu trabalho e ajuda os visitantes a se conectarem com a história do artista.',
        'artist-statement-generic': '"Minha declaração artística ou filosofia que orienta meu processo criativo e o que espero comunicar através do meu trabalho."',

        // Exhibition Info
        'info-title': 'Visite a Exposição',
        'info-location-title': 'Localização',
        'info-location-text': 'Passagem Literária<br>R. da Consolação x Av. Paulista<br>São Paulo, SP',
        'info-hours-title': 'Horários',
        'info-hours-text': 'Segunda a Sábado<br>11:00 às 18:30<br> Exposição até Dez 2025',
        'info-admission-title': 'Entrada',
        'info-admission-text': 'Geral: Gratuita<br>Acessibilidade: Possui escadas',
        'info-contact-title': 'Contato',
        'info-contact-text': 'Email: sociedadedodescarte@gmail.com<br>Instagram: @passagemliteraria_oficial ; @rukin563',

        // Share buttons
        'share-title': 'Compartilhar:',
        'share-copy': '🔗 Copiar Link',

        // Tom Wray specific content
        'tom-bio': 'De Londres para São Paulo, Tom carrega em suas obras a potência da migração e do diálogo entre culturas. Escultor, pintor e grafiteiro, ele domina múltiplas linguagens artísticas com uma sensibilidade única que nasce da experiência de quem atravessou oceanos para encontrar um novo lar.<br><br>Mestre em Artes Visuais pela USP (2023), Tom não apenas cria arte - ele vive arte. Desde 2010 no Brasil, já deixou sua marca em galerias públicas e privadas, sempre explorando as <strong>transições</strong>, <strong>fronteiras</strong> e <strong>diálogos</strong> que definem nossa experiência contemporânea.',
        'tom-statement': '"Suas obras são pontes: conectam espaços geográficos distantes, culturas distintas e, principalmente, pessoas. Cada traço, cada forma esculpida carrega a potência de quem entende que a arte é, acima de tudo, um território sem fronteiras.<br><br>Na exposição coletiva \'Sociedade do Descarte\', Tom nos convida a refletir sobre pertencimento, identidade e as múltiplas camadas que compõem nossa experiência como seres em constante movimento.<br><br>Acompanhe o artista: @tomwrayart"',

        // Iskor specific content
        'iskor-bio': 'Iskor começou no graffiti nos anos 2000 e hoje transita entre muralismo, pintura e design. Formado em Comunicação Social e especialista em Sociopsicologia, traz um olhar único sobre identidade, memória e história.<br><br><strong>Destaques do currículo:</strong><br>• Ocupação SESI 2023<br>• MAR - Museu de Arte de Rua<br>• SESC Arte ao Cubo<br>• Fundação Ema Klabin<br>• Corredor graffiti Av. 23 de Maio',
        'iskor-statement': '"Professor, artista, pensador: Iskor representa uma geração que conecta a rua, sempre questionando quem somos e de onde viemos.<br><br>Acompanhe o artista: @fe.iskor"',

        // Otica specific content
        'otica-bio': 'André é arquiteto e urbanista pela USP, mas sua paixão pela criação o levou além dos projetos urbanos. Expandiu para o design gráfico, artes visuais e educação, criando uma trajetória diversa e rica.<br><br><strong>Destaques:</strong><br>• Fundou e dirigiu a Escola de Design Thinking (2010-2020)<br>• Criou projetos de branding para Grupo Pão de Açúcar<br>• Co-fundou o coletivo SOMA<br>• Professor universitário desde 2021<br>• Trabalha com técnicas tradicionais e digitais',
        'otica-statement': '"Transformo espaços e mentes através da arte. Cada projeto é uma oportunidade de conectar pessoas com novas perspectivas e possibilidades.<br><br>Siga o artista: @oticaotica"',

        // Milly specific content
        'milly-bio': 'Milly Pannunzio é pedagoga, mestre em Ciência da Informação pela USP e designer pela MIT. Com carreira consolidada em escolas internacionais, ela usa suas múltiplas habilidades criativas para um propósito maior: combater a crise do plástico.<br><br>Desde 2017, Milly trabalha com a própria sucata plástica, criando os famosos "Cipós Urbanos" e outros objetos que inspiram crianças e adultos a reutilizar creativamente.<br><br><strong>Universo criativo:</strong><br>• Desenho, crochê, tear, murais sensoriais<br>• Arte digital e design de interiores<br>• Projetos "Maker" com sustentabilidade<br>• Livros para colorir sobre preservação dos oceanos',
        'milly-statement': '"Transformando lixo em arte, educação em ação: Milly é uma artista que salva oceanos com criatividade! Educadora por formação, artista por paixão: Milly prova que arte e consciência ambiental caminham juntas na construção de um planeta mais sustentável.<br><br>Siga a artista: @millypannunzio"',

        // Luis specific content
        'luis-bio': 'Luis Guimarães carrega 35 anos de experiência em metalurgia e design industrial. Formado pela FATEC e SENAI, ele encontrou no metal mais que um ofício: uma linguagem artística potente e autêntica.<br><br>Escultor, pintor, fotógrafo e educador no SESC e Fábricas de Cultura, Luis pesquisa a metalurgia ancestral e suas novas interpretações contemporâneas.<br><br><strong>Destaques recentes:</strong><br>• "SP a cidade em movimento" - Fábricas de Cultura (2025)<br>• "Ferramental da Invenção" - Casa de Metal (2024)<br>• 14º Salão de Arte Contemporânea - Museu da Imigração Japonesa<br>• Carro Alegórico Cortejo Afro - Salvador',
        'luis-statement': '"Da fábrica para a galeria: Luís é um artista que transforma metal em poesia! Com olhar técnico e sensível, Luis transita entre a precisão industrial e a liberdade artística, provando que toda matéria pode se tornar expressão.<br><br>Siga o artista: @luisguimaraes.arte"',

        // DDois specific content
        'ddois-bio': 'Ddois é artista visual e aderecista de 35 anos, natural de Jundiaí, interior de São Paulo. Com formação em design gráfico e técnico em modelagem, define-se como um "fazedor de coisas" movido pela curiosidade e criatividade.<br><br>Sua pesquisa artística se concentra na reutilização de materiais descartados, transformando o que muitos consideram lixo em obras de arte. Através de um olhar renovado e sustentável, Ddois ressignifica objetos abandonados, dando-lhes nova vida e propósito.',
        'ddois-statement': '"Um artista que transforma descarte em arte, questionando nossos conceitos sobre valor, utilidade e desperdício - perfeitamente alinhado com a proposta da exposição \'Sociedade do Descarte\'.<br><br>Arte + Sustentabilidade + Criatividade: Uma abordagem única que combina técnica, sensibilidade e consciência ambiental.<br><br>Acompanhe o artista: @figuramalquista"',

        // Rukin specific content
        'rukin-bio': 'Rukin563 é um artista independente que explora desenho e pintura. Seus experimentos mais recentes envolvem diferentes suportes: muros, esculturas e lixo se tornam tela para suas criações vibrantes e futuristas.<br><br><strong>Universo visual único:</strong> Influenciado pela arte abstrata, pop arte e as vanguardas artísticas (cubismo, dadaísmo, construtivismo), Rukin desenvolve composições vibrantes e cromáticas que seguem uma linha humanista e positivista, estabelecendo conexões orgânicas com os grandes movimentos da história da arte.<br><br><strong>Inspirações globais:</strong><br>• Imaginário urbano e underground<br>• Tecnologia e ficção científica<br>• Cultura open-source<br>• 13 anos de vivência no Japão',
        'rukin-statement': '"Rukin representa a síntese perfeita entre tradição artística e inovação contemporânea, transformando referências globais em narrativas poéticas que dialogam com o futuro.<br><br>Acompanhe o artista: @rukin563"',

        // Langa specific content
        'langa-bio': 'Langa é um artista visual paulistano que transformou sua paixão pelo desenho, cultivada desde a infância, em uma linguagem artística única e marcante. Seus personagens geométricos interconectados exploram as dimensões mais profundas do ser humano, transmitindo reflexão interior e afeto através da arte urbana.<br><br><strong>Trajetória em destaque:</strong><br>• Casa Galeria • Praça Victor Civita • Passagem Literária da Consolação<br>• Museo Histórico de Itapecerica da Serra • Centro Histórico do Mackenzie<br><br><strong>Projetos especiais:</strong><br>Vivo Call Parade | Elephant Parade | Ear Parade | Art of Love Parade | Jaguar Parade | Vila Reencontro',
        'langa-statement': '"Uma arte que conecta geometria e humanidade, explorando nossas complexas interações interiores.<br><br>Siga o artista: @langa.sp"'
    },

    en: {
        // Navigation
        'nav-home': 'Home',
        'nav-about': 'About',
        'nav-artworks': 'Artworks',
        'nav-collective': 'Collective',
        'nav-artists': 'Artists',
        'nav-visit': 'Visit',

        // Cover
        'cover-presents': 'Planeta Hostil Collective presents:',
        'cover-title': 'THROWAWAY SOCIETY',
        'cover-subtitle': 'Discover how discarded materials transform into artistic multiverses',
        'cover-details1': '8 Artists • Contemporary Works • Mixed Techniques',
        'cover-details2': 'Passagem Literária • São Paulo',
        'cover-details3': 'September to December • 2025',

        // Introduction
        'intro-title': 'About the Exhibition',
        'intro-p1': '<strong>THROWAWAY SOCIETY</strong> is an exhibition that brings together eight contemporary artists whose diverse voices converge to create a powerful dialogue about consumption, waste, and the complex relationship between creation and destruction in modern society.',
        'intro-p2': 'The exhibition presents a critical reflection on society\'s disposal patterns and how art can redefine what we consider "trash" or "obsolete".',
        'intro-p3': 'From bold abstract expressions to intimate figurative works and reimagined traditional techniques, this collection represents the vibrant spectrum of today\'s artistic world.',

        // Artworks
        'artworks-title': 'Featured Artworks',
        'search-placeholder': 'Search by title or artist...',
        'filter-all': 'All',

        // Collective
        'collective-title': 'Planeta Hostil Collective',
        'collective-p1': '<strong>Planeta Hostil</strong> (Hostile Planet) is an artistic collective that emerges as a critical response to the urgent issues of our time that are transforming the planet into an uninhabitable place.',
        'collective-p2': 'From urban interventions to conceptual installations and creative upcycling - we explore the contradictions and possibilities of the contemporary world.',
        'collective-p3': 'Art is used as a tool for critical reflection on our planetary condition, as it has the power to awaken consciousness and promote significant changes in a world that is increasingly connected, yet paradoxically fragmented.',

        // Artists
        'artists-title': 'The Artists',
        'artist-bio-generic': 'Brief artist biography, including their training, education and artistic journey. This section provides context for their work and helps visitors connect with the artist\'s story.',
        'artist-statement-generic': '"My artistic statement or philosophy that guides my creative process and what I hope to communicate through my work."',

        // Exhibition Info
        'info-title': 'Visit the Exhibition',
        'info-location-title': 'Location',
        'info-location-text': 'Passagem Literária<br>R. da Consolação x Av. Paulista<br>São Paulo, SP',
        'info-hours-title': 'Hours',
        'info-hours-text': 'Monday to Saturday<br>11:00 AM to 6:30 PM<br> Exhibition until Dez 2025',
        'info-admission-title': 'Admission',
        'info-admission-text': 'General: Free<br>Accessibility: Has stairs',
        'info-contact-title': 'Contact',
        'info-contact-text': 'Email: sociedadedodescarte@gmail.com<br>Instagram: @passagemliteraria_oficial ; @rukin563',

        // Share buttons
        'share-title': 'Share:',
        'share-copy': '🔗 Copy Link',

        // Tom Wray specific content
        'tom-bio': 'From London to São Paulo, Tom carries in his works the power of migration and dialogue between cultures. Sculptor, painter and graffiti artist, he masters multiple artistic languages with a unique sensitivity that stems from the experience of one who crossed oceans to find a new home.<br><br>Master in Visual Arts from USP (2023), Tom doesn\'t just create art - he lives art. In Brazil since 2010, he has already left his mark in public and private galleries, always exploring the <strong>transitions</strong>, <strong>boundaries</strong> and <strong>dialogues</strong> that define our contemporary experience.',
        'tom-statement': '"His works are bridges: they connect distant geographical spaces, distinct cultures and, mainly, people. Each stroke, each sculpted form carries the power of one who understands that art is, above all, a territory without borders.<br><br>In the collective exhibition \'Throwaway Society\', Tom invites us to reflect on belonging, identity and the multiple layers that make up our experience as beings in constant movement.<br><br>Follow the artist: @tomwrayart"',

        // Iskor specific content
        'iskor-bio': 'Iskor started in graffiti in the 2000s and today moves between muralism, painting and design. Graduated in Social Communication and specialist in Sociopsychology, he brings a unique perspective on identity, memory and history.<br><br><strong>Career highlights:</strong><br>• SESI Occupation 2023<br>• MAR - Street Art Museum<br>• SESC Arte ao Cubo<br>• Ema Klabin Foundation<br>• Graffiti corridor Av. 23 de Maio',
        'iskor-statement': '"Teacher, artist, thinker: Iskor represents a generation that connects the street, always questioning who we are and where we come from.<br><br>Follow the artist: @fe.iskor"',

        // Otica specific content
        'otica-bio': 'André is an architect and urban planner from USP, but his passion for creation led him beyond urban projects. He expanded into graphic design, visual arts and education, creating a diverse and rich trajectory.<br><br><strong>Highlights:</strong><br>• Founded and directed the Design Thinking School (2010-2020)<br>• Created branding projects for Grupo Pão de Açúcar<br>• Co-founded the SOMA collective<br>• University professor since 2021<br>• Works with traditional and digital techniques',
        'otica-statement': '"I transform spaces and minds through art. Each project is an opportunity to connect people with new perspectives and possibilities.<br><br>Follow the artist: @oticaotica"',

        // Milly specific content
        'milly-bio': 'Milly Pannunzio is a pedagogue, master in Information Science from USP and designer from MIT. With a consolidated career in international schools, she uses her multiple creative skills for a greater purpose: combating the plastic crisis.<br><br>Since 2017, Milly works with plastic scrap, creating the famous "Urban Vines" and other objects that inspire children and adults to creatively reuse materials.<br><br><strong>Creative universe:</strong><br>• Drawing, crochet, loom, sensory murals<br>• Digital art and interior design<br>• "Maker" projects with sustainability<br>• Coloring books about ocean preservation',
        'milly-statement': '"Transforming trash into art, education into action: Milly is an artist who saves oceans with creativity! Educator by training, artist by passion: Milly proves that art and environmental awareness walk together in building a more sustainable planet.<br><br>Follow the artist: @millypannunzio"',

        // Luis specific content
        'luis-bio': 'Luis Guimarães carries 35 years of experience in metallurgy and industrial design. Graduated from FATEC and SENAI, he found in metal more than a craft: a powerful and authentic artistic language.<br><br>Sculptor, painter, photographer and educator at SESC and Fábricas de Cultura, Luis researches ancestral metallurgy and its new contemporary interpretations.<br><br><strong>Recent highlights:</strong><br>• "SP the city in movement" - Fábricas de Cultura (2025)<br>• "Tools of Invention" - Casa de Metal (2024)<br>• 14th Contemporary Art Salon - Japanese Immigration Museum<br>• Allegorical Car Afro Procession - Salvador',
        'luis-statement': '"From factory to gallery: Luis is an artist who transforms metal into poetry! With technical and sensitive vision, Luis moves between industrial precision and artistic freedom, proving that all matter can become expression.<br><br>Follow the artist: @luisguimaraes.arte"',

        // DDois specific content
        'ddois-bio': 'DDois is a 35-year-old visual artist and prop maker from Jundiaí, interior of São Paulo. With training in graphic design and technical modeling, he defines himself as a "maker of things" driven by curiosity and creativity.<br><br>His artistic research focuses on reusing discarded materials, transforming what many consider trash into works of art. Through a renewed and sustainable perspective, DDois redefines abandoned objects, giving them new life and purpose.',
        'ddois-statement': '"An artist who transforms waste into art, questioning our concepts about value, utility and waste - perfectly aligned with the \'Throwaway Society\' exhibition proposal.<br><br>Art + Sustainability + Creativity: A unique approach that combines technique, sensitivity and environmental awareness.<br><br>Follow the artist: @figuramalquista"',

        // Rukin specific content
        'rukin-bio': 'Rukin563 is an independent artist who explores drawing and painting. His most recent experiments involve different supports: walls, sculptures and trash become canvas for his vibrant and futuristic creations.<br><br><strong>Unique visual universe:</strong> Influenced by abstract art, pop art and artistic avant-garde movements (cubism, dadaism, constructivism), Rukin develops vibrant and chromatic compositions that follow a humanist and positivist line, establishing organic connections with the great movements in art history.<br><br><strong>Global inspirations:</strong><br>• Urban and underground imagery<br>• Technology and science fiction<br>• Open-source culture<br>• 13 years living in Japan',
        'rukin-statement': '"Rukin represents the perfect synthesis between artistic tradition and contemporary innovation, transforming global references into poetic narratives that dialogue with the future.<br><br>Follow the artist: @rukin563"',

        // Langa specific content
        'langa-bio': 'Langa is a São Paulo visual artist who transformed his passion for drawing, cultivated since childhood, into a unique and striking artistic language. His interconnected geometric characters explore the deepest dimensions of human beings, transmitting inner reflection and affection through urban art.<br><br><strong>Featured trajectory:</strong><br>• Casa Galeria • Praça Victor Civita • Passagem Literária da Consolação<br>• Museo Histórico de Itapecerica da Serra • Centro Histórico do Mackenzie<br><br><strong>Special projects:</strong><br>Vivo Call Parade | Elephant Parade | Ear Parade | Art of Love Parade | Jaguar Parade | Vila Reencontro',
        'langa-statement': '"An art that connects geometry and humanity, exploring our complex inner interactions.<br><br>Follow the artist: @langa.sp"'
    }
};

let currentLanguage = 'pt';

function switchLanguage(lang) {
    currentLanguage = lang;

    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`lang-${lang}`).classList.add('active');

    // Update all translatable content
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (translations[lang] && translations[lang][key]) {
            element.innerHTML = translations[lang][key];
        }
    });

    // Update placeholder text
    document.querySelectorAll('[data-key-placeholder]').forEach(element => {
        const key = element.getAttribute('data-key-placeholder');
        if (translations[lang] && translations[lang][key]) {
            element.setAttribute('placeholder', translations[lang][key]);
        }
    });

    // Render artworks in the selected language
    renderArtworks(lang);

    // Save language preference
    localStorage.setItem('preferred-language', lang);
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedLanguage = localStorage.getItem('preferred-language') || 'pt';
    switchLanguage(savedLanguage);
});