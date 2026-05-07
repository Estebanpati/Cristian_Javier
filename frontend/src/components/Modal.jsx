import { useEffect } from "react";

export default function Modal({ open, onClose, title, icon, children, footer, size = "" }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else      document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal-box ${size === "lg" ? "modal-box-lg" : size === "sm" ? "modal-box-sm" : ""}`}>
        <div className="modal-header-clean">
          <h5>
            {icon && <i className={`bi ${icon}`} style={{ color: "var(--primary)" }}></i>}
            {title}
          </h5>
          <button className="modal-close" onClick={onClose}><i className="bi bi-x-lg"></i></button>
        </div>
        <div className="modal-body-clean">{children}</div>
        {footer && <div className="modal-footer-clean">{footer}</div>}
      </div>
    </div>
  );
}
