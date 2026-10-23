/**
 * Hindhupriya M - Portfolio Main JavaScript
 * Handles Navigation, Theme Switching, Modal Dialogs, Scrollspy, and Form Interactions.
 */

document.addEventListener("DOMContentLoaded", () => {
    // =========================================================================
    // 1. DOM Elements
    // =========================================================================
    const navbar = document.getElementById("navbar");
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const navItems = document.querySelectorAll(".nav-link");
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");
    const backToTopBtn = document.getElementById("backToTop");
    const resumeBtn = document.getElementById("resumeBtn");

    const projectModal = document.getElementById("projectModal");
    const modalBackdrop = document.getElementById("modalBackdrop");
    const modalClose = document.getElementById("modalClose");
    const modalBody = document.getElementById("modalBody");

    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");

    // =========================================================================
    // 2. Dark / Light Theme Mode Management
    // =========================================================================
    const savedTheme = localStorage.getItem("hindhupriya-portfolio-theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Apply initial theme
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (prefersDark) {
        setTheme("dark");
    } else {
        setTheme("light");
    }

    function setTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("hindhupriya-portfolio-theme", theme);
        if (theme === "dark") {
            themeIcon.textContent = "☀️";
            themeToggle.setAttribute("title", "Switch to Light Mode");
        } else {
            themeIcon.textContent = "🌙";
            themeToggle.setAttribute("title", "Switch to Dark Mode");
        }
    }

    themeToggle.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
        const newTheme = currentTheme === "light" ? "dark" : "light";
        setTheme(newTheme);
    });

    // =========================================================================
    // 3. Mobile Navigation Menu
    // =========================================================================
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        menuToggle.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu when a navigation item is clicked
    navItems.forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuToggle.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
        if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
            navLinks.classList.remove("open");
            menuToggle.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        }
    });

    // =========================================================================
    // 4. Scrollspy & Navbar Shadow & Back To Top Button
    // =========================================================================
    const sections = document.querySelectorAll("section[id]");

    window.addEventListener("scroll", () => {
        const scrollY = window.pageYOffset;

        // Navbar shadow on scroll
        if (scrollY > 30) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

        // Show/hide Back to Top button
        if (scrollY > 350) {
            backToTopBtn.classList.add("visible");
        } else {
            backToTopBtn.classList.remove("visible");
        }

        // Scrollspy: update active navigation link
        sections.forEach((current) => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute("id");

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navItems.forEach((link) => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${sectionId}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    });

    // Back to top click
    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // =========================================================================
    // 5. Project Details Data & Modal Handlers
    // =========================================================================
    const projectsData = {
        matrix: {
            title: "Matrix Operation Tool",
            category: "C Programming • Python • Linear Algebra",
            desc: "A comprehensive mathematical utility designed to compute standard and complex matrix transformations. The application handles square and rectangular matrices with strict boundary checks to ensure dimension compatibility for operations.",
            features: [
                "Matrix Addition & Subtraction with real-time dimension validation.",
                "Scalar & Dot Matrix Multiplication with algorithm optimizations.",
                "Matrix Transposition and Determinant calculations.",
                "Error-handling routines preventing arithmetic dimension mismatches.",
                "Interactive command-line interface with clean formatted output grids."
            ],
            tech: "C Language, Python, Dynamic Memory Management, Linear Algebra"
        },
        tax: {
            title: "Income Tax Calculator",
            category: "Java • Object-Oriented Programming • Financial Logic",
            desc: "A reliable financial software application engineered in Java to calculate individual income tax liability based on current progressive tax slab structures, permissible deductions, and taxable exemptions.",
            features: [
                "Implements tiered taxation brackets with accurate marginal tax calculation.",
                "Computes eligible deductions under Section 80C, 80D, and standard allowances.",
                "Structured Object-Oriented design with modular Taxpayer and Bracket classes.",
                "Input sanitization to prevent negative values or improper data entry.",
                "Detailed tax breakdown summary showing gross income, total deductions, and net payable tax."
            ],
            tech: "Java (Core & OOP), Algorithms, Input Validation, Business Logic"
        },
        transaction: {
            title: "Customer Transaction Analysis System",
            category: "Data Structures • Quick Sort • Performance Optimization",
            desc: "An analytical data-processing utility focused on high-volume commercial records. It accepts unsorted customer transactional logs and performs rapid categorization, sorting, and binary searching.",
            features: [
                "Employs Quick Sort algorithm (Divide and Conquer) for O(n log n) average time sorting.",
                "Supports sorting by Transaction ID, Date, Customer Name, and Purchase Amount.",
                "Includes binary search functionality for instant record retrieval.",
                "Generates comprehensive analytical summaries including total spending and average ticket size.",
                "Robust exception handling for corrupted or missing transaction entries."
            ],
            tech: "Java / Python, Quick Sort, Binary Search, Big-O Optimization"
        },
        portfolio: {
            title: "Interactive Personal Portfolio",
            category: "HTML5 • CSS3 • Modern JavaScript",
            desc: "A fully custom, responsive portfolio website built from the ground up for Hindhupriya M. Engineered to showcase academic milestones, technical projects, and skills with modern web standards.",
            features: [
                "Full Dark / Light mode switching with persistent localStorage memory.",
                "Modern responsive architecture tested for phones, tablets, and large screens.",
                "Dynamic interactive project previews via accessible modal dialogs.",
                "Interactive contact form with real-time validation and feedback notifications.",
                "Zero external bloated dependencies; clean vanilla CSS and JavaScript for fast load speeds."
            ],
            tech: "HTML5 Semantic Tags, CSS3 Variables, Flexbox, Grid, ES6+ JavaScript"
        }
    };

    window.openProjectModal = function(projectId) {
        const project = projectsData[projectId];
        if (!project) return;

        modalBody.innerHTML = `
            <div class="modal-body-content">
                <span class="modal-category">${project.category}</span>
                <h2>${project.title}</h2>
                <p class="modal-desc">${project.desc}</p>
                
                <h4 class="modal-section-title">Key Architectural Features:</h4>
                <ul class="modal-list">
                    ${project.features.map(f => `<li>${f}</li>`).join("")}
                </ul>

                <h4 class="modal-section-title">Technologies Used:</h4>
                <p class="modal-desc" style="margin-bottom: 24px;"><strong>${project.tech}</strong></p>

                <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                    <a href="#contact" class="button button-primary" onclick="closeProjectModal()">
                        Discuss This Project &rarr;
                    </a>
                    <button class="button button-ghost" onclick="closeProjectModal()">
                        Close
                    </button>
                </div>
            </div>
        `;

        projectModal.classList.add("active");
        projectModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    };

    function closeProjectModal() {
        projectModal.classList.remove("active");
        projectModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    modalClose.addEventListener("click", closeProjectModal);
    modalBackdrop.addEventListener("click", closeProjectModal);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && projectModal.classList.contains("active")) {
            closeProjectModal();
        }
    });

    // =========================================================================
    // 6. Resume Button Action
    // =========================================================================
    if (resumeBtn) {
        resumeBtn.addEventListener("click", () => {
            // Opens printable resume modal or triggers print preview
            modalBody.innerHTML = `
                <div class="modal-body-content">
                    <span class="modal-category">Curriculum Vitae</span>
                    <h2>Hindhupriya M &bull; Resume</h2>
                    <p class="modal-desc">
                        <strong>Bachelor of Computer Science</strong><br>
                        KG College of Arts and Science (KGCAS), Coimbatore<br>
                        Location: Coimbatore, Tamil Nadu, India<br>
                        Email: hindhupriya.m@example.com
                    </p>
                    <hr style="border: none; border-top: 1px solid var(--border-light); margin: 16px 0;">
                    <h4 class="modal-section-title">Core Competencies:</h4>
                    <p class="modal-desc">Java, Python, C Programming, HTML5, CSS3, JavaScript, MySQL, Data Structures & Algorithms.</p>
                    
                    <h4 class="modal-section-title">Academic Projects:</h4>
                    <ul class="modal-list">
                        <li><strong>Matrix Operation Tool</strong> (C / Python) - Multidimensional algebraic computation engine.</li>
                        <li><strong>Income Tax Calculator</strong> (Java) - Progressive income tax calculation utility.</li>
                        <li><strong>Customer Transaction Analysis</strong> (Java / Python) - Algorithmic sorting with Quick Sort.</li>
                        <li><strong>Personal Portfolio Website</strong> (Web) - Responsive developer showcase.</li>
                    </ul>

                    <div style="display: flex; gap: 12px; margin-top: 20px;">
                        <button class="button button-primary" onclick="window.print()">
                            🖨️ Print / Save as PDF
                        </button>
                        <button class="button button-ghost" onclick="closeProjectModal()">
                            Close
                        </button>
                    </div>
                </div>
            `;
            projectModal.classList.add("active");
            projectModal.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
        });
    }

    // =========================================================================
    // 7. Interactive Contact Form with Validation
    // =========================================================================
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const nameInput = document.getElementById("name");
            const emailInput = document.getElementById("email");
            const subjectInput = document.getElementById("subject");
            const messageInput = document.getElementById("message");

            const nameError = document.getElementById("nameError");
            const emailError = document.getElementById("emailError");
            const subjectError = document.getElementById("subjectError");
            const messageError = document.getElementById("messageError");

            let isValid = true;

            // Reset errors
            [nameError, emailError, subjectError, messageError].forEach(el => el.textContent = "");
            [nameInput, emailInput, subjectInput, messageInput].forEach(el => el.classList.remove("invalid"));

            // Validate Name
            if (!nameInput.value.trim()) {
                nameError.textContent = "Please enter your name.";
                nameInput.classList.add("invalid");
                isValid = false;
            }

            // Validate Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim()) {
                emailError.textContent = "Please enter your email address.";
                emailInput.classList.add("invalid");
                isValid = false;
            } else if (!emailRegex.test(emailInput.value.trim())) {
                emailError.textContent = "Please enter a valid email format.";
                emailInput.classList.add("invalid");
                isValid = false;
            }

            // Validate Subject
            if (!subjectInput.value.trim()) {
                subjectError.textContent = "Please provide a subject.";
                subjectInput.classList.add("invalid");
                isValid = false;
            }

            // Validate Message
            if (!messageInput.value.trim()) {
                messageError.textContent = "Please enter your message.";
                messageInput.classList.add("invalid");
                isValid = false;
            } else if (messageInput.value.trim().length < 10) {
                messageError.textContent = "Message should be at least 10 characters.";
                messageInput.classList.add("invalid");
                isValid = false;
            }

            if (!isValid) return;

            // Simulate form submission
            const submitBtn = document.getElementById("submitBtn");
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.innerHTML = "<span>Sending...</span>";
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerHTML = originalBtnHtml;
                submitBtn.disabled = false;

                formStatus.className = "form-status success";
                formStatus.innerHTML = `
                    🎉 <strong>Thank you, ${escapeHtml(nameInput.value.trim())}!</strong><br>
                    Your message has been received successfully. Hindhupriya will respond shortly.
                `;

                contactForm.reset();

                // Hide status message after 7 seconds
                setTimeout(() => {
                    formStatus.style.display = "none";
                }, 7000);
            }, 800);
        });
    }

    function escapeHtml(string) {
        return String(string).replace(/[&<>"']/g, function(s) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[s];
        });
    }
});
