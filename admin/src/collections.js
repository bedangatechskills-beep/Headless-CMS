
export const serviceConfig = {
  title: "Services",
  path: "services",
  rowLabel: (item) => `${item.icon} ${item.title}`,
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "blurb", label: "Blurb", type: "textarea" },
    { name: "icon", label: "Icon (an emoji, e.g. 🎨)", type: "text" },
    { name: "displayOrder", label: "Display order (low numbers first)", type: "number" }
  ]
};

export const teamConfig = {
  title: "Team",
  path: "team",
  rowLabel: (item) => `${item.name} — ${item.role}`,
  fields: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "role", label: "Role", type: "text" },
    { name: "photo", label: "Photo", type: "image" },
    { name: "bio", label: "Bio", type: "textarea" },
    { name: "socialLinks.github", label: "GitHub URL", type: "text" },
    { name: "socialLinks.linkedin", label: "LinkedIn URL", type: "text" },
    { name: "socialLinks.twitter", label: "Twitter/X URL", type: "text" }
  ]
};

export const testimonialConfig = {
  title: "Testimonials",
  path: "testimonials",
  rowLabel: (item) => `“${item.quote.slice(0, 40)}…” — ${item.authorName}`,
  fields: [
    { name: "quote", label: "Quote", type: "textarea", required: true },
    { name: "authorName", label: "Author name", type: "text", required: true },
    { name: "authorCompany", label: "Author company", type: "text" },
    { name: "avatar", label: "Avatar", type: "image" }
  ]
};