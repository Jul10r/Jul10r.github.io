(() => {
  const coords = document.getElementById("coords");
  const clock = document.getElementById("clock");
  const status = document.getElementById("status");
  const tags = [...document.querySelectorAll(".tag")];
  const items = [...document.querySelectorAll("[data-stack]")];
  const idleText = "Showing everything.";
  let selected = null;

  const pad = (n) => String(n).padStart(4, "0");

  window.addEventListener(
    "mousemove",
    (e) => {
      coords.textContent = `x ${pad(e.pageX)} · y ${pad(e.pageY)}`;
    },
    { passive: true }
  );

  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Tirane",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const tick = () => {
    clock.textContent = `Tirana · ${formatter.format(new Date())}`;
  };

  tick();
  setInterval(tick, 1000);

  const stackOf = (el) => el.dataset.stack.split(",").map((s) => s.trim().toLowerCase());

  const highlight = (skill) => {
    let count = 0;
    items.forEach((item) => {
      const match = Boolean(skill) && stackOf(item).includes(skill.toLowerCase());
      item.classList.toggle("on", match);
      if (match) count += 1;
    });
    return count;
  };

  tags.forEach((tag) => {
    tag.setAttribute("aria-pressed", "false");

    tag.addEventListener("click", () => {
      const skill = tag.dataset.skill;

      if (selected === skill) {
        selected = null;
        tags.forEach((t) => {
          t.classList.remove("on");
          t.setAttribute("aria-pressed", "false");
        });
        highlight(null);
        status.textContent = idleText;
        return;
      }

      selected = skill;
      tags.forEach((t) => {
        const active = t === tag;
        t.classList.toggle("on", active);
        t.setAttribute("aria-pressed", String(active));
      });

      const count = highlight(skill);
      status.textContent = count
        ? `${skill} appears in ${count} ${count === 1 ? "entry" : "entries"} on this page.`
        : `${skill} isn't tied to a project here, but it's part of my coursework and toolkit.`;
    });
  });

  items.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      if (selected) return;
      const stack = stackOf(item);
      tags.forEach((t) => t.classList.toggle("on", stack.includes(t.dataset.skill.toLowerCase())));
    });

    item.addEventListener("mouseleave", () => {
      if (selected) return;
      tags.forEach((t) => t.classList.remove("on"));
    });
  });

  document.querySelectorAll(".copy").forEach((button) => {
    button.addEventListener("click", async () => {
      const label = button.textContent;
      try {
        await navigator.clipboard.writeText(button.dataset.copy);
        button.textContent = "Copied";
      } catch {
        button.textContent = "Failed";
      }
      setTimeout(() => {
        button.textContent = label;
      }, 1500);
    });
  });
  const menuButton = document.querySelector(".menu-btn");
  const rail = document.getElementById("rail");

  const setMenu = (open) => {
    rail.classList.toggle("open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  menuButton.addEventListener("click", () => {
    setMenu(!rail.classList.contains("open"));
  });

  rail.addEventListener("click", (e) => {
    if (e.target.closest("nav a")) setMenu(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && rail.classList.contains("open")) {
      setMenu(false);
      menuButton.focus();
    }
  });

  window.matchMedia("(min-width: 961px)").addEventListener("change", (e) => {
    if (e.matches) setMenu(false);
  });
})();