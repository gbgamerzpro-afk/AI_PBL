// =========================================================
// LIBRA AI
// FRONTEND JAVASCRIPT
// =========================================================


// =========================================================
// API
// =========================================================

const API_BASE_URL =
    "https://ai-pbl-1-r7bh.onrender.com";


// =========================================================
// DOM ELEMENTS
// =========================================================

const interestInput =
    document.getElementById("interestInput");

const loading =
    document.getElementById("loading");

const errorMessage =
    document.getElementById("errorMessage");

const errorText =
    document.getElementById("errorText");

const recommendationResults =
    document.getElementById("recommendationResults");

const recommendationCards =
    document.getElementById("recommendationCards");

const resultCount =
    document.getElementById("resultCount");

const emptyState =
    document.getElementById("emptyState");

const libraryGrid =
    document.getElementById("libraryGrid");

const resourceCount =
    document.getElementById("resourceCount");

const aiEnvironment =
    document.getElementById("aiEnvironment");


// =========================================================
// GET RECOMMENDATIONS
// =========================================================

async function getRecommendations() {

    const interest =
        interestInput.value.trim();


    // -----------------------------------------------------
    // VALIDATION
    // -----------------------------------------------------

    if (!interest) {

        showError(
            "Please enter an interest such as Python, Java, Algorithms or Machine Learning."
        );

        return;

    }


    hideError();


    emptyState.classList.add(
        "hidden"
    );


    recommendationResults.classList.add(
        "hidden"
    );


    loading.classList.remove(
        "hidden"
    );


    try {

        // -------------------------------------------------
        // API REQUEST
        // -------------------------------------------------

        const response =
            await fetch(
                `${API_BASE_URL}/recommend`,
                {

                    method:
                        "POST",

                    headers:
                        {
                            "Content-Type":
                                "application/json"
                        },

                    body:
                        JSON.stringify({

                            interests:
                                interest,

                            number_of_recommendations:
                                5

                        })

                }
            );


        if (!response.ok) {

            throw new Error(
                `Server returned status ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "Recommendation API response:",
            data
        );


        loading.classList.add(
            "hidden"
        );


        displayRecommendations(
            data
        );


    }

    catch (error) {

        console.error(
            "Recommendation error:",
            error
        );


        loading.classList.add(
            "hidden"
        );


        showError(
            "Unable to connect to the recommendation server. Make sure FastAPI is running on port 8000."
        );

    }

}


// =========================================================
// DISPLAY RECOMMENDATIONS
// =========================================================

function displayRecommendations(data) {

    recommendationCards.innerHTML =
        "";


    if (
        !data ||
        !data.recommendations ||
        data.recommendations.length === 0
    ) {

        recommendationResults.classList.add(
            "hidden"
        );


        emptyState.classList.remove(
            "hidden"
        );


        emptyState.querySelector("h3").textContent =
            "No matching resources found";


        emptyState.querySelector("p").textContent =
            "Try another subject or keyword such as Python, Java, Algorithms or Database.";


        return;

    }


    resultCount.textContent =
        `${data.recommendations.length} resources`;


    data.recommendations.forEach(
        (book) => {

            const card =
                createRecommendationCard(
                    book
                );


            recommendationCards.appendChild(
                card
            );

        }
    );


    recommendationResults.classList.remove(
        "hidden"
    );


    // Re-enable 3D card interaction
    setTimeout(
        () => {

            enableCardTilt();

        },

        100
    );


    // Scroll to results
    setTimeout(
        () => {

            recommendationResults.scrollIntoView(
                {

                    behavior:
                        "smooth",

                    block:
                        "start"

                }
            );

        },

        150
    );

}


// =========================================================
// CREATE RECOMMENDATION CARD
// =========================================================

function createRecommendationCard(book) {

    const card =
        document.createElement("div");


    card.className =
        "recommendation-card";


    const score =
        Number(book.score) || 0;


    const percentage =
        Math.min(
            score * 10,
            100
        );


    card.innerHTML = `

        <div class="card-top">

            <div class="rank">
                #${book.rank}
            </div>

            <div class="category">
                ${escapeHTML(book.category)}
            </div>

        </div>


        <h4>
            ${escapeHTML(book.title)}
        </h4>


        <div class="author">
            By ${escapeHTML(book.author)}
        </div>


        <p class="description">
            ${escapeHTML(book.description)}
        </p>


        <div class="score-container">

            <div class="score-label">

                <span>
                    Match Score
                </span>

                <span>
                    ${score}
                </span>

            </div>


            <div class="score-bar">

                <div
                    class="score-fill"
                    style="width: ${percentage}%"
                ></div>

            </div>

        </div>

    `;


    return card;

}


// =========================================================
// LOAD LIBRARY
// =========================================================

async function loadLibrary() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/books`
            );


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "Library API response:",
            data
        );


        displayLibrary(
            data
        );


        if (
            resourceCount &&
            data.books
        ) {

            resourceCount.textContent =
                `${data.books.length}+`;

        }


    }

    catch (error) {

        console.error(
            "Library loading error:",
            error
        );


        libraryGrid.innerHTML = `

            <div class="library-loading">

                <p>
                    Unable to load the library.
                </p>

                <p
                    style="
                        margin-top: 8px;
                        color: #667085;
                    "
                >
                    Make sure the FastAPI backend is running.
                </p>

            </div>

        `;

    }

}


// =========================================================
// DISPLAY LIBRARY
// =========================================================

function displayLibrary(data) {

    libraryGrid.innerHTML =
        "";


    if (
        !data ||
        !data.books ||
        data.books.length === 0
    ) {

        libraryGrid.innerHTML = `

            <div class="library-loading">

                <p>
                    No resources available.
                </p>

            </div>

        `;

        return;

    }


    data.books.forEach(
        (book) => {

            const card =
                document.createElement("div");


            card.className =
                "library-card";


            card.innerHTML = `

                <div class="category">

                    ${escapeHTML(book.category)}

                </div>


                <h3>

                    ${escapeHTML(book.title)}

                </h3>


                <div class="book-author">

                    By ${escapeHTML(book.author)}

                </div>


                <p>

                    ${escapeHTML(book.description)}

                </p>

            `;


            libraryGrid.appendChild(
                card
            );

        }
    );


    // Enable tilt for newly created cards

    setTimeout(
        () => {

            enableCardTilt();

        },

        100
    );

}


// =========================================================
// QUICK SEARCH
// =========================================================

function quickSearch(topic) {

    interestInput.value =
        topic;


    getRecommendations();

}


// =========================================================
// SCROLL TO RECOMMENDATIONS
// =========================================================

function scrollToRecommendations() {

    const section =
        document.getElementById(
            "recommendations"
        );


    if (section) {

        section.scrollIntoView(
            {
                behavior:
                    "smooth"
            }
        );


        setTimeout(
            () => {

                interestInput.focus();

            },

            600
        );

    }

}


// =========================================================
// SCROLL TO LIBRARY
// =========================================================

function scrollToLibrary() {

    const section =
        document.getElementById(
            "library"
        );


    if (section) {

        section.scrollIntoView(
            {
                behavior:
                    "smooth"
            }
        );

    }

}


// =========================================================
// SHOW ERROR
// =========================================================

function showError(message) {

    errorText.textContent =
        message;


    errorMessage.classList.remove(
        "hidden"
    );


    errorMessage.scrollIntoView(
        {

            behavior:
                "smooth",

            block:
                "center"

        }
    );

}


// =========================================================
// HIDE ERROR
// =========================================================

function hideError() {

    errorMessage.classList.add(
        "hidden"
    );

}


// =========================================================
// HTML SECURITY
// =========================================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// =========================================================
// ENTER KEY SEARCH
// =========================================================

if (interestInput) {

    interestInput.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                getRecommendations();

            }

        }
    );

}


// =========================================================
// 3D AI ENVIRONMENT
// =========================================================

function enableAIEnvironment() {

    if (!aiEnvironment) {
        return;
    }


    aiEnvironment.addEventListener(
        "mousemove",
        function(event) {

            const rect =
                aiEnvironment.getBoundingClientRect();


            const x =
                event.clientX - rect.left;


            const y =
                event.clientY - rect.top;


            const centerX =
                rect.width / 2;


            const centerY =
                rect.height / 2;


            const rotateX =
                ((y - centerY) / centerY) * -6;


            const rotateY =
                ((x - centerX) / centerX) * 6;


            aiEnvironment.style.transform =

                `rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)`;

        }
    );


    aiEnvironment.addEventListener(
        "mouseleave",
        function() {

            aiEnvironment.style.transform =
                "rotateX(0deg) rotateY(0deg)";

        }
    );

}


// =========================================================
// 3D CARD TILT
// =========================================================

function enableCardTilt() {

    const cards =
        document.querySelectorAll(
            ".recommendation-card, .library-card"
        );


    cards.forEach(
        (card) => {

            // Prevent duplicate listeners

            if (
                card.dataset.tiltEnabled === "true"
            ) {

                return;

            }


            card.dataset.tiltEnabled =
                "true";


            card.addEventListener(
                "mousemove",
                function(event) {

                    const rect =
                        card.getBoundingClientRect();


                    const x =
                        event.clientX -
                        rect.left;


                    const y =
                        event.clientY -
                        rect.top;


                    const centerX =
                        rect.width / 2;


                    const centerY =
                        rect.height / 2;


                    const rotateX =
                        ((y - centerY) /
                            centerY) *
                        -3;


                    const rotateY =
                        ((x - centerX) /
                            centerX) *
                        3;


                    card.style.transform =

                        `perspective(800px)
                         rotateX(${rotateX}deg)
                         rotateY(${rotateY}deg)
                         translateY(-6px)`;

                }
            );


            card.addEventListener(
                "mouseleave",
                function() {

                    card.style.transform =
                        "";

                }
            );

        }
    );

}


// =========================================================
// SCROLL REVEAL
// =========================================================

function enableScrollReveal() {

    const elements =
        document.querySelectorAll(
            ".recommendation-container, " +
            ".library-card, " +
            ".recommendation-card, " +
            ".step, " +
            ".about-card, " +
            ".library-stat"
        );


    const observer =
        new IntersectionObserver(
            function(entries) {

                entries.forEach(
                    (entry) => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );


                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold:
                    0.12
            }
        );


    elements.forEach(
        (element) => {

            element.classList.add(
                "reveal"
            );


            observer.observe(
                element
            );

        }
    );

}


// =========================================================
// DYNAMIC PARTICLES
// =========================================================

function createParticles() {

    const particleCount =
        22;


    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        const particle =
            document.createElement(
                "div"
            );


        particle.className =
            "particle";


        particle.style.left =
            Math.random() * 100 + "%";


        particle.style.animationDuration =
            (8 + Math.random() * 12) + "s";


        particle.style.animationDelay =
            (-Math.random() * 15) + "s";


        particle.style.opacity =
            0.15 +
            Math.random() * 0.4;


        document.body.appendChild(
            particle
        );

    }

}


// =========================================================
// NAVBAR ACTIVE LINK
// =========================================================

function enableNavbarHighlight() {

    const sections =
        document.querySelectorAll(
            "section[id]"
        );


    const navLinks =
        document.querySelectorAll(
            ".nav-links a"
        );


    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (
                            entry.isIntersecting
                        ) {

                            navLinks.forEach(
                                (link) => {

                                    link.style.color =
                                        "";

                                }
                            );


                            const active =
                                document.querySelector(
                                    `.nav-links a[href="#${entry.target.id}"]`
                                );


                            if (active) {

                                active.style.color =
                                    "var(--gold-bright)";

                            }

                        }

                    }
                );

            },
            {
                threshold:
                    0.25
            }
        );


    sections.forEach(
        (section) => {

            observer.observe(
                section
            );

        }
    );

}


// =========================================================
// INITIALIZATION
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "LIBRA AI frontend loaded successfully."
        );


        // Load library
        loadLibrary();


        // AI 3D environment
        enableAIEnvironment();


        // Floating particles
        createParticles();


        // Scroll animations
        enableScrollReveal();


        // Card tilt
        enableCardTilt();


        // Navbar highlighting
        enableNavbarHighlight();

    }
);
