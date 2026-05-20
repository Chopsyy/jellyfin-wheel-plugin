import { useEffect, useState } from "react";
import styles from "../styles/Settings.module.css";

const Settings = () => {
  const [baseUrl, setBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState<{
    type: "success" | "error" | "idle";
    message: string;
  }>({ type: "idle", message: "" });
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/jellyfin/config")
      .then((r) => r.json())
      .then((data) => {
        setBaseUrl(data.baseUrl || "");
        setApiKey(data.apiKey || "");
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setStatus({ type: "idle", message: "" });
    try {
      const res = await fetch("/api/jellyfin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl, apiKey }),
      });
      if (!res.ok) throw new Error("Save failed");
      setStatus({ type: "success", message: "Settings saved." });
    } catch {
      setStatus({ type: "error", message: "Failed to save settings." });
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setStatus({ type: "idle", message: "" });
    try {
      const res = await fetch("/api/jellyfin/config", { method: "PUT" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Connection failed");
      setStatus({ type: "success", message: "Connection successful!" });
    } catch (e) {
      setStatus({
        type: "error",
        message: (e as Error).message || "Connection failed",
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Settings</h1>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Jellyfin Connection</h2>
        <p className={styles.hint}>
          Enter your Jellyfin server URL and API key. Generate an API key in
          Jellyfin under <strong>Dashboard → API Keys</strong>.
        </p>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="baseUrl">
            Server URL
          </label>
          <input
            id="baseUrl"
            type="url"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="http://localhost:8096"
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="apiKey">
            API Key
          </label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="••••••••••••••••"
            className={styles.input}
          />
        </div>
        <div className={styles.actions}>
          <button onClick={handleSave} disabled={saving} className={styles.saveBtn}>
            {saving ? "Saving…" : "Save"}
          </button>
          <button onClick={handleTest} disabled={testing} className={styles.testBtn}>
            {testing ? "Testing…" : "Test Connection"}
          </button>
        </div>
        {status.type !== "idle" && (
          <p
            className={
              status.type === "success" ? styles.success : styles.error
            }
          >
            {status.message}
          </p>
        )}
      </section>
    </div>
  );
};

export default Settings;
