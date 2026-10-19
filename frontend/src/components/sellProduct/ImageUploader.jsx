import { useRef } from "react";
import styles from "../../styles/sellProduct/ImageUploader.module.css";

const MAX_IMAGES = 5;

export default function ImageUploader({ images, onChange }) {
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const files = Array.from(e.target.files);
    const remaining = MAX_IMAGES - images.length;
    const toAdd = files.slice(0, remaining).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random(),
    }));
    onChange([...images, ...toAdd]);
    e.target.value = "";
  };

  const handleRemove = (id) => {
    onChange(images.filter(img => img.id !== id));
  };

  const setCover = (id) => {
    const img = images.find(i => i.id === id);
    if (!img) return;
    onChange([img, ...images.filter(i => i.id !== id)]);
  };

  return (
    <div>
      <div className={styles.grid}>
        {images.map((img, index) => (
          <div key={img.id} className={styles.thumb}>
            <img src={img.preview} alt={`Upload ${index + 1}`} />
            {index === 0 && <span className={styles.coverBadge}>Cover</span>}
            <button
              type="button"
              className={styles.removeBtn}
              onClick={() => handleRemove(img.id)}
              aria-label="Remove"
            >
              ✕
            </button>
            {index > 0 && (
              <button
                type="button"
                className={styles.coverBtn}
                onClick={() => setCover(img.id)}
              >
                Set Cover
              </button>
            )}
          </div>
        ))}

        {images.length < MAX_IMAGES && (
          <button
            type="button"
            className={styles.uploadBtn}
            onClick={() => fileRef.current?.click()}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span>Add Photo</span>
            <span className={styles.count}>{images.length}/{MAX_IMAGES}</span>
          </button>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleFile}
      />
    </div>
  );
}