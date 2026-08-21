import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

function successToast(msg) {
    Toastify({
        text: msg,
        duration: 3000,
        gravity: "bottom",
        position: "right",
        className: "custom-success-toast",
        style: {
            background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
            color: "#ffffff",
            borderRadius: "10px",
            padding: "12px 20px",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(10px)",
            letterSpacing: "0.3px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            maxWidth: "350px",
            zIndex: 9999
        },
        onClick: function() {}
    }).showToast();
}

function errorToast(msg) {
    Toastify({
        text: msg,
        duration: 4000,
        gravity: "bottom",
        position: "right",
        className: "custom-error-toast",
        style: {
            background: "linear-gradient(135deg, #4a1e3c 0%, #7a2a4a 100%)",
            color: "#ffffff",
            borderRadius: "10px",
            padding: "12px 20px",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(10px)",
            letterSpacing: "0.3px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            maxWidth: "350px",
            zIndex: 9999
        },
        onClick: function() {} 
    }).showToast();
}

function successToastWithIcon(msg) {
    Toastify({
        text: `✅ ${msg}`,
        duration: 3000,
        gravity: "bottom",
        position: "right",
        className: "custom-success-toast",
        style: {
            background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
            color: "#ffffff",
            borderRadius: "12px",
            padding: "14px 24px",
            fontSize: "15px",
            fontWeight: "500",
            boxShadow: "0 12px 28px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(74, 144, 226, 0.3)",
            border: "1px solid rgba(74, 144, 226, 0.3)",
            backdropFilter: "blur(12px)",
            letterSpacing: "0.4px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            maxWidth: "380px",
            zIndex: 9999,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
        },
        onClick: function() {}
    }).showToast();
}

function errorToastWithIcon(msg) {
    Toastify({
        text: `❌ ${msg}`,
        duration: 4000,
        gravity: "bottom",
        position: "right",
        className: "custom-error-toast",
        style: {
            background: "linear-gradient(135deg, #4a1e3c 0%, #6b2e4a 100%)",
            color: "#ffffff",
            borderRadius: "12px",
            padding: "14px 24px",
            fontSize: "15px",
            fontWeight: "500",
            boxShadow: "0 12px 28px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(226, 74, 74, 0.3)",
            border: "1px solid rgba(226, 74, 74, 0.3)",
            backdropFilter: "blur(12px)",
            letterSpacing: "0.4px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            maxWidth: "380px",
            zIndex: 9999,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
        },
        onClick: function() {}
    }).showToast();
}

export { 
    successToast, 
    errorToast,
    successToastWithIcon,
    errorToastWithIcon 
};