import { useApi } from "../useApi.js";

export default function Footer() {
  const { data: settings } = useApi("/api/settings");

  return (
    <footer className="footer">
      <p>{settings?.siteName}</p>
      {settings?.contactEmail && (
        <p><a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a></p>
      )}
      <p className="socials">
        {settings?.socials?.github && <a href={settings.socials.github}>GitHub</a>}
        {settings?.socials?.linkedin && <a href={settings.socials.linkedin}>LinkedIn</a>}
        {settings?.socials?.twitter && <a href={settings.socials.twitter}>Twitter</a>}
      </p>
    </footer>
  );
}