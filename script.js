(function () {
    const nav = document.querySelector(".nav");
    const toggle = document.querySelector(".nav-toggle");
    const menu = document.querySelector(".nav-links");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onScroll = () => {
        nav.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (toggle && menu) {
        const setOpen = (open) => {
            menu.classList.toggle("is-open", open);
            toggle.setAttribute("aria-expanded", String(open));
        };

        toggle.addEventListener("click", () => {
            setOpen(!menu.classList.contains("is-open"));
        });

        menu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => setOpen(false));
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") setOpen(false);
        });
    }

    const reveals = document.querySelectorAll(".reveal");
    if (!reduce && "IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("is-in");
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
        );
        reveals.forEach((el) => observer.observe(el));
    } else {
        reveals.forEach((el) => el.classList.add("is-in"));
    }

    const filters = document.querySelectorAll(".filter");
    const items = document.querySelectorAll("[data-tags]");
    const empty = document.querySelector(".filter-empty");

    filters.forEach((button) => {
        button.addEventListener("click", () => {
            const value = button.dataset.filter;
            filters.forEach((item) => {
                item.setAttribute("aria-pressed", String(item === button));
            });

            let shown = 0;
            items.forEach((item) => {
                const tags = item.dataset.tags.split(/\s+/);
                const visible = value === "all" || tags.includes(value);
                item.classList.toggle("is-hidden", !visible);
                if (visible) shown += 1;
            });

            const rowsVisible = [...document.querySelectorAll(".work-row")].some(
                (row) => !row.classList.contains("is-hidden")
            );
            document.querySelector(".more-head")?.classList.toggle("is-hidden", !rowsVisible);
            if (empty) empty.hidden = shown !== 0;
        });
    });

    const links = [...document.querySelectorAll(".nav-links a")];
    const sections = links
        .map((link) => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    if ("IntersectionObserver" in window) {
        const spy = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const id = "#" + entry.target.id;
                    links.forEach((link) => {
                        link.classList.toggle("is-active", link.getAttribute("href") === id);
                    });
                });
            },
            { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
        );
        sections.forEach((section) => spy.observe(section));
    }
})();
